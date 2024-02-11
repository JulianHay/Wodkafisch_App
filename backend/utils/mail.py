from django.core.mail import get_connection
from django.core.mail.message import EmailMessage


def get_mail_connection(from_mail,password):
    return get_connection(
        host='smtp.ionos.de',
        port=587,
        username=from_mail,
        password=password,
        use_tls=True
    )

def send_mail(from_mail,password,subject,body, to):
    with get_mail_connection(from_mail,password) as connection:
        EmailMessage(subject,
                     body,
                     from_mail,
                     to,
                     connection=connection).send()
