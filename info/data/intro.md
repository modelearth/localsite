# County Industry Data Prep  


## BLS Data Preparation 

U.S. Bureau of Labor Statistics (BLS) industry data  
BLS data is pulled using the [FLOWSA Python script](https://github.com/USEPA/flowsa/blob/master/flowsa/BLS_QCEW.py)
maintained by Catherine Birney.
<!--Check if 2017 has been added to master crosswalk  -->

If you change BLS_QCEW.py, do so in our [FLOWSA fork](https://github.com/modelearth/flowsa).

Only 4-digit NAICS resides in "By-Industry" in [BLS downloadable files](https://www.bls.gov/cew/downloadable-data-files.htm).  
Check for 6-digit 336111 automobile industry NAICS when outputting using FLOWSA.  

Output to [state data files](https://github.com/modelearth/community-data/tree/master/us/state)    

