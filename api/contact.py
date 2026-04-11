import json
import os
import re
import smtplib
from email.message import EmailMessage
from email.utils import formataddr
from html import escape


def _json(start_response, status_code: int, body: dict):
    payload = json.dumps(body).encode('utf-8')
    status_text = {
        200: '200 OK',
        204: '204 No Content',
        400: '400 Bad Request',
        405: '405 Method Not Allowed',
        500: '500 Internal Server Error',
    }.get(status_code, f'{status_code} OK')
    headers = [
        ('Content-Type', 'application/json; charset=utf-8'),
        ('Content-Length', str(len(payload))),
        ('Access-Control-Allow-Methods', 'POST, OPTIONS'),
        ('Access-Control-Allow-Headers', 'Content-Type'),
    ]
    start_response(status_text, headers)
    return [payload]


def _empty(start_response, status_code: int = 204):
    status_text = {204: '204 No Content'}.get(status_code, f'{status_code} No Content')
    start_response(status_text, [
        ('Access-Control-Allow-Methods', 'POST, OPTIONS'),
        ('Access-Control-Allow-Headers', 'Content-Type'),
        ('Content-Length', '0'),
    ])
    return [b'']


def _read_json_body(environ) -> dict:
    try:
        length = int(environ.get('CONTENT_LENGTH') or '0')
    except ValueError:
        length = 0

    raw = environ['wsgi.input'].read(length) if length > 0 else b''
    if not raw:
        return {}

    try:
        parsed = json.loads(raw.decode('utf-8'))
        return parsed if isinstance(parsed, dict) else {}
    except Exception:
        raise ValueError('Invalid JSON body')


def _normalize_email(value: str) -> str:
    email = (value or '').strip()
    if not re.match(r'^[^@\s]+@[^@\s]+\.[^@\s]+$', email):
        raise ValueError('Please enter a valid email address.')
    return email


def _send_email(name: str, email: str, subject: str, message: str):
    smtp_host = os.environ.get('SMTP_HOST', '').strip()
    smtp_port = int(os.environ.get('SMTP_PORT', '587'))
    smtp_username = os.environ.get('SMTP_USERNAME', '').strip()
    smtp_password = os.environ.get('SMTP_PASSWORD', '').strip()
    smtp_from_email = os.environ.get('SMTP_FROM_EMAIL', '').strip() or smtp_username
    smtp_from_name = os.environ.get('SMTP_FROM_NAME', 'HITCH Contact Form').strip()
    smtp_to_email = os.environ.get('SMTP_TO_EMAIL', '').strip()
    smtp_use_tls = os.environ.get('SMTP_USE_TLS', 'true').strip().lower() not in {'0', 'false', 'no', 'off'}

    missing = [
        key
        for key, value in {
            'SMTP_HOST': smtp_host,
            'SMTP_USERNAME': smtp_username,
            'SMTP_PASSWORD': smtp_password,
            'SMTP_FROM_EMAIL': smtp_from_email,
            'SMTP_TO_EMAIL': smtp_to_email,
        }.items()
        if not value
    ]
    if missing:
        raise RuntimeError(f'Missing email configuration: {", ".join(missing)}')

    msg = EmailMessage()
    msg['Subject'] = f'HITCH contact — {subject}' if subject else 'HITCH contact form message'
    msg['From'] = formataddr((smtp_from_name, smtp_from_email))
    msg['To'] = smtp_to_email
    msg['Reply-To'] = email

    safe_name = escape(name)
    safe_email = escape(email)
    safe_subject = escape(subject) if subject else 'None provided'
    safe_message_html = escape(message).replace('\n', '<br />')

    msg.set_content(
        '\n'.join([
            'New HITCH contact form message',
            '',
            f'Name: {name}',
            f'Email: {email}',
            f'Subject: {subject or "None provided"}',
            '',
            'Message:',
            message,
        ])
    )
    msg.add_alternative(
        f'''
        <div style="font-family:Arial,sans-serif;line-height:1.55;color:#2f2342;max-width:640px;margin:0 auto;padding:24px;background:#fff8fc;border:1px solid #f0d6e7;border-radius:16px;">
          <h2 style="margin:0 0 16px;font-size:22px;color:#7f4ea0;">New HITCH contact form message</h2>
          <p style="margin:0 0 12px;"><strong>Name:</strong> {safe_name}</p>
          <p style="margin:0 0 12px;"><strong>Email:</strong> {safe_email}</p>
          <p style="margin:0 0 12px;"><strong>Subject:</strong> {safe_subject}</p>
          <div style="margin-top:18px;padding:16px;background:#ffffff;border:1px solid #ecd7ea;border-radius:12px;">
            <strong>Message</strong>
            <p style="margin:10px 0 0;">{safe_message_html}</p>
          </div>
        </div>
        ''',
        subtype='html',
    )

    with smtplib.SMTP(smtp_host, smtp_port, timeout=20) as server:
        server.ehlo()
        if smtp_use_tls:
            server.starttls()
            server.ehlo()
        server.login(smtp_username, smtp_password)
        server.send_message(msg)


def app(environ, start_response):
    method = environ.get('REQUEST_METHOD', 'GET').upper()

    if method == 'OPTIONS':
        return _empty(start_response, 204)

    if method != 'POST':
        return _json(start_response, 405, {'error': 'Method not allowed'})

    try:
        body = _read_json_body(environ)
        name = (body.get('name') or '').strip()
        email = _normalize_email(body.get('email') or '')
        subject = (body.get('subject') or '').strip()[:160]
        message = (body.get('message') or '').strip()
        company = (body.get('company') or '').strip()

        if company:
            return _json(start_response, 200, {'ok': True})

        if not name or not message:
            return _json(start_response, 400, {'error': 'Missing required fields'})

        _send_email(name=name[:120], email=email, subject=subject, message=message[:5000])
        return _json(start_response, 200, {'ok': True})
    except ValueError as exc:
        return _json(start_response, 400, {'error': str(exc)})
    except smtplib.SMTPAuthenticationError:
        return _json(start_response, 500, {'error': 'SMTP login failed. Check SMTP_USERNAME and SMTP_PASSWORD.'})
    except smtplib.SMTPException as exc:
        return _json(start_response, 500, {'error': f'SMTP error: {exc}'})
    except Exception as exc:
        return _json(start_response, 500, {'error': f'Server error: {exc}'})
