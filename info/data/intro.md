# County Industry Data Prep  


To do: Add U.S. Bureau of Labor Statistics (BLS) industry data  
BLS data is pulled using the [FLOWSA Python script](https://github.com/USEPA/flowsa/blob/master/flowsa/BLS_QCEW.py)
maintained by Catherine Birney.
<!--Check if 2017 has been added to master crosswalk  -->

[Prior Data Processing Python Script for BEA data](https://github.com/modelearth/community-data/blob/master/process/python/us_econ.ipynb) - Edit locally using [Anaconda Jupyter Notebook](https://jupyter.org/install)  


[State data files](https://github.com/modelearth/community-data/tree/master/us/state)   

[Options for zip code level data](../../../community/industries/)

Problem: Some industries lack payroll estimates at both the county and state level.  This occurs for approximately 80 of 388 industries in Georgia. For example, payroll for Georgia's 9 automotive manufacturers is not included in the U.S. Bureau of Economic Analysis (BEA) industry data. US census privacy protection rules omit company payroll when only 1 or 2 establishments reside in a county.   

Possible Solution: Identify large employers, like automotive manufacturers, and add county-level estimates using national or regional averages.  

