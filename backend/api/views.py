from api.serializers import (
    UserSerializer,
    SectorSerializer,
    CodeAPESerializer,
    CompanySerializer,
    JobOfferSerializer,
    OfferTokenSerializer,
    ApplicantSerializer,
    ApplicationSerializer,
    Application_testSerializer,
    Offer_testSerializer,
    TempApplicantSerializer,
    TempCompanySerializer,
    MatchApplicantSerializer,
    FormationSerializer,
    EducationalLevelChoicesSerializer,
)
from matching.models import (
    Sector,
    CodeAPE,
    Company,
    JobOffer,
    OfferToken,
    Applicant,
    Application,
    match_applicant,
    Application_test,
    Offer_test,
    TempApplicant,
    TempCompany,
    Formation,
    Skill,
    TARGET_EDUCATIONAL_LEVEL_CHOICES,
    CONTRACT_TYPE_CHOICES,
    INDUSTRY_CHOICES,
)
from rest_framework.views import APIView
from django.contrib.auth import logout, login
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from django_filters import rest_framework as filters
from rest_framework import generics
from .filters import MatchApplicantFilter
from .mails import send_registration_email
from api.models import CustomUser
import time
from rest_framework.authentication import TokenAuthentication


# ----------------- Models Serializer Views ----------------- #


class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        print(request.user)
        user = request.user
        serializer = UserSerializer(user)
        return Response({"user": serializer.data})


class SectorView(APIView):
    def get(self, request):
        sectors = Sector.objects.all()
        serializer = SectorSerializer(sectors, many=True)
        return Response(serializer.data)


class CodeAPEView(APIView):
    def get(self, request):
        code_apes = CodeAPE.objects.all()
        serializer = CodeAPESerializer(code_apes, many=True)
        return Response(serializer.data)


class CompanyView(APIView):
    def get(self, request):
        companies = Company.objects.all()
        serializer = CompanySerializer(companies, many=True)
        return Response(serializer.data)


class JobOfferView(APIView):
    def get(self, request):
        job_offers = JobOffer.objects.all()
        serializer = JobOfferSerializer(job_offers, many=True)
        return Response(serializer.data)


class OfferTokenView(APIView):
    def get(self, request):
        offer_tokens = OfferToken.objects.all()
        serializer = OfferTokenSerializer(offer_tokens, many=True)
        return Response(serializer.data)


class ApplicantFilter(filters.FilterSet):
    class Meta:
        model = Applicant
        fields = {
            "city": ["exact"],
            "diploma": ["exact"],
            "target_educational_level": ["exact"],
            "contract_type": ["exact"],
            "sector": ["exact"],
        }


class ApplicantSearchView(generics.ListAPIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    serializer_class = ApplicantSerializer
    queryset = Applicant.objects.all()
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filterset_class = ApplicantFilter

    def get_queryset(self):
        print(self.request)
        queryset = super().get_queryset()


class ApplicationView(APIView):
    def get(self, request):
        applications = Application.objects.all()
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data)


class TempApplicantView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, token):
        print("GET")
        temp_applicant = TempApplicant.objects.get(token=token)
        temp_applicant_serializer = TempApplicantSerializer(temp_applicant)
        return Response(temp_applicant_serializer.data)

    def post(self, request, token):
        temp_applicant = TempApplicant.objects.get(token=token)
        temp_applicant_serializer = TempApplicantSerializer(
            temp_applicant, data=request.data
        )
        if temp_applicant_serializer.is_valid():
            temp_applicant_serializer.save()
            return Response(
                temp_applicant_serializer.data, status=status.HTTP_201_CREATED
            )
        return Response(
            temp_applicant_serializer.errors, status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, token):
        temp_applicant = TempApplicant.objects.get(token=token)
        temp_applicant.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class TempCompanyView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, token):
        temp_company = TempCompany.objects.get(token=token)
        temp_company_serializer = TempCompanySerializer(temp_company)
        return Response(temp_company_serializer.data)

    def post(self, request, token):
        temp_company = TempCompany.objects.get(token=token)
        temp_company_serializer = TempCompanySerializer(temp_company, data=request.data)
        if temp_company_serializer.is_valid():
            temp_company_serializer.save()
            return Response(
                temp_company_serializer.data, status=status.HTTP_201_CREATED
            )
        return Response(
            temp_company_serializer.errors, status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, token):
        temp_company = TempCompany.objects.get(token=token)
        temp_company.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class RegisterUserView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            token = request.data.get("token")
            temp_applicant = TempApplicant.objects.filter(token=token).first()
            temp_company = TempCompany.objects.filter(token=token).first()
            password = request.data.get("password")

            if temp_applicant:
                try:
                    user = CustomUser.objects.create_user(
                        email=temp_applicant.email,
                        type="A",
                        password=password,
                        first_name=temp_applicant.first_name,
                        last_name=temp_applicant.last_name,
                    )
                    print(user)
                    login(request, user)
                    return Response(
                        {"message": "Utilisateur créé avec succès"},
                        status=status.HTTP_201_CREATED,
                    )
                except:
                    return Response(
                        {"message": "Utilisateur non créé"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            elif temp_company:
                try:
                    user = CustomUser.objects.create_user(
                        email=temp_company.email,
                        type="C",
                        password=password,
                        first_name=temp_company.name,
                    )
                    print(user)
                    login(request, user)
                    return Response(
                        {"message": "Utilisateur créé avec succès"},
                        status=status.HTTP_201_CREATED,
                    )
                except:
                    return Response(
                        {"message": "Utilisateur non créé"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            else:
                # Wait a second
                time.sleep(1)
                return Response(
                    {"message": "Token not found"}, status=status.HTTP_400_BAD_REQUEST
                )
        except:
            # Wait a second
            time.sleep(1)
            return Response(
                {"message": "Token not found"}, status=status.HTTP_400_BAD_REQUEST
            )


class ApplicantListCreateAPIView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        print("GET")
        applicants = Applicant.objects.all()
        temp_applicants = TempApplicant.objects.filter(applicant__isnull=True)
        applicants_serializer = ApplicantSerializer(applicants, many=True)
        temp_applicants_serializer = TempApplicantSerializer(temp_applicants, many=True)
        return Response(
            {
                "applicants": applicants_serializer.data,
                "temp_applicants": temp_applicants_serializer.data,
            }
        )

    def post(self, request, format=None):
        print("POST")
        print(request.data)
        serializer = TempApplicantSerializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.save()
            for temp_applicant_data in serializer.data:
                email = temp_applicant_data.get("email")
                first_name = temp_applicant_data.get("first_name")
                link_inscription = temp_applicant_data.get("link_inscription")

                send_registration_email(first_name, email, link_inscription)

            return Response(
                {
                    "messages": [
                        "Temporary applicants successfully added and emails sent"
                    ]
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FullApplicantCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        try:
            print("Get")
            applicant = Applicant.objects.get(user=request.user)
            serializer = ApplicantSerializer(applicant)
            return Response(
                {"applicant": serializer.data},
                status=status.HTTP_200_OK,
            )
        except:
            return Response(
                {"message": "Applicant does not exist"},
                status=status.HTTP_404_NOT_FOUND,
            )

    def post(self, request, format=None):
        print("Post")
        data = request.data

        data["user"] = request.user.id
        print(data)
        serializer = ApplicantSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            tempapplicant = TempApplicant.objects.get(email=data["email"])
            tempapplicant.applicant = serializer.instance
            tempapplicant.save()

            return Response(
                {"messages": ["Applicants successfully added"]},
                status=status.HTTP_201_CREATED,
            )
        else:
            print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, format=None):
        print("Put")
        data = request.data
        applicant = Applicant.objects.get(user=request.user)
        serializer = ApplicantSerializer(applicant, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"messages": ["Applicants successfully updated"]},
                status=status.HTTP_201_CREATED,
            )
        else:
            print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CompanyListCreateAPIView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, format=None):

        companies = Company.objects.all()
        temp_companies = TempCompany.objects.filter(company__isnull=True)
        companies_serializer = CompanySerializer(companies, many=True)
        temp_companies_serializer = TempCompanySerializer(temp_companies, many=True)
        return Response(
            {
                "companies": companies_serializer.data,
                "temp_companies": temp_companies_serializer.data,
            }
        )

    def post(self, request, format=None):
        serializer = TempCompanySerializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.save()
            for temp_company_data in serializer.data:
                email = temp_company_data.get("email")
                name = temp_company_data.get("name")
                link_inscription = temp_company_data.get("link_inscription")

                send_registration_email(name, email, link_inscription)
            return Response(
                {"messages": ["Temp company added successfully."]},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MatchApplicantListCreateView(generics.ListCreateAPIView):
    queryset = match_applicant.objects.all()
    serializer_class = MatchApplicantSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = MatchApplicantFilter


class FormationListCreateView(generics.ListCreateAPIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    queryset = Formation.objects.all()
    serializer_class = FormationSerializer


class FormationDeleteView(generics.DestroyAPIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    queryset = Formation.objects.all()
    serializer_class = FormationSerializer


class EducationalLevelChoicesView(APIView):
    def get(self, request):
        """
        Returns the available choices for the educational level field.
        """
        serializer = EducationalLevelChoicesSerializer()
        return Response(serializer.fields["level"].choices)


class CustomUserView(APIView):
    def get(self, request):
        current_user = request.user
        if current_user.is_authenticated:
            return Response(
                {
                    "first_name": current_user.first_name,
                    "last_name": current_user.last_name,
                    "email": current_user.email,
                },
                status=status.HTTP_200_OK,
            )
        return Response(
            {"message": "User not authenticated"}, status=status.HTTP_401_UNAUTHORIZED
        )


class ChoicesView(APIView):
    def get(self, request):
        """
        Returns the available choices for the educational level field.
        """
        if request.GET.get("target_educational_level"):
            return Response(TARGET_EDUCATIONAL_LEVEL_CHOICES)
        if request.GET.get("contract_type"):
            return Response(CONTRACT_TYPE_CHOICES)
        if request.GET.get("duration"):
            return Response(Applicant.DURATION_CHOICES)

        return Response(
            {"message": "No choices found."}, status=status.HTTP_404_NOT_FOUND
        )
