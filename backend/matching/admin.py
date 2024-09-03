from django.contrib import admin
from matching.models import (
    Applicant,
    Application,
    Application_test,
    CodeAPE,
    Company,
    JobOffer,
    Offer_test,
    OfferToken,
    Sector,
    Skill,
    TempApplicant,
    TempCompany,
    company_user_link,
    match_applicant,
    Formation,
)

# Register your models here.
admin.site.register(Applicant)
admin.site.register(Application)
admin.site.register(Application_test)
admin.site.register(CodeAPE)
admin.site.register(Company)
admin.site.register(JobOffer)
admin.site.register(Offer_test)
admin.site.register(OfferToken)
admin.site.register(Sector)
admin.site.register(Skill)
admin.site.register(TempApplicant)
admin.site.register(TempCompany)
admin.site.register(company_user_link)
admin.site.register(match_applicant)
admin.site.register(Formation)
