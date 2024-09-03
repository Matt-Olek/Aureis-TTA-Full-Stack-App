import django_filters
from matching.models import match_applicant, Applicant, Skill, Formation


class MatchApplicantFilter(django_filters.FilterSet):
    # Filtering fields
    offer = django_filters.CharFilter(
        field_name="offer__title", lookup_expr="icontains"
    )
    formation = django_filters.ModelChoiceFilter(
        field_name="application__applicant__formation",
        queryset=Formation.objects.all(),
        lookup_expr="exact",
    )
    company = django_filters.CharFilter(
        field_name="offer__company__name", lookup_expr="exact"
    )
    application = django_filters.CharFilter(
        field_name="application__applicant__last_name", lookup_expr="icontains"
    )
    status = django_filters.CharFilter(field_name="status", lookup_expr="exact")

    # Filtering based on Applicant model attributes
    first_name = django_filters.CharFilter(
        field_name="application__applicant__first_name", lookup_expr="icontains"
    )
    last_name = django_filters.CharFilter(
        field_name="application__applicant__last_name", lookup_expr="icontains"
    )
    city = django_filters.CharFilter(
        field_name="application__applicant__city", lookup_expr="icontains"
    )
    country = django_filters.CharFilter(
        field_name="application__applicant__country", lookup_expr="icontains"
    )
    phone = django_filters.CharFilter(
        field_name="application__applicant__phone", lookup_expr="icontains"
    )
    diploma = django_filters.CharFilter(
        field_name="application__applicant__diploma", lookup_expr="icontains"
    )
    target_educational_level = django_filters.CharFilter(
        field_name="application__applicant__target_educational_level",
        lookup_expr="icontains",
    )
    duration = django_filters.CharFilter(
        field_name="application__applicant__duration", lookup_expr="exact"
    )
    contract_type = django_filters.CharFilter(
        field_name="application__applicant__contract_type", lookup_expr="icontains"
    )
    location = django_filters.CharFilter(
        field_name="application__applicant__location", lookup_expr="icontains"
    )
    kilometers_away = django_filters.NumberFilter(
        field_name="application__applicant__kilometers_away", lookup_expr="exact"
    )
    skills = django_filters.ModelMultipleChoiceFilter(
        field_name="application__applicant__skills",
        queryset=Skill.objects.all(),
        to_field_name="name",
        conjoined=True,
    )

    class Meta:
        model = match_applicant
        fields = [
            "offer",
            "formation",
            "company",
            "application",
            "status",
            "first_name",
            "last_name",
            "city",
            "country",
            "phone",
            "diploma",
            "target_educational_level",
            "duration",
            "contract_type",
            "location",
            "kilometers_away",
            "skills",
        ]
