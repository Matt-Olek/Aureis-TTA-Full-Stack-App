from api.serializers import (
    UserSerializer,
    SectorSerializer,
    CodeAPESerializer,
    CompanySerializer,
    JobOfferSerializer,
    ApplicantSerializer,
    ApplicationSerializer,
    Application_testSerializer,
    Offer_testSerializer,
    TempApplicantSerializer,
    TempCompanySerializer,
    MatchApplicantSerializer,
    FormationSerializer,
    EducationalLevelChoicesSerializer,
    FormationmanagementLinkSerializer,
)
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
    JobOffer,
    TempApplicant,
    TempCompany,
    Formation,
    Skill,
    company_user_link,
    TARGET_EDUCATIONAL_LEVEL_CHOICES,
    CONTRACT_TYPE_CHOICES,
    INDUSTRY_CHOICES,
    FormationmanagementLink,
)
from rest_framework.views import APIView
from django.contrib.auth import login
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login
from rest_framework.permissions import AllowAny, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from django_filters import rest_framework as filters
from rest_framework import generics
from .filters import MatchApplicantFilter
from .mails import (
    send_registration_email,
    send_registration_email_company,
    send_registration_email_staff,
    send_reset_password_email,
)
from api.models import CustomUser
import time
from matching.matching_process import launch_matching
from django.shortcuts import get_object_or_404
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.conf import settings
from django.http import HttpResponse, FileResponse
from django.views import View
import os


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


class CompanyView(APIView):
    def get(self, request):
        user = request.user
        if user.is_authenticated:
            if user.is_superuser:
                companies = Company.objects.all()
                serializer = CompanySerializer(companies, many=True)
                return Response(serializer.data)
            elif user.is_staff:
                company = company_user_link.objects.get(user=user).company
                serializer = CompanySerializer(company)
                return Response(serializer.data)
            else:
                company = company_user_link.objects.get(user=user).company
                serializer = CompanySerializer(company)
                return Response(serializer.data)
        else:
            return Response(
                {"message": "User not authenticated"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

    def post(self, request):
        data = request.data
        user = request.user
        if user.is_authenticated:
            try:
                link = company_user_link.objects.get(user=user)
                company = link.company
                company_serializer = CompanySerializer(company, data=data)
                if company_serializer.is_valid():
                    company_serializer.save()
                    return Response(
                        company_serializer.data, status=status.HTTP_201_CREATED
                    )
                else:
                    print(company_serializer.errors)
                    return Response(
                        company_serializer.errors, status=status.HTTP_400_BAD_REQUEST
                    )
            except Exception as e:
                print(e)
                return Response(
                    {"message": "Company does not exist"},
                    status=status.HTTP_404_NOT_FOUND,
                )

    def delete(self, request, pk):
        user = request.user
        if user.is_authenticated and (user.is_superuser or user.is_staff):
            company = get_object_or_404(Company, pk=pk)
            company.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(
                {"message": "User not authorized"}, status=status.HTTP_401_UNAUTHORIZED
            )


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


class CompanyTestMetadataView(APIView):
    """
    API endpoint that provides metadata for the Offer_test model fields.
    """

    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        serializer = Offer_testSerializer()
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

    def post(self, request):
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


class CompanyTestDetailView(APIView):
    """
    API endpoint that retrieves, updates, or deletes an Offer_test instance.
    """

    authentication_classes = []
    permission_classes = [AllowAny]

    def put(self, request, token):
        try:
            offer = JobOffer.objects.get(token=token)
            try:
                offer_test, created = Offer_test.objects.get_or_create(offer=offer)
            except Offer_test.DoesNotExist:
                offer_test = Offer_test(offer=offer)
            print(request.data)
            data = request.data
            data["offer"] = offer.id
            serializer = Offer_testSerializer(offer_test, data=data)
            if serializer.is_valid():
                serializer.save()
                offer.is_active = True
                offer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except JobOffer.DoesNotExist:
            return Response(
                {"message": "Job offer does not exist"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            print(e)
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
            applicant_matches = match_applicant.objects.filter(application=application)
            if applicant_matches:
                applicant_matches = True
            else:
                applicant_matches = False
        except:
            pass
        return Response(
            {
                "applicant_page": applicant_page,
                "applicant_test": applicant_test,
                "applicant_matches": applicant_matches,
            }
        )


class CompanyInfo(APIView):
    def get(self, request):
        user = request.user
        try:
            company = company_user_link.objects.get(user=user).company
            if company.sector:
                company_page = True
            else:
                company_page = False
            if company.joboffer_set.all():
                all_company_offers = company.joboffer_set.all()
                active_company_offers = all_company_offers.filter(is_active=True)
                if active_company_offers:
                    company_offers = True
                else:
                    company_offers = False
                ##if a job offer is implied in a match
                for offer in active_company_offers:
                    if match_applicant.objects.filter(offer=offer):
                        company_match = True
                        break
                    else:
                        company_match = False

            else:
                company_offers = False
                company_match = False

            return Response(
                {
                    "company_page": company_page,
                    "company_offers": company_offers,
                    "company_matches": company_match,
                }
            )
        except Exception as e:
            print(e)
            return Response(
                {"message": "An error occured" + str(e)},
            )


class TempApplicantView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, token=None):
        if token:
            temp_applicant = TempApplicant.objects.get(token=token)
            temp_applicant_serializer = TempApplicantSerializer(temp_applicant)
        else:
            temp_applicants = TempApplicant.objects.all()
            temp_applicant_serializer = TempApplicantSerializer(
                temp_applicants, many=True
            )

        return Response(temp_applicant_serializer.data)

    def post(self, request):
        serializer = TempApplicantSerializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.save()
            for temp_applicant_data in serializer.data:
                email = temp_applicant_data.get("email")
                first_name = temp_applicant_data.get("first_name")
                link_inscription = temp_applicant_data.get("link_inscription")

                send_registration_email(first_name, email, link_inscription)
            return Response(
                {"message": "Temporary Applicant created successfully"},
                status=status.HTTP_201_CREATED,
            )
        else:
            print(serializer.errors)
            return Response(
                {"message": "An error occured"}, status=status.HTTP_400_BAD_REQUEST
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


class ApplicantView(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            if request.user.is_superuser:
                applicants = Applicant.objects.all()
                serializer = ApplicantSerializer(applicants, many=True)
            elif request.user.is_staff:
                formations_managed = FormationmanagementLink.objects.filter(
                    manager=request.user
                ).values_list("formation", flat=True)
                applicants = Applicant.objects.filter(formation__in=formations_managed)
                serializer = ApplicantSerializer(applicants, many=True)
            else:
                applicant = Applicant.objects.get(user=request.user)
                serializer = ApplicantSerializer(applicant)
            return Response(serializer.data)
        else:
            return Response(
                {"message": "User not authenticated"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

    def delete(self, request, pk):
        applicant = get_object_or_404(Applicant, pk=pk)
        applicant.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def put(self, request, pk):
        if request.user.is_authenticated:
            applicant = get_object_or_404(Applicant, pk=pk)
            serializer = ApplicantSerializer(applicant, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
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
        data = request.data.copy()
        print(data)
        data["user"] = request.user.id
        try:
            if data["resume"] == "" or data["resume"] is None:
                data.pop("resume")
        except KeyError:
            pass
        applicant = Applicant.objects.get(user=request.user)
        print(data["sector"])

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


class FormationView(APIView):
    def get(self, request):
        user = request.user
        if user.is_authenticated:
            if user.is_superuser:
                formations = Formation.objects.all()
                serializer = FormationSerializer(formations, many=True)
                return Response(serializer.data)
            elif user.is_staff:
                formations = FormationmanagementLink.objects.filter(
                    manager=user
                ).values_list("formation", flat=True)
                formations = Formation.objects.filter(id__in=formations)
                serializer = FormationSerializer(formations, many=True)
                return Response(serializer.data)
            else:
                formation = Formation.objects.all()
                serializer = FormationSerializer(formation, many=True)
                return Response(serializer.data)
        else:
            return Response(
                {"message": "User not authenticated"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

    def post(self, request):
        formation_serializer = FormationSerializer(data=request.data)
        if formation_serializer.is_valid():
            formation_serializer.save()
            return Response(
                {"message": "Formation successfully added"},
                status=status.HTTP_201_CREATED,
            )
        else:
            return Response(
                formation_serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )

    def delete(self, request, pk):
        formation = get_object_or_404(Formation, pk=pk)
        formation.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class FormationStatisticsView(APIView):
    def get(self, request):
        user = request.user
        if user.is_authenticated:
            if user.is_superuser:
                formations = Formation.objects.all()
            elif user.is_staff:
                formations = FormationmanagementLink.objects.filter(
                    manager=user
                ).values_list("formation", flat=True)
                formations = Formation.objects.filter(id__in=formations)

            stats = []
            for formation in formations:
                applicants = Applicant.objects.filter(formation=formation)
                print("Found ", len(applicants), " applicants for ", formation.name)

                # Create a dictionary to store the most advanced status for each applicant
                applicant_status = {}

                for applicant in applicants:
                    matches = match_applicant.objects.filter(
                        application__applicant=applicant
                    )
                    match_statuses = matches.values_list("status", flat=True)

                    if match_statuses:
                        most_advanced_status = max(match_statuses)
                        applicant_status[applicant.id] = most_advanced_status
                    else:
                        applicant_status[applicant.id] = -10

                # Count based on the most advanced status
                pending_count = len(
                    [status for status in applicant_status.values() if status == 0]
                )
                accepted_by_company_count = len(
                    [status for status in applicant_status.values() if status == 1]
                )
                fully_accepted_count = len(
                    [status for status in applicant_status.values() if status == 3]
                )
                finalized_enrollment_count = len(
                    [status for status in applicant_status.values() if status == 4]
                )

                # Count applicants with no matches
                no_matches_count = len(
                    [status for status in applicant_status.values() if status == -10]
                )

                stats.append(
                    {
                        "formation": formation.name,
                        "total_applicants": len(applicants),
                        "pending_matches": pending_count,
                        "accepted_by_company": accepted_by_company_count,
                        "fully_accepted": fully_accepted_count,
                        "finalized_enrollment": finalized_enrollment_count,
                        "no_matches": no_matches_count,  # Add this new stat
                    }
                )
            return Response(stats, status=status.HTTP_200_OK)
        else:
            return Response(
                {"message": "User not authenticated"},
                status=status.HTTP_401_UNAUTHORIZED,
            )


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


class LaunchMatchingView(APIView):
    def post(self, request):
        user = request.user
        if user.is_superuser:
            launch_matching()
            return Response(
                {"message": "Matchings launched successfully"},
                status=status.HTTP_200_OK,
            )
        return Response(
            {"message": "User not authorized"}, status=status.HTTP_401_UNAUTHORIZED
        )


class StaffView(APIView):
    def get(self, request):
        user = CustomUser.objects.filter(is_staff=True)
        serializer = UserSerializer(user, many=True)
        return Response(serializer.data)

    def delete(self, request, pk):
        user = get_object_or_404(CustomUser, pk=pk)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def post(self, request):
        data = request.data
        data["is_staff"] = True
        serializer = UserSerializer(data=data)

        if serializer.is_valid():
            user = serializer.save()

            # Generate password reset token
            token_generator = PasswordResetTokenGenerator()
            token = token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))

            # Send the UID and token to the React frontend
            link_inscription = (
                f"{settings.DOMAIN}/reset-password?uid={uid}&token={token}"
            )

            # Send registration email with the link (pointing to your React app)
            send_registration_email_staff(
                data["first_name"], data["email"], link_inscription
            )

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FormationLinkView(APIView):
    def get(self, request):
        formation_links = FormationmanagementLink.objects.all()
        serializer = FormationmanagementLinkSerializer(formation_links, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = FormationmanagementLinkSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        formation_link = get_object_or_404(FormationmanagementLink, pk=pk)
        formation_link.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class RecontactTempApplicantView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request, pk):
        temp_applicant = get_object_or_404(TempApplicant, pk=pk)
        send_registration_email(
            temp_applicant.first_name,
            temp_applicant.email,
            temp_applicant.link_inscription,
        )
        return Response(
            {"message": "Email sent to temp applicant"},
            status=status.HTTP_200_OK,
        )


from django.contrib.auth import get_user_model


class PasswordReset(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        uid = request.data.get("uid")
        token = request.data.get("token")
        new_password = request.data.get("new_password")

        try:
            uid = urlsafe_base64_decode(uid).decode()
            user = get_user_model().objects.get(pk=uid)

            # Verify the token
            token_generator = PasswordResetTokenGenerator()
            if token_generator.check_token(user, token):
                user.set_password(new_password)
                user.save()
                return Response(
                    {"message": "Password reset successful"}, status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST
                )

        except (TypeError, ValueError, OverflowError, get_user_model().DoesNotExist):
            return Response(
                {"error": "Invalid uid"}, status=status.HTTP_400_BAD_REQUEST
            )


class PasswordResetEmail(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        user = get_user_model().objects.filter(email=email).first()
        if user:
            token_generator = PasswordResetTokenGenerator()
            token = token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            link_reset = f"{settings.DOMAIN}/reset-password?uid={uid}&token={token}"
            send_reset_password_email(user.first_name, user.email, link_reset)
            return Response(
                {"message": "Email sent to user"}, status=status.HTTP_200_OK
            )
        return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)


class MatchesView(APIView):
    def get(self, request):
        user = request.user
        if user.is_authenticated:
            if user.is_superuser:
                matches = match_applicant.objects.all()
                serializer = MatchApplicantSerializer(matches, many=True)
                return Response(serializer.data)
            elif user.is_staff:
                formations_managed = FormationmanagementLink.objects.filter(
                    manager=user
                ).values_list("formation", flat=True)
                matches = match_applicant.objects.filter(
                    application__applicant__formation__in=formations_managed
                )
                serializer = MatchApplicantSerializer(matches, many=True)
                return Response(serializer.data)
            elif user.type == "C":
                company = company_user_link.objects.get(user=user).company
                matches = match_applicant.objects.filter(offer__company=company)
                serializer = MatchApplicantSerializer(matches, many=True)
                return Response(serializer.data)
            elif user.type == "A":
                matches = match_applicant.objects.filter(
                    application__applicant__user=user
                )
                serializer = MatchApplicantSerializer(matches, many=True)
                return Response(serializer.data)
            else:
                return Response(
                    {"message": "User not authorized"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
        else:
            return Response(
                {"message": "User not authenticated"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

    def post(self, request, pk):
        action = request.data.get("action")
        match = get_object_or_404(match_applicant, pk=pk)
        user = request.user
        if (
            user.is_staff
            or user.is_superuser
            or match.application.applicant.user == user
            or company_user_link.objects.get(user=user).company == match.offer.company
        ):
            # Check if the action is valid (int, between -2 and 4)
            try:
                action = int(action)
                print(action)
                if action in range(-2, 5):
                    match.status = action
                    match.save()
                    return Response(
                        {"message": "Match updated successfully"},
                        status=status.HTTP_200_OK,
                    )
                else:
                    return Response(
                        {"message": "Action not recognized"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            except:
                return Response(
                    {"message": "Action not recognized"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        else:
            return Response(
                {"message": "User not authorized"}, status=status.HTTP_401_UNAUTHORIZED
            )


class AIProcessAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user = request.user
        if user.is_authenticated:
            file = request.FILES.get("resume")
            if file:
                print(file)
                return Response({"message": "File received"}, status=status.HTTP_200_OK)
            print("No file provided")
            return Response(
                {"message": "No file provided"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {"message": "User not authenticated"}, status=status.HTTP_401_UNAUTHORIZED
        )


class FileDownloadView(View):
    def get(self, request, filename):
        # Define the path to your file
        file_path = os.path.join("resumes/", filename)
        print(file_path)

        if os.path.exists(file_path):
            # Use FileResponse for streaming file to the client
            return FileResponse(
                open(file_path, "rb"), as_attachment=True, filename=filename
            )
        else:
            return HttpResponse(status=404)
