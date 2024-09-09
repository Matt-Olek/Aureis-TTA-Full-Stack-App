from django.core.mail import send_mail
from django.conf import settings


def send_registration_email(first_name, email, link_inscription):
    """
    Sends a registration email to a temporary applicant.

    Parameters:
        first_name (str): The first name of the applicant.
        email (str): The email address of the applicant.
        link_inscription (str): The registration link for the applicant.
    """
    subject = "Votre inscription sur TrouveTonalternance.com - Aureis"
    message = (
        f"Bonjour {first_name},\n\n"
        f"Vous êtes déjà inscrit(e) dans notre école, et nous souhaitons multiplier vos opportunités d’alternance pour accélérer votre placement.\n\n"
        f"Il vous suffit de compléter votre profil (6 minutes seulement) pour que nous puissions envoyer vos informations aux entreprises les plus adaptées.\n\n"
        f"Veuillez compléter votre inscription en cliquant sur le lien ci-dessous:\n"
        f"{link_inscription}\n\n"
        "À très bientôt !\n"
        "L’équipe TrouveTonalternance.com"
    )
    from_email = settings.DEFAULT_FROM_EMAIL

    # Send the email
    send_mail(subject, message, from_email, [email])
    
def send_registration_email_company(name, email, link_inscription):
    
