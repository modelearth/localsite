# Neighborhood Maps For Us

View our [sample map](sample.html) and [Google Sheet](https://docs.google.com/spreadsheets/d/1JDD36dOvy5TWsmfg0g4r8x9MMyuidRgpJAdDFD9HiTQ/edit#gid=1284085090)

View our [Open Data Google Sheet](http://bit.ly/code-for-atl-open-data-workingdoc)

We're planning to update [Maps For Us](https://mapsfor.us/) to auto-geocode new addresses as they are added to the Google Sheet. Currently you have to highlight the address column and its 2 adjacent lat/lon columns to geocode using the manual steps below.  

[Mapbox Map Sample](map.html) - [from this Google Sheet](https://docs.google.com/spreadsheets/d/1odIH33Y71QGplQhjJpkYhZCfN5gYCA6zXALTctSavwE/edit?usp=sharing)  

####Column Names
Status  
Name  
Email  
Comments  
Description  
Category1  
Category2  
Category3  
Location  
Address  
Latitude  
Longitude   
Geo  
City  
State  
Zip  
Country  
Phone  
Webpage  
News  
Donate  
Volunteer  
API  


####Similar to MapBox column names 
Underscores require a backslash in markdown and are not visible in links.  
So we use CamelCase, or a dash to represent a space.  

Name  
Description  
Address  
Latitude  
Longitude  
Address_1  
City  
State_Province  
Zip\_Code  
Country_ISO3166\_Alpha2  
Phone  
News  
Donate  
Volunteer


  

Here are [5 csv files with recycling datasets](https://github.com/localsite/localsite/tree/master/map/recycling/ga) that we will display as layers in a Leaflet map.  

Here's a [json file for map layers](/localsite/info/data/ga-layers.json).  

In addition to CSV and Google Sheets, let's also pull layers from AirTable.

<!--
[Copy of the MapsforUS Google Sheet Template](https://docs.google.com/spreadsheets/d/e/2PACX-1vTnKsfPX1qpGjWlXLZEu-u_buC3Di-MRnUGxh7KrbR4Jo_6tSMZipnDbLNdD9S-UHReRO6Z0YbYxG1G/pubhtml). 
Editable link is in our Slack #epa group.
-->


---

### Manually Geocode Google Sheet

Select the content of three adjacent columns: Address, Latitude and Longitude.  

Choose "Tools > Script Editor" and click next to the function "addressToPosition" and click the run button.  

If you don't yet have the addressToPosition function, copy it from below (or from the MapsforUS template above).  

You should be able to geocode at least 400 rows each time. If you reach the max for one request, 
select the remaining batch in sets of 400 to 500 and run again until you hit your max for the day, which might be 2,000.  

```
function addressToPosition() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var cells = sheet.getActiveRange();
  
  // Must have selected 3 columns (Address, Lat, Lng).
  // Must have selected at least 1 row.

  if (cells.getNumColumns() != 3) {
    Logger.log("Must select at least 3 columns: Address, Lat, Lng columns.");
    return;
  }
  
  var addressColumn = 1;
  var addressRow;
  
  var latColumn = addressColumn + 1;
  var lngColumn = addressColumn + 2;
  
  var geocoder = Maps.newGeocoder().setRegion("us");
  var location;
  
  for (addressRow = 1; addressRow <= cells.getNumRows(); ++addressRow) {
    var address = cells.getCell(addressRow, addressColumn).getValue();
    
    // Geocode the address and plug the lat, lng pair into the 
    // 2nd and 3rd elements of the current range row.
    location = geocoder.geocode(address);
   
    // Only change cells if geocoder seems to have gotten a 
    // valid response.
    if (location.status == 'OK') {
      lat = location["results"][0]["geometry"]["location"]["lat"];
      lng = location["results"][0]["geometry"]["location"]["lng"];
      
      cells.getCell(addressRow, latColumn).setValue(lat);
      cells.getCell(addressRow, lngColumn).setValue(lng);
    }
  }
};

function positionToAddress() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var cells = sheet.getActiveRange();
  
  // Must have selected 3 columns (Address, Lat, Lng).
  // Must have selected at least 1 row.

  if (cells.getNumColumns() != 3) {
    Logger.log("Must select at least 3 columns: Address, Lat, Lng columns.");
    return;
  }

  var addressColumn = 1;
  var addressRow;
  
  var latColumn = addressColumn + 1;
  var lngColumn = addressColumn + 2;
  
  var geocoder = Maps.newGeocoder().setRegion(getGeocodingRegion());
  var location;
  
  for (addressRow = 1; addressRow <= cells.getNumRows(); ++addressRow) {
    var lat = cells.getCell(addressRow, latColumn).getValue();
    var lng = cells.getCell(addressRow, lngColumn).getValue();
    
    // Geocode the lat, lng pair to an address.
    location = geocoder.reverseGeocode(lat, lng);
   
    // Only change cells if geocoder seems to have gotten a 
    // valid response.
    Logger.log(location.status);
    if (location.status == 'OK') {
      var address = location["results"][0]["formatted_address"];

      cells.getCell(addressRow, addressColumn).setValue(address);
    }
  }  
};

function generateMenu() {
  // var setGeocodingRegionMenuItem = 'Set Geocoding Region (Currently: ' + getGeocodingRegion() + ')';
  
  // {
  //   name: setGeocodingRegionMenuItem,
  //   functionName: "promptForGeocodingRegion"
  // },
  
  var entries = [{
    name: "Geocode Selected Cells (Address to   Lat, Long)",
    functionName: "addressToPosition"
  },
  {
    name: "Geocode Selected Cells (Address from Lat, Long)",
    functionName: "positionToAddress"
  }];
  
  return entries;
}

function updateMenu() {
  SpreadsheetApp.getActiveSpreadsheet().updateMenu('Geocode', generateMenu())
}
```

<br>

---

### Automatically geocode addresses - Contributed by Mark Noonan, Code for Atlanta

It works by having a separate sheet for form submissions and doing the work there then copying the line into the main Points sheet. There's a separate Errors sheet where rows are added if there was a problem with the geocoding process for manual cleanup.  

MapsForUs feeds the calendar at [folkmusic.com](https://www.folkmusic.com/shows.html). Site admins add folk music shows with a Google Form and manually update the spreadsheet if things need to be changed after that.

```
function geocodeAndMove() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("Form Responses 2");
  var pointsWorksheet = spreadsheet.getSheetByName("Points");
  var errorsSheet = spreadsheet.getSheetByName("Errors");
  function addressToPositionFromForm() {
  var cells = sheet.getRange("H2:J2");
  var addressColumn = 1;
  var addressRow;
  var latColumn = addressColumn + 1;
  var lngColumn = addressColumn + 2;
  var geocoder = Maps.newGeocoder().setRegion(getGeocodingRegion());
  var location;
  for (addressRow = 1; addressRow <= cells.getNumRows(); ++addressRow) {
    Logger.log(addressRow);
    var address = cells.getCell(addressRow, addressColumn).getValue();
    // Geocode the address and plug the lat, lng pair into the 
    // 2nd and 3rd elements of the current range row.
    location = geocoder.geocode(address);
    // Only change cells if geocoder seems to have gotten a 
    // valid response.
    if (location.status == 'OK'&& location["results"][0]["geometry"]["location"]["lat"] !== "") {
      lat = location["results"][0]["geometry"]["location"]["lat"];
      lng = location["results"][0]["geometry"]["location"]["lng"];
      cells.getCell(addressRow, latColumn).setValue(lat);
      cells.getCell(addressRow, lngColumn).setValue(lng);
    }
    else {
      sheet.getRange('K2').setValue('No coordinates found for address');
      var contentToCopy = sheet.getRange("A2:K2").getValues();
      errorsSheet.appendRow(contentToCopy[0]);
      sheet.deleteRow(2);     
      throw new Error("address error");
    }
  }
}
  function moveRowToPointsSheet(){
  var contentToCopy = sheet.getRange("B2:J2").getValues();
  pointsWorksheet.appendRow(contentToCopy[0]);
  sheet.deleteRow(2);
  pointsWorksheet.sort(1);
  } 
 addressToPositionFromForm();
 moveRowToPointsSheet();
}
```

### Avoid re-geocoding

```
// Choose ForMap as the active tab before running
// Also includes address formatting. Updated to omit existing lat/lon values
// https://www.guguweb.com/2020/01/24/geocode-addresses-with-google-sheets-and-google-geocoding-api/

function myFunction() {
  var sheet = SpreadsheetApp.getActiveSheet();
   
  var range = sheet.getDataRange();
  var cells = range.getValues();
   
  var latitudes = [];
  var longitudes = [];
   
  for (var i = 0; i < cells.length; i++) {
  
    // UPDATE IF NEW COLUMNS WERE ADDED TO YOUR SHEET
    
    if (i <= 678 && !cells[i][13]) { // Only populate blank cells
      var address = cells[i][2] + ', ' + cells[i][3] + ', ' + cells[i][4] + ' ' + cells[i][5];
      var geocoder = Maps.newGeocoder().geocode(address); // Exception: Invalid argument: location (line 20, file "Code")
      var res = geocoder.results[0];
   
      var lat = lng = 0;
      if (res) {
        lat = res.geometry.location.lat;
        lng = res.geometry.location.lng;
      }
    } else { // UPDATE ALSO - These copy the existing cell content into the array
      var lat = cells[i][12];
      var lng = cells[i][13];
    }
    latitudes.push([lat]);
    longitudes.push([lng]);
  }
  
  // UPDATE THESE IF NEW COLUMNS WERE ADDED TO YOUR SHEET

  sheet.getRange('M1')
  .offset(0, 0, latitudes.length)
  .setValues(latitudes);

  sheet.getRange('N1')
  .offset(0, 0, longitudes.length)
  .setValues(longitudes);
}
```

<!--
// For longer sheet
// Also includes address formatting. Updated to omit existing lat/lon values
// https://www.guguweb.com/2020/01/24/geocode-addresses-with-google-sheets-and-google-geocoding-api/

function myFunction() {
  var sheet = SpreadsheetApp.getActiveSheet();
   
  var range = sheet.getDataRange();
  var cells = range.getValues();
   
  var latitudes = [];
  var longitudes = [];
   
  for (var i = 0; i < cells.length; i++) {
  
    // UPDATE IF NEW COLUMNS WERE ADDED TO YOUR SHEET
    
    if (!cells[i][34]) { // Only populated blank cells
      var address = cells[i][2] + ' ' + cells[i][4] + ' ' + cells[i][5] + ' ' + cells[i][6];
      var geocoder = Maps.newGeocoder().geocode(address);
      var res = geocoder.results[0];
   
      var lat = lng = 0;
      if (res) {
        lat = res.geometry.location.lat;
        lng = res.geometry.location.lng;
      }
    } else { // Copy the existing cell content into the array
      var lat = cells[i][33];
      var lng = cells[i][34];
    }
    latitudes.push([lat]);
    longitudes.push([lng]);
  }
  
  // UPDATE THESE IF NEW COLUMNS WERE ADDED TO YOUR SHEET

  sheet.getRange('AH1')
  .offset(0, 0, latitudes.length)
  .setValues(latitudes);

  sheet.getRange('AI1')
  .offset(0, 0, longitudes.length)
  .setValues(longitudes);
}
-->
