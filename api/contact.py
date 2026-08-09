"""FastAPI contact endpoint that sends desktop contact-form submissions by SMTP."""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import smtplib
import ssl
import traceback
from email.message import EmailMessage

app = FastAPI()

class ContactPayload(BaseModel):
    name: str
    email: str
    subject: str = ""
    message: str
    # Honeypot field: real users never fill this, so populated submissions are accepted silently.
    company: str = ""

@app.get("/api/contact")
def contact_health():
    return {"ok": True, "message": "Contact endpoint is reachable."}

@app.post("/api/contact")
def contact_send(payload: ContactPayload):
    """Validate and forward contact submissions without exposing the honeypot to users."""
    if payload.company:
        return {"ok": True}

    if "@" not in payload.email:
        raise HTTPException(status_code=400, detail="A valid email is required.")

    try:
        smtp_host = os.environ["SMTP_HOST"]
        smtp_port = int(os.environ.get("SMTP_PORT", "587"))
        smtp_use_tls = os.environ.get("SMTP_USE_TLS", "true").lower() in {"1", "true", "yes", "on"}
        smtp_username = os.environ["SMTP_USERNAME"]
        smtp_password = os.environ["SMTP_PASSWORD"]
        smtp_from_email = os.environ.get("SMTP_FROM_EMAIL", smtp_username)
        smtp_from_name = os.environ.get("SMTP_FROM_NAME", "HITCH Contact Form")
        smtp_to_email = os.environ["SMTP_TO_EMAIL"]
    except KeyError as exc:
        missing_key = str(exc).strip("'")
        print(f"Contact form misconfiguration: missing env var {missing_key}")
        raise HTTPException(status_code=500, detail=f"Server is missing required email configuration: {missing_key}")

    msg = EmailMessage()
    msg["Subject"] = f"HITCH Contact: {payload.subject or 'New Message'}"
    msg["From"] = f"{smtp_from_name} <{smtp_from_email}>"
    msg["To"] = smtp_to_email
    msg["Reply-To"] = payload.email
    msg.set_content(
        f"New contact form submission\n\n"
        f"Name: {payload.name}\n"
        f"Email: {payload.email}\n"
        f"Subject: {payload.subject or 'No subject'}\n\n"
        f"Message:\n{payload.message}\n"
    )

    try:
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
                server.login(smtp_username, smtp_password)
                server.send_message(msg)

        print(f"Contact form email accepted by SMTP for {payload.email} -> {smtp_to_email}")
        return {"ok": True}
    except Exception as exc:
        print(f"Contact form SMTP send failed: {exc}")
        print(traceback.format_exc())
        raise HTTPException(status_code=502, detail=f"Email delivery failed: {exc}")
