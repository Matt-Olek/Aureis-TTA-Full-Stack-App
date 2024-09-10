from django.urls import path
from .views import (
    ApplicantSearchView,
    SectorView,
    ApplicantListCreateAPIView,
    FullApplicantCreateView,
    CompanyListCreateAPIView,
    MatchApplicantListCreateView,
    FormationListCreateView,
    FormationDeleteView,
    EducationalLevelChoicesView,
    TempApplicantView,
    TempCompanyView,
    RegisterUserView,
    ChoicesView,
    CustomUserView,
    UserDetailView,
    ApplicantInfo,
    ApplicationTestDetailView,
    ApplicationTestMetadataView,
    JobOfferListCreateView,
)

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path("user/", UserDetailView.as_view(), name="user_detail"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path(
        "applicants/",
        ApplicantListCreateAPIView.as_view(),
        name="applicant-list-create",
    ),
    path(
        "applicants/registration/",
        FullApplicantCreateView.as_view(),
        name="full-applicant",
    ),
    path("companies/", CompanyListCreateAPIView.as_view(), name="company-list-create"),
    path(
        "match_applicants/",
        MatchApplicantListCreateView.as_view(),
        name="match_applicant_list_create",
    ),
    path("sector/", SectorView.as_view(), name="sector-list-create"),
    path(
        "search/applicant/", ApplicantSearchView.as_view(), name="applicant-list-create"
    ),
    path(
        "formations/", FormationListCreateView.as_view(), name="formation-list-create"
    ),
    path(
        "formations/<int:pk>/", FormationDeleteView.as_view(), name="formation-delete"
    ),
    path(
        "educational-level-choices/",
        EducationalLevelChoicesView.as_view(),
        name="educational-level-choices",
    ),
    path(
        "temp-applicants/<token>/", TempApplicantView.as_view(), name="temp-applicant"
    ),
    path("temp-companies/<token>/", TempCompanyView.as_view(), name="temp-company"),
    path(
        "user/register/",
        RegisterUserView.as_view(),
        name="register-temp-applicant",
    ),
    path("choices/", ChoicesView.as_view(), name="choices"),
    path("user/info/", CustomUserView.as_view(), name="user-info"),
    path("applicant/info/", ApplicantInfo.as_view(), name="applicant-info"),
    path(
        "applicant_test/metadata/",
        ApplicationTestMetadataView.as_view(),
        name="application_test_metadata",
    ),
    path(
        "applicant_test/<int:pk>/",
        ApplicationTestDetailView.as_view(),
        name="application_test_detail",
    ),
    path("offers/", JobOfferListCreateView.as_view(), name="offer-list-create"),
    path("offers/<int:pk>/", JobOfferListCreateView.as_view(), name="offer-detail"),
]
