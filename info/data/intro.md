# County Industry Data Prep  

The following documents how to generate a CSV file containing BLS data pulled from the EPAs Flowsa's [Data Commons](https://datacommons.org) API.  

## BLS Data Preparation 

The steps below have been applied in our [Google CoLab for exploring NAICS](https://colab.research.google.com/drive/1HLK4HIUMLlgTR524QoCKvfaNl-La48XU?usp=sharing) which can be used to save a CSV file with 6-digit naics in your Google Drive.  Also resides in our [FLOWSA fork](https://github.com/modelearth/flowsa/tree/master/colabs).

U.S. Bureau of Labor Statistics (BLS) industry data  
BLS data is pulled using the [FLOWSA Python script](https://github.com/USEPA/flowsa/blob/master/flowsa/BLS_QCEW.py)
maintained by Catherine Birney.
<!--Check if 2017 has been added to master crosswalk  -->

**Flowsa Wiki**  
[Install & Run](https://github.com/USEPA/flowsa/wiki)  
How Flowsa data is prepared - Creating a FlowByActivity Dataset

If you change BLS_QCEW.py, do so in our [FLOWSA fork](https://github.com/modelearth/flowsa).

Check for 6-digit 336111 automobile industry NAICS when outputting using FLOWSA.  
Note that only 4-digit NAICS resides in "By-Industry" in [BLS downloadable files](https://www.bls.gov/cew/downloadable-data-files.htm).  


Output to [state data files](https://github.com/modelearth/community-data/tree/master/us/state)    

Output 5 columns with names: fips, naics, employees, wages and firms (establishment count)

- fips - Location (fips for county)  
- naics - ActivityProducedBy (6-digit naics)  
- employees - Employment FlowAmount (Number of Employees)  
- wages - Money (Annual Wages)
- firms - Other (Number of Extablishments)  
