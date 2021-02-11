# Neighborhood Maps For Us

View [Georgia Vaccine Locations](../#show=vac) and [Availability Updates](vaccines/) and add comments with your findings to the [VaccineGA.com Google Sheet](https://docs.google.com/spreadsheets/d/1_wvZXUWFnpbgSAZGuIb1j2ni8p9Gqj3Qsvd8gV95i90/edit?usp=sharing)

<b>Vaccine Availability - Google Script Volunteer Needed</b>

We need help writing scripts in Google Sheets to merge updates from a tab containing raw data from the Georgia Department of Health with our main vaccine availability tab where volunteers post comments to report on their contacts with pharmacies and hospitals.  Join the **#neighborhood** and **#vaccinate-ga** Slack channels at <a href="https://codeforatlanta.slack.com">codeforatlanta.slack.com</a> to volunteer your Google Sheet programming skills.  

<!--
[Recycling MapsForUs test Google Sheet](https://docs.google.com/spreadsheets/d/1JDD36dOvy5TWsmfg0g4r8x9MMyuidRgpJAdDFD9HiTQ/edit#gid=1284085090)
-->

## Georgia Operation Open Data

View our [Georgia Open Data Google Sheet](http://bit.ly/code-for-atl-open-data-workingdoc)


## Column Names

Used in open data lists and maps - CSV files and Google Sheets

Status - Null: needs review | 0: hide | 1: show | 2: show, but needs updates     
Name - Location name or web service name  
Comments  
ContactDate  
ContactedBy - Name and (email) of person making contact   
Description  
Category1  
Category2  
Category3  
Location  
Address  
Latitude  
Longitude   
Geo - 2-character country code followed by FIPS state or county number   
City  
State  
Zip  
Phone  
Webpage  
News - A URL   
API  
Email - Public  
EditorEmail - List of emails of users authorized to update the row  

Comma-separate mutltiple values in ContactedBy, Geo, Email and Phone fields.  
Place the most recent ContactedBy first.  
<br>


####Improvements to MapBox column names 
The use of underscores by MapBox leads to backslash in markdown, and underscores are not easily visible in underlined links.  
So we use CamelCase, or a dash to represent a space instead of the following.  

Name  
Description  
Address  
Latitude  
Longitude  
Address\_1  
City  
State_Province  
Zip\_Code  
Country\_ISO3166\_Alpha2  
Phone  
News  


[Mapbox Map Sample](map.html) - [from this Google Sheet](https://docs.google.com/spreadsheets/d/1odIH33Y71QGplQhjJpkYhZCfN5gYCA6zXALTctSavwE/edit?usp=sharing) 
  

Here are [5 csv files with recycling datasets](https://github.com/localsite/localsite/tree/master/map/recycling/ga) that we will display as layers in a Leaflet map.  

Here's a [json file for map layers](/localsite/info/data/ga-layers.json).  

In addition to CSV and Google Sheets, we'd like to also pull layers from AirTable. 
<a href="https://meetup.com/codeforatlanta/">Pitch in your coding skills</a> to support more map layers.  

<!--
[Copy of the MapsforUS Google Sheet Template](https://docs.google.com/spreadsheets/d/e/2PACX-1vTnKsfPX1qpGjWlXLZEu-u_buC3Di-MRnUGxh7KrbR4Jo_6tSMZipnDbLNdD9S-UHReRO6Z0YbYxG1G/pubhtml). 
Editable link is in our Slack #epa group.
-->



## Geocoding Script

[Notes on manual and automated geocoding in Google Sheets](geocoding/)
