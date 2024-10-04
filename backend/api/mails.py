from django.core.mail import send_mail
from django.conf import settings


def send_registration_email(first_name, email, link_inscription):
    subject = "Votre inscription sur TrouveTonalternance.com - Aureis"
    message = (
        f"Bonjour {first_name},\n\n"
        f"Vous êtes déjà inscrit(e) dans notre école, et nous souhaitons multiplier vos opportunités d’alternance pour accélérer votre placement.\n\n"
        f"Il vous suffit de compléter votre profil (6 minutes seulement) pour que nous puissions envoyer vos informations aux entreprises les plus adaptées.\n\n"
        f"Veuillez compléter votre inscription en cliquant sur le lien ci-dessous:\n"
        f"{link_inscription}\n\n"
        "À très bientôt !\n"
        "L’équipe d'Aureis Formation"
    )
    from_email = settings.DEFAULT_FROM_EMAIL

    # Send the email
    send_mail(subject, message, from_email, [email])


def send_registration_email_company(name, email, link_inscription):
    subject = "Votre recherche d'alternant - Aureis Formation"
    message = (
        f"Bonjour,\n\n"
        f"Merci de nous avoir confié votre besoin en recrutement d’alternants. Pour vous aider à trouver les candidats qui correspondent le plus à vos attentes, nous vous invitons à utiliser notre système de Matching affinitaire."
        f"Il vous suffit de finaliser votre profil (6 minutes seulement) sur notre plateforme, et vous recevrez instantanément les profils.\n\n"
        f"{link_inscription}\n\n"
        "À très bientôt !\n"
        "L’équipe d'Aureis Formation"
    )
    from_email = settings.DEFAULT_FROM_EMAIL

    # Send the email
    send_mail(subject, message, from_email, [email])


def send_registration_email_staff(name, email, link_inscription):
    subject = "Votre inscription sur TrouveTonalternance.com - Aureis"
    message = (
        f"Bonjour {name},\n\n"
        f"Vous avez été invité à rejoindre notre plateforme de Matching affinitaire pour aider nos alternants à trouver leur entreprise d’accueil.\n\n"
        f"Il vous suffit de définir votre nouveau mot de passe en cliquant sur le lien ci-dessous:\n"
        f"{link_inscription}\n\n"
        "À très bientôt !\n"
        "L’équipe d'Aureis Formation"
    )
    from_email = settings.DEFAULT_FROM_EMAIL

    # Send the email
    send_mail(subject, message, from_email, [email])


def send_reset_password_email(name, email, link_reset_password):
    subject = "Réinitialisation de votre mot de passe - TrouveTonalternance.com"
    message = (
        f"Bonjour {name},\n\n"
        f"Vous avez demandé la réinitialisation de votre mot de passe. Pour choisir un nouveau mot de passe, veuillez cliquer sur le lien ci-dessous:\n"
        f"{link_reset_password}\n\n"
        "À très bientôt !\n"
        "L’équipe d'Aureis Formation"
    )
    from_email = settings.DEFAULT_FROM_EMAIL

    # Send the email
    send_mail(subject, message, from_email, [email])
