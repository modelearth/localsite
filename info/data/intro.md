# County Industry Data Prep  


## BLS Data Preparation 

U.S. Bureau of Labor Statistics (BLS) industry data  
BLS data is pulled using the [FLOWSA Python script](https://github.com/USEPA/flowsa/blob/master/flowsa/BLS_QCEW.py)
maintained by Catherine Birney.
<!--Check if 2017 has been added to master crosswalk  -->

If you change BLS_QCEW.py, do so in our [FLOWSA fork](https://github.com/modelearth/flowsa).

Check for 6-digit 336111 automobile industry NAICS when outputting using FLOWSA.  
Note that only 4-digit NAICS resides in "By-Industry" in [BLS downloadable files](https://www.bls.gov/cew/downloadable-data-files.htm).  


Output to [state data files](https://github.com/modelearth/community-data/tree/master/us/state)    

Output 5 columns with names: fips, naics, employees, wages and firms (establishment count)

- Location (fips for county)  
- ActivityProducedBy (6-digit naics)  
- Employment FlowAmount (Number of Employees)  
- Money (Annual Wages)
- Other (Number of Extablishments)  
