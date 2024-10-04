from matching.models import (
    Application,
    Applicant,
    JobOffer,
    match_applicant,
    Application_test,
    Offer_test,
)
from geopy.distance import geodesic
from geopy.geocoders import Nominatim


def match_applicant_to_job_offer(applicant, job_offer):
    """
    Match an applicant to a job offer
    :param applicant: Applicant object
    :param job_offer: JobOffer object
    """
    (
        match,
        industry_compatibility,
        test_compatibility,
        geographic_compatibility,
        resume_compatibility,
    ) = compute_matching_score(applicant, job_offer)
    if not match:
        print(f"Skipping {applicant} to {job_offer}")
        return False
    else:
        print(f"Matching {applicant} to {job_offer}")
        total_score = (
            industry_compatibility
            + test_compatibility
            + geographic_compatibility
            + resume_compatibility
        ) / 4

        total_score = int(round(total_score * 100))
        test_score = int(round(test_compatibility * 100))
        industry_score = int(round(industry_compatibility * 100))
        geographic_score = int(round(geographic_compatibility * 100))
        resume_score = int(round(resume_compatibility * 100))

        new_match = match_applicant.objects.create(
            offer=job_offer,
            application=applicant.application,  # Assuming applicant has a related application object
            score=total_score,
            test_score=test_score,
            industry_score=industry_score,
            geographic_score=geographic_score,
            resume_score=resume_score,
            status=0,  # Pending status
        )
        # Save the new match
        new_match.save()
        return True


def compute_matching_score(applicant, job_offer):
    """
    Compute a matching score between an applicant and a job offer
    :param applicant: Applicant object
    :param job_offer: JobOffer object
    :return: Matching score (float)
    """

    # Industry compatibility
    industry_compatibility = calculate_industry_compatibility(applicant, job_offer)
    if industry_compatibility == 0:
        print(f"Industry mismatch between {applicant} and {job_offer}")
        return (False, 0.0, 0.0, 0.0, 0.0)

    contract_type_compatibility = calculate_contract_type_compatibility(
        applicant, job_offer
    )
    if contract_type_compatibility == 0:
        print(f"Contract type mismatch between {applicant} and {job_offer}")
        return (False, 0.0, 0.0, 0.0, 0.0)

    # Test compatibility
    try:
        test_compatibility = calculate_test_compatibility(
            applicant.application.application_test, job_offer.offer_test
        )
    except Exception as e:
        print("Error calculating test compatibility: ", e)
        test_compatibility = 0.5
    if test_compatibility == 0:
        print(f"Test mismatch between {applicant} and {job_offer}")
        return (False, 0.0, 0.0, 0.0, 0.0)

    # Geographic compatibility
    geographic_compatibility = calculate_geographic_compatibility(applicant, job_offer)
    if geographic_compatibility == 0:
        print(f"Geographic mismatch between {applicant} and {job_offer}")
        return (False, 0.0, 0.0, 0.0, 0.0)

    # Calculate the compatibility based on the resume embedding
    resume_compatibility = calculate_resume_compatibility(applicant, job_offer)
    # Calculate the final score
    return (
        True,
        industry_compatibility,
        test_compatibility,
        geographic_compatibility,
        resume_compatibility,
    )


# ---------------------- Geographic Compatibility ---------------------- #


def get_coordinates(city_name):
    try:
        geolocator = Nominatim(user_agent="distance_calculator")
        location = geolocator.geocode(city_name)
        if location is None:
            return (None, None)
        return (location.latitude, location.longitude)
    except Exception as e:
        print("Error getting coordinates: ", e)
        return (None, None)


def calculate_distance(city1, city2):
    coords1 = get_coordinates(city1)
    coords2 = get_coordinates(city2)
    if None in coords1 or None in coords2:
        return None
    try:
        distance = geodesic(coords1, coords2).kilometers
        return distance
    except Exception as e:
        print("Error calculating distance: ", e)
        return None


def calculate_geographic_compatibility(applicant, job_offer):
    """
    Calculate the compatibility between an applicant and a job offer based on location
    :param applicant: Applicant object
    :param job_offer: JobOffer object
    :return: Compatibility score (float)
    """
    applicant_location = applicant.location
    kilometers_away = applicant.kilometers_away
    job_offer_location = job_offer.location

    if kilometers_away <= -1:
        return 1.0
    else:
        distance = calculate_distance(applicant_location, job_offer_location)
        if distance is None:
            return 0.0
        if distance <= kilometers_away:
            return (kilometers_away - distance) / kilometers_away
        else:
            return 0.0


# ------------------------ Test Compatibility ------------------------ #


def calculate_test_compatibility(Applicant_test, Offer_test):
    """
    Calculate the compatibility between an applicant and a job offer based on test results
    :param Applicant_test: Application_test object
    :param Offer_test: Offer_test object
    :return: Compatibility score (float)
    """
    total_fields = 0
    matching_fields = 0

    excluded_fields = ["id", "application", "offer"]
    fields = [
        field.name
        for field in Applicant_test._meta.get_fields()
        if field.name not in excluded_fields
    ]
    # Compare the test results
    for field in fields:
        applicant_value = getattr(Applicant_test, field)
        offer_value = getattr(Offer_test, field)
        if applicant_value == offer_value:
            matching_fields += 1
        total_fields += 1

    if total_fields == 0:
        return 0.0
    else:
        return matching_fields / total_fields


def calculate_industry_compatibility(applicant, job_offer):
    """
    Calculate the compatibility between an applicant and a job offer based on sectors
    :param applicant: Applicant object
    :param job_offer: JobOffer object
    :return: Compatibility score (float)
    """
    # Get the sectors of the applicant and the job offer
    applicant_sectors = set(applicant.sector.all())
    job_offer_sectors = set(job_offer.company.sector.all())

    # Check if there's any intersection between the applicant's sectors and the job offer's sectors
    if applicant_sectors.intersection(job_offer_sectors):
        return 1.0  # There's compatibility if there's an intersection
    else:
        return 0.0  # No compatibility if there's no intersection


def calculate_contract_type_compatibility(applicant, job_offer):
    """
    Calculate the compatibility between an applicant and a job offer based on skills
    :param applicant: Applicant object
    :param job_offer: JobOffer object
    :return: Compatibility score (float)
    """
    applicant_contract_type = applicant.contract_type
    job_offer_contract_type = job_offer.contract_type

    # Compare the contract types
    if applicant_contract_type == job_offer_contract_type:
        return 1.0
    else:
        return 0.0


def calculate_resume_compatibility(applicant, job_offer):
    """
    Calculate the compatibility between an applicant and a job offer based on skills
    :param applicant: Applicant object
    :param job_offer: JobOffer object
    :return: Compatibility score (float)
    """
    applicant_skills = applicant.skills.all()
    job_offer_skills = job_offer.skills.all()
    common_skills = applicant_skills.intersection(job_offer_skills)
    if len(job_offer_skills) == 0:
        return 0.0
    else:
        score = len(common_skills) / len(job_offer_skills)
    return score


def launch_matching():
    """
    Match all applicants to all job offers
    """
    applicants = Applicant.objects.all()
    # Filters the applicants to only those who have an application and a test
    applicants = [
        applicant
        for applicant in applicants
        if hasattr(applicant, "application")
        # and hasattr(applicant.application, "application_test")
    ]

    job_offers = JobOffer.objects.all()
    # Filters the job offers to only those who have a test
    # job_offers = [
    #     job_offer for job_offer in job_offers if hasattr(job_offer, "offer_test")
    # ]

    total_matched = 0
    print("#" * 50)
    print(f"Matching {len(applicants)} applicants to {len(job_offers)} job offers")
    print("-" * 50)
    for applicant in applicants:
        for job_offer in job_offers:
            existing_match = match_applicant.objects.filter(
                offer=job_offer, application=applicant.application
            ).exists()
            if not existing_match:
                is_matched = match_applicant_to_job_offer(applicant, job_offer)
                if is_matched:
                    total_matched += 1
    print(f"Total matches created: {total_matched}")
    print("#" * 50)
    return total_matched
