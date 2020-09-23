## Google Autocomplete

Search utilizes Google Places API autocomplete functionality, returning Google's Place "predictions" as the user is typing in a search term. Once the user makes a selection, the details of the selection (geo coordinates, address, phone, website, etc..) are returned from the API.

## Setup

1. You'll need to [enable billing](https://console.cloud.google.com/projectselector2/billing/enable). You can use the $300 free credits.
1. Aquire a [Google API Key](https://developers.google.com/maps/documentation/javascript/get-api-key) - Create a project and then Create Credentials > API Key.  
2. Update `./config.json -> googleAPIKey to aquired key value`
3. Restrict the API key to only allow specific origin access (website domain)

	[Google Cloud Console](https://console.cloud.google.com/) > your project > APIs & Services > Credentials > your API Key > Application restrictions > HTTP referers  

	You can use a wildcard before the domain `(*.example.com)` to allow all subdomains, likewise a wildcard after the domain `(.example.com/*)` to allow all paths

4. Enable `Google Places API` as well as `Google Maps JavaScript API` for autocomplete to work  

	[Google Cloud Console](https://console.cloud.google.com/) > your project > APIs & Services > Libraries > above library - Enable  

---

Or you can use the [Google Geocode API Directly](https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY) (link needs API key) 
to make up to 40,000 calls per month at no charge to the 
[Google Maps API](https://developers.google.com/maps/documentation/geocoding/start).  

 

