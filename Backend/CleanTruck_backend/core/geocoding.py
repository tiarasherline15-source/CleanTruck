"""
Geocoding utility for converting addresses to coordinates using Nominatim
"""
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderServiceError


def geocode_address(address):
    """
    Convert address string to location dictionary with latitude and longitude.
    
    Args:
        address (str): The address to geocode
        
    Returns:
        dict: {"lat": latitude, "lng": longitude} or {} if geocoding fails
    """
    if not address or not address.strip():
        return {}
    
    try:
        geolocator = Nominatim(user_agent="cleantruck_app")
        location = geolocator.geocode(address, timeout=10)
        if location:
            return {"lat": location.latitude, "lng": location.longitude}
        return {}
    except (GeocoderTimedOut, GeocoderServiceError) as e:
        print(f"Geocoding error for address '{address}': {e}")
        return {}
    except Exception as e:
        print(f"Unexpected geocoding error: {e}")
        return {}


def reverse_geocode(location):
    """
    Convert location dictionary to human-readable address.
    
    Args:
        location (dict): Location dictionary with "lat" and "lng" keys
        
    Returns:
        str: Address string or None if reverse geocoding fails
    """
    if not location or "lat" not in location or "lng" not in location:
        return None
    
    try:
        geolocator = Nominatim(user_agent="cleantruck_app")
        result = geolocator.reverse(f"{location['lat']}, {location['lng']}", timeout=10)
        return result.address if result else None
    except (GeocoderTimedOut, GeocoderServiceError) as e:
        print(f"Reverse geocoding error for location {location}: {e}")
        return None
    except Exception as e:
        print(f"Unexpected reverse geocoding error: {e}")
        return None
