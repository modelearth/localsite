## Data Preparation 

The census does not publish payroll values for counties with only 1 or 2 establishments (and sometimes up to 27 establishments, ). Instead, they provide these values as aggregates within a state total for each industry.  

To allow for gaps in annual community census data, we calculate an industry estimates for every year first, and then averaging across years. This allows a sum of each industry’s average to match the state total for the 5 years spanned.  

To approximate payrolls and employee levels based on the number of establishments, we provide two options under the settings icon:  

1. Average of unpublished payrolls  
2. Average of total state payroll  

Option 1 dispersals should accurately add up to the state total, while pulling their average from other counties with a similar low concentration of an industry.  

Example: With option 1 “Temporary Help Services” is five times higher (at $17.76 mil) for McDuffie County because counties with only a couple firms tend to have large payrolls as the sole provider of a local service.  

With option 2, the level is low ($4.92 mil) because overall counties with more than a couple services have smaller payrolls per establishment.  

This trend flips for industries that have larger revenue in areas where firms are concentrated, hence “Transportation Equipment Manufacturing” is estimated higher for McDuffie County when using the state average because payrolls are higher for firms in other counties where transportation equipment production is concentrated.  
Based on the above, we’ll use option 1 by default.  


### For NAICS industry charts

The Jupyter Notebook for industry data preparation resides in [data_collection.ipynb](data_collection.ipynb).  

Run the notebook cells either in juyter notebook or by running from the command line:

	jupyter nbconvert --to notebook --inplace --execute data_collection.ipynb

After aggregating the data, you can delete the county\_level and state\_level folders inside data/data_raw/BEA\_Industry\_Factors.  

The last block of this notebook contains the code for generating the state-wide data. When only 1 or 2 of an industry reside in a county, numbers are omitted by the US Census to protect privacy. As a result, the state-wide totals from the Census API are larger than the sum of each state’s county totals.  
[Additional info](https://github.com/modelearth/community/issues/9)  
### API calls
As included in the [data_collection.ipynb](data_collection.ipynb) notebook, the base url for API calls is:

	https://api.census.gov/data

A full URL follows the following format:

	{base_url}/{year}/cbp?get={columns_to_select}&for=county:*&in=state:{fips:02d}

For example, to get the 2016 data for all counties in the state of Georgia, you can use the following URL:

	https://api.census.gov/data/2016/cbp?get=GEO_ID,GEO_TTL,COUNTY,YEAR,NAICS2012,NAICS2012_TTL,ESTAB,EMP,PAYANN&for=county:*&in=state:13

You can find a list of columns to select on [this link](https://api.census.gov/data/2016/cbp/variables.html).
### Note for the data used in the Bubblemap
If rounding off 8 decimals, ozone depletion, pesticides and a few others would need to be switched to scientific notation in the data file. This would allow the files to be reduced
US from 151kb to under 72.7kb
GA from 120kb, to under 59.2kb
