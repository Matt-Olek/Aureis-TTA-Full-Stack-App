from django.urls import path
from .views import (
    StaffView,
    MatchesView,
    ApplicantSearchView,
    SectorView,
    ApplicantView,
    TempApplicantView,
    RecontactTempApplicantView,
    FullApplicantCreateView,
    CompanyListCreateAPIView,
    MatchApplicantListCreateView,
    FormationView,
    FormationLinkView,
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
    LaunchMatchingView,
    PasswordReset,
    PasswordResetEmail,
    FormationStatisticsView,
    CompanyTestMetadataView,
    CompanyTestDetailView,
    CompanyView,
    CompanyInfo,
    AIProcessAPIView,
    FileDownloadView,
)

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    ### User & Tokens
    path("user/", UserDetailView.as_view(), name="user_detail"),
    path("staff/", StaffView.as_view(), name="staff"),
    path("staff/<int:pk>/", StaffView.as_view(), name="staff"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path(
        "password-reset/",
        PasswordReset.as_view(),
        name="password_reset",
    ),
    path(
        "password-reset-email/",
        PasswordResetEmail.as_view(),
        name="password_reset_email",
    ),
    ### Model Views
    #
    # Applicants
    path("applicant/", ApplicantView.as_view(), name="applicant-list-create"),
    path("applicant/<int:pk>/", ApplicantView.as_view(), name="applicant-detail"),
    # Temp Applicants
    path("temp-applicants/", TempApplicantView.as_view(), name="temp-applicant"),
    path(
        "temp-applicants/<int:pk>/recontact/",
        RecontactTempApplicantView.as_view(),
        name="recontact-temp-applicant",
    ),
    path("matches/", MatchesView.as_view(), name="match-applicant-list"),
    path("matches/<int:pk>/", MatchesView.as_view(), name="match-applicant-detail"),
    path(
        "temp-applicants/<token>/", TempApplicantView.as_view(), name="temp-applicant"
    ),
    path("temp-companies/<token>/", TempCompanyView.as_view(), name="temp-company"),
    #
    path("formations/", FormationView.as_view(), name="formation-list-create"),
    path("formations/<int:pk>/", FormationView.as_view(), name="formation-delete"),
    path("formationlink/", FormationLinkView.as_view(), name="formation-link"),
    path("formationlink/<int:pk>/", FormationLinkView.as_view(), name="formation-link"),
    path(
        "formation-statistics/",
        FormationStatisticsView.as_view(),
        name="formation-statistics",
    ),
    #
    #
    #
    #
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
        "educational-level-choices/",
        EducationalLevelChoicesView.as_view(),
        name="educational-level-choices",
    ),
    path(
        "user/register/",
        RegisterUserView.as_view(),
        name="register-temp-applicant",
    ),
    path("choices/", ChoicesView.as_view(), name="choices"),
    path("user/info/", CustomUserView.as_view(), name="user-info"),
    path("applicant/info/", ApplicantInfo.as_view(), name="applicant-info"),
    path("company/info/", CompanyInfo.as_view(), name="company-info"),
    path(
        "applicant_test/metadata/",
        ApplicationTestMetadataView.as_view(),
        name="application_test_metadata",
    ),
    path(
        "applicant_test/",
        ApplicationTestDetailView.as_view(),
        name="application_test_detail",
    ),
    path(
        "company_test/metadata/",
        CompanyTestMetadataView.as_view(),
        name="company_test_metadata",
    ),
    path(
        "company_test/<token>/",
        CompanyTestDetailView.as_view(),
        name="company_test_detail",
    ),
    path("company/", CompanyView.as_view(), name="company-list-create"),
    path("company/<int:pk>/", CompanyView.as_view(), name="company-detail"),
    path("offers/", JobOfferListCreateView.as_view(), name="offer-list-create"),
    path("offers/<int:pk>/", JobOfferListCreateView.as_view(), name="offer-detail"),
    path("launch_matching/", LaunchMatchingView.as_view(), name="launch_matching"),
    path("auto-fill/", AIProcessAPIView.as_view(), name="auto-fill"),
    path("download/<str:filename>/", FileDownloadView.as_view(), name="file-download"),
]
