from matching.models import (
    Sector,
    CodeAPE,
    Company,
    JobOffer,
    Applicant,
    Application,
    match_applicant,
    Application_test,
    Offer_test,
    TempApplicant,
    TempCompany,
    Formation,
    FormationmanagementLink,
    Skill,
)
from api.models import CustomUser
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = (
            "id",
            "email",
            "type",
            "first_name",
            "last_name",
            "is_active",
            "is_staff",
            "is_superuser",
        )


class FormationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Formation
        fields = "__all__"


class CodeAPESerializer(serializers.ModelSerializer):
    class Meta:
        model = CodeAPE
        fields = "__all__"


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = "__all__"


class JobOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobOffer
        fields = "__all__"


class SectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sector
        fields = "__all__"


class ApplicantSerializer(serializers.ModelSerializer):
    sector = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Sector.objects.all(), required=False
    )
    skills = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Skill.objects.all(), required=False
    )
    formation = serializers.PrimaryKeyRelatedField(
        queryset=Formation.objects.all(), required=False
    )

    class Meta:
        model = Applicant
        fields = "__all__"


class ApplicationSerializer(serializers.ModelSerializer):
    applicant = ApplicantSerializer()

    class Meta:
        model = Application
        fields = "__all__"


class Application_testSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application_test
        exclude = ["application", "id"]

    def get_field_metadata(self):
        field_metadata = {}
        for field_name, field in self.fields.items():
            field_metadata[field_name] = {
                "type": field.__class__.__name__,
                "choices": field.choices if hasattr(field, "choices") else None,
                "label": field.label,
                "required": field.required,
            }
        return field_metadata


class Offer_testSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer_test
        exclude = ["offer", "id"]

    def get_field_metadata(self):
        field_metadata = {}
        for field_name, field in self.fields.items():
            field_metadata[field_name] = {
                "type": field.__class__.__name__,
                "choices": field.choices if hasattr(field, "choices") else None,
                "label": field.label,
                "required": field.required,
            }
        return field_metadata


class TempApplicantSerializer(serializers.ModelSerializer):
    link_inscription = serializers.SerializerMethodField()

    class Meta:
        model = TempApplicant
        fields = "__all__"

    def get_link_inscription(self, obj):
        return obj.link_inscription()


class TempCompanySerializer(serializers.ModelSerializer):
    link_inscription = serializers.SerializerMethodField()

    class Meta:
        model = TempCompany
        fields = "__all__"

    def get_link_inscription(self, obj):
        return obj.link_inscription()


class MatchApplicantSerializer(serializers.ModelSerializer):
    offer = JobOfferSerializer()
    application = ApplicationSerializer()

    class Meta:
        model = match_applicant
        fields = "__all__"


class EducationalLevelChoicesSerializer(serializers.Serializer):
    level = serializers.ChoiceField(choices=Formation._meta.get_field("level").choices)


class FormationmanagementLinkSerializer(serializers.ModelSerializer):
    # manager = serializers.StringRelatedField()
    # formation = serializers.StringRelatedField()

    class Meta:
        model = FormationmanagementLink
        fields = "__all__"
