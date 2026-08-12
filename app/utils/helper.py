
from app.core.config import TOP_COUNTRIES
def group_country(country):
    if country in TOP_COUNTRIES:
        return country
    return 'Other'