from django.core.management.base import BaseCommand
from matching.models import Sector


class Command(BaseCommand):
    help = "Create sectors from company choices"

    def handle(self, *args, **kwargs):
        Sector.create_from_company_choices()
        self.stdout.write(
            self.style.SUCCESS("Successfully created sectors from company choices")
        )
