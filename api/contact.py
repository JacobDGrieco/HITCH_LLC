import json
import os
import smtplib
import ssl
from email.message import EmailMessage
from http.server import BaseHTTPRequestHandler


def _json(handler: BaseHTTPRequestHandler, status: int, payload: dict) -> None:
    body = json.dumps(payload).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(body)))
    handler.send_header("Access-Control-Allow-Origin", "*")
    handler.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    handler.send_header("Access-Control-Allow-Headers", "Content-Type")
    handler.end_headers()
    handler.wfile.write(body)


def _get_env(name: str, default: str = "") -> str:
    value = os.environ.get(name, default)
    return value.strip() if isinstance(value, str) else default


def _send_email(name: str, email: str, subject: str, message: str) -> None:
    smtp_host = _get_env("SMTP_HOST")
    smtp_port = int(_get_env("SMTP_PORT", "587"))
    smtp_use_tls = _get_env("SMTP_USE_TLS", "true").lower() in {
        "1",
        "true",
        "yes",
        "on",
    }
    smtp_username = _get_env("SMTP_USERNAME")
    smtp_password = _get_env("SMTP_PASSWORD")
    smtp_from_email = _get_env("SMTP_FROM_EMAIL", smtp_username)
    smtp_from_name = _get_env("SMTP_FROM_NAME", "HITCH Contact Form")
    smtp_to_email = _get_env("SMTP_TO_EMAIL")

    missing = [
        key
        for key, value in {
            "SMTP_HOST": smtp_host,
            "SMTP_USERNAME": smtp_username,
            "SMTP_PASSWORD": smtp_password,
            "SMTP_FROM_EMAIL": smtp_from_email,
            "SMTP_TO_EMAIL": smtp_to_email,
        }.items()
        if not value
    ]
    if missing:
        raise RuntimeError(f"Missing email configuration: {', '.join(missing)}")

    msg = EmailMessage()
    msg["Subject"] = f"HITCH Contact: {subject or 'New Message'}"
    msg["From"] = f"{smtp_from_name} <{smtp_from_email}>"
    msg["To"] = smtp_to_email
    msg["Reply-To"] = email

    safe_name = name.strip() or "Anonymous"
    safe_email = email.strip()
    safe_subject = subject.strip() or "No subject"
    safe_message = message.strip()

    msg.set_content(
        f"New contact form submission\n\n"
        f"Name: {safe_name}\n"
        f"Email: {safe_email}\n"
        f"Subject: {safe_subject}\n\n"
        f"Message:\n{safe_message}\n"
    )

    if smtp_use_tls:
        context = ssl.create_default_context()
        with smtplib.SMTP(smtp_host, smtp_port, timeout=20) as server:
            server.ehlo()
            server.starttls(context=context)
            server.ehlo()
            server.login(smtp_username, smtp_password)
            server.send_message(msg)
    else:
        with smtplib.SMTP(smtp_host, smtp_port, timeout=20) as server:
            server.ehlo()
            server.login(smtp_username, smtp_password)
            server.send_message(msg)


class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        _json(self, 200, {"ok": True})

    def do_GET(self):
        _json(self, 200, {"ok": True, "message": "Contact endpoint is reachable."})

    def do_POST(self):
        try:
            content_length = int(self.headers.get("Content-Length", "0"))
            raw_body = self.rfile.read(content_length) if content_length > 0 else b"{}"
            data = json.loads(raw_body.decode("utf-8") or "{}")

            name = str(data.get("name", "")).strip()
            email = str(data.get("email", "")).strip()
            subject = str(data.get("subject", "")).strip()
            message = str(data.get("message", "")).strip()
            company = str(data.get("company", "")).strip()  # honeypot

            if company:
                _json(self, 200, {"ok": True})
                return

            if not name:
                _json(self, 400, {"ok": False, "error": "Name is required."})
                return

            if not email or "@" not in email:
                _json(self, 400, {"ok": False, "error": "A valid email is required."})
                return

            if not message:
                _json(self, 400, {"ok": False, "error": "Message is required."})
                return

            _send_email(name=name, email=email, subject=subject, message=message)
            _json(self, 200, {"ok": True})
        except smtplib.SMTPAuthenticationError as exc:
            _json(
                self, 500, {"ok": False, "error": f"SMTP authentication failed: {exc}"}
            )
        except smtplib.SMTPException as exc:
            _json(self, 500, {"ok": False, "error": f"SMTP error: {exc}"})
        except Exception as exc:
            _json(self, 500, {"ok": False, "error": str(exc)})
