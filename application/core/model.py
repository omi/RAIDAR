from flask import current_app as app
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib


def send_email(recipients, subject, text, sender=''):

    if app.env == 'development':
        recipients = 'app.aws_ses_sender'

    msg = MIMEMultipart()
    msg['From'] = app.aws_ses_sender
    msg['To'] = recipients
    msg['Subject'] = subject
    msg.attach(MIMEText(text, 'html'))
    server = smtplib.SMTP(app.aws_ses_endpoint)
    server.starttls()
    server.login(app.aws_smtp_username, app.aws_smtp_password)
    server.sendmail(app.aws_ses_sender, recipients, msg.as_string())
    server.quit()
