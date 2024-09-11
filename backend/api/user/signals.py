from django.core.mail import EmailMultiAlternatives
from django.dispatch import receiver
from django.urls import reverse
from django.conf import settings

from django_rest_passwordreset.signals import reset_password_token_created


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    """
    Handles password reset tokens
    When a token is created, an e-mail needs to be sent to the user
    :param sender: View Class that sent the signal
    :param instance: View Instance that sent the signal
    :param reset_password_token: Token Model Object
    :param args:
    :param kwargs:
    :return:
    """

    reset_password_url = "https://themindfulbear.github.io/themindfulbear_redirect?token={}".format(
        reset_password_token.key
    )

    email_subject = "TheMindfulBear Password Reset Request"
    email_body = (
        f"Hi {reset_password_token.user.email},\n\n"
        f"You requested a password reset. Click the link below to reset your password:\n\n"
        f"{reset_password_url}\n\n"
        f"If you didn't request this, please ignore this email.\n\n"
        f"Best regards,\n"
        f"The Mindful Bear Team"
    )

    html_body = f"""
        <p>Hi {reset_password_token.user.email},</p>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href='{reset_password_url}'>Reset your password</a>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>The Mindful Bear Team</p>
    """


    msg = EmailMultiAlternatives(
        email_subject,
        email_body,
        settings.EMAIL_HOST_USER,
        [reset_password_token.user.email]
    )

    msg.attach_alternative(html_body, "text/html")

    msg.send()

