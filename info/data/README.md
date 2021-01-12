

Note: The BLS QCEW FlowByActivity datasets that are hosted on Data Commons are updated to include county level data, so you can use the sample code below to retrieve the datasets.  


From the terminal

	pip install git+https://github.com/USEPA/flowsa

	 

In a python IDE

	import flowsa

	 

If you want to get the raw data in our flow by activity format. You can subset the data by ‘Employment’ (for number of employees),  ‘Money’ for annual wages and ‘Other’ for number of establishments, or you can set flowclass to any combination of those three. 

	 

	employ_bls_flowsbyactivity_2015 = flowsa.getFlowByActivity(flowclass=['Employment', ‘Money’, ‘Other’], years=[2018], datasource="BLS_QCEW")

	 

Returns a pandas dataframe that you can subset by NAICS sector in this case it will be the ActivityProducedBy.  

[See the format reference table](https://github.com/USEPA/flowsa/blob/master/format%20specs/FlowByActivity.md) - filter by Location using a county FIPS  as a 5 digit code, e.g. 13001 for Appling County.  

You can also create a df for multiple years. There is data for 2010 – 2018. Example:  

	bls_flowsbyactivity = flowsa.getFlowByActivity(flowclass=['Employment', ‘Money’, ‘Other’], years=[2015, 2016], datasource="BLS_QCEW")


<br>

#### For Comparison to prior year

Additional columns are available to compare to the prior year.  

oty_annual_avg_emplvl_chg  
oty_annual_avg_estabs_chg  
oty_avg_annual_pay_chg 

See: [Annual Average Data Slide Layout table](https://data.bls.gov/cew/doc/access/csv_data_slices.htm)  

When Catherine Birney modified the data to include the columns for changes from prior years, pycharm couldn’t handle the size of the files and kept crashing. To include that data, Catherine says you'd need to modify the code in BLS_QCEW.py.  



<br>
Explore [options for zip code level data](../../../community/industries/)  


<br>

## BEA Data Preparation (Discontinued) 

[Prior Data Processing Python Script for BEA data](https://github.com/modelearth/community-data/blob/master/process/python/us_econ.ipynb) - Edit locally using [Anaconda Jupyter Notebook](https://jupyter.org/install)  

Methodology Discontinued: Some industries lacked payroll estimates at both the county and state level.  This occurs for approximately 80 of 388 industries in Georgia. For example, payroll for Georgia's 9 automotive manufacturers is not included in the U.S. Bureau of Economic Analysis (BEA) industry data. US census privacy protection rules omit company payroll when only 1 or 2 establishments reside in a county.  

The census publishes payroll and employee counts by county for industries with 3 or more establishments. Sometimes industries with up to 27 establishments are also unpublished. Values are available as aggregates within a state total for each industry.  

To fill gaps, we generate an industry estimate for each year in a range of 5 years, then average across years. This allows a sum of each industry’s average to match the state's total for the 5 years spanned.  

To approximate payrolls and employee levels based on the number of establishments, we provide three options under the settings icon when at least one county is selected:  

1. Use average of payrolls not assigned to counties  
2. Use average of all state payrolls (less accurate)  
3. Leave unpublished values blank  

The default display is option 1 since it more accurately fills in the gaps with values that add up to the actual state total. In some cases, option 2 may more accurately match an individual county, so we advise comparing the two while factoring in attributes that may affect the level in the counties you are analysing.  

Option 1 dispersals add up to the state total by pulling their average from other counties with a similar low concentration of an industry.  

For example: With option 1 “Temporary Help Services” is five times higher than the state average for estimated counties using the average of unassigned payrolls - perhaps because agricultural counties with only a couple temp agencies tend to have larger payrolls since as the sole provider of local temp services.  With option 2 (state average), the level is low because overall counties have more temp services with smaller payrolls per establishment.  

This trend flips for industries that have larger revenue in counties where firms are concentrated, hence “Transportation Equipment Manufacturing” is estimated higher for McDuffie County, Georgia when using the average of all state payrolls because payrolls for similar firms in other counties with higher concentrations of equipment manufacturing skew the average upward, exceeding the value that is shared by the unallocated counties which have less concentration.  

[Community Data Github Repo](https://github.com/modelearth/community-data/)

<!--
Removed from project list

## Use of BEA commodities to estimate null industries

To protect the privacy of individual firms, the census omits payroll and empolyee count data for some industries at both the state and county level (like Automobile Manufacturing).  For Georgia, there are [89 industries](../community-data/us/state/ga/industries_state13_naics6_0s.tsv) with only the number of establishments available at both the county and state lever. 

The estimates for these omitted industry values could be generated using the state BEA commodity data with the crosswalk file, or an average from other states could be used (as long as each industry has at least one payroll value in another state). 
-->


