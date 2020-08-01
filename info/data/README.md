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


