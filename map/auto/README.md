# Search Autocomplete

Search utilizes Google Places API autocomplete functionality, returning Google's Place "predictions" as the user is typing in a search term. Once the user makes a selection, the details of the selection (geo coordinates, address, phone, website, etc..) are returned from the API.

## Usage

1. Aquire a [Google API Key](https://developers.google.com/maps/documentation/javascript/get-api-key)
- update `./config.json -> googleAPIKey to aquired key value`
2. Restrict the API key to only allow specific origin access (website domain)
- [Google Cloud Console](https://console.cloud.google.com/) > your project > APIs & Services > Credentials > your API Key > Application restrictions > HTTP referers
- you can use a wildcard before the domain `(*.example.com)` to allow all subdomains, likewise a wildcard after the domain `(.example.com/*)` to allow all paths
3. Enable `Google Places API` as well as `Google Maps JavaScript API` for autocomplete to work
- [Google Cloud Console](https://console.cloud.google.com/) > your project > APIs & Services > Libraries > above library - Enable