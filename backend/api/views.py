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
    JobOffer,
    TempApplicant,
    TempCompany,
    Formation,
    Skill,
    company_user_link,
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
from rest_framework import viewsets
from .filters import MatchApplicantFilter
from .mails import send_registration_email, send_registration_email_company
from api.models import CustomUser
import time
from django.shortcuts import get_object_or_404


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


class JobOfferListCreateView(APIView):
    def get(self, request):
        user = request.user
        try:
            link = company_user_link.objects.get(user=user)
            company = link.company
            job_offers = JobOffer.objects.filter(company=company)
            serializer = JobOfferSerializer(job_offers, many=True)
            return Response(serializer.data)
        except:
            return Response(
                {"message": "Company does not exist"},
                status=status.HTTP_404_NOT_FOUND,
            )

    def post(self, request):
        data = request.data
        user = request.user
        try:
            link = company_user_link.objects.get(user=user)
            company = link.company
            data["company"] = company.id
            serializer = JobOfferSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(
                {"message": "Company does not exist"},
                status=status.HTTP_404_NOT_FOUND,
            )

    def put(self, request, pk):
        job_offer = get_object_or_404(JobOffer, pk=pk)
        serializer = JobOfferSerializer(job_offer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        job_offer = get_object_or_404(JobOffer, pk=pk)
        job_offer.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ApplicationTestMetadataView(APIView):
    """
    API endpoint that provides metadata for the Application_test model fields.
    """

    def get(self, request):
        serializer = Application_testSerializer()
        metadata = serializer.get_field_metadata()
        return Response(metadata, status=status.HTTP_200_OK)


class ApplicationTestDetailView(APIView):
    """
    API endpoint that retrieves, updates, or deletes an Application_test instance.
    """

    def get(self, request):
        try:
            user = request.user
            applicant = Applicant.objects.get(user=user)
            application = Application.objects.get(applicant=applicant)
            application_test = Application_test.objects.get(application=application)
            serializer = Application_testSerializer(application_test)
            return Response(serializer.data)
        except Applicant.DoesNotExist:
            return Response(
                {"message": "Applicant does not exist"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Application.DoesNotExist:
            return Response(
                {"message": "Application does not exist"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Application_test.DoesNotExist:
            return Response(
                {"message": "Application test does not exist"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def put(self, request):
        try:
            user = request.user
            applicant = Applicant.objects.get(user=user)
            application = Application.objects.get(applicant=applicant)
            try:
                application_test = Application_test.objects.get(application=application)
            except Application_test.DoesNotExist:
                application_test = Application_test(application=application)
            serializer = Application_testSerializer(application_test, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Applicant.DoesNotExist:
            return Response(
                {"message": "Applicant does not exist"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Application.DoesNotExist:
            return Response(
                {"message": "Application does not exist"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def delete(self, request, pk):
        try:
            application_test = get_object_or_404(Application_test, pk=pk)
            application_test.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Application_test.DoesNotExist:
            return Response(
                {"message": "Application test does not exist"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


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


class ApplicantInfo(APIView):
    def get(self, request):
        applicant_user = request.user
        applicant_page = False
        applicant_test = False
        applicant_matches = False
        try:
            applicant = Applicant.objects.get(user=applicant_user)
            applicant_page = True
        except:
            pass
        try:
            application = Application.objects.get(applicant=applicant)
            applicant_test = Application_test.objects.get(application=application)
            applicant_test = True
        except:
            pass
        try:
            applicant_matches = match_applicant.objects.filter(applicant=applicant)
            applicant_matches = True
        except:
            pass
        return Response(
            {
                "applicant_page": applicant_page,
                "applicant_test": applicant_test,
                "applicant_matches": applicant_matches,
            }
        )


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
            print(request.data)
            if temp_applicant:
                try:
                    print("Creating user")
                    print(temp_applicant.email)
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
                except Exception as e:
                    print("Error creating user : ", e)
                    return Response(
                        {"message": "Utilisateur non créé " + str(e)},
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
                    company = Company.objects.create(
                        name=temp_company.name,
                    )
                    temp_company.company = company
                    temp_company.save()
                    company_user_link.objects.create(company=company, user=user)
                    print(user)
                    login(request, user)
                    return Response(
                        {"message": "Utilisateur créé avec succès"},
                        status=status.HTTP_201_CREATED,
                    )
                except Exception as e:
                    return Response(
                        {"message": "Utilisateur non créé" + str(e)},
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
            application = Application.objects.get_or_create(
                applicant=serializer.instance
            )[0]
            application.save()

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
            application = Application.objects.get_or_create(
                applicant=serializer.instance
            )[0]
            application.save()
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

                send_registration_email_company(name, email, link_inscription)
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
