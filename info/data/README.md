## Data Preparation 

The census publishes payroll and employee counts by county for industries with 3 or more establishments. Sometimes industries with up to 27 establishments are also unpublished. Values are available as aggregates within a state total for each industry.  

To fill gaps, we generate an industry estimate for each year in a range of 5 years, then average across years. This allows a sum of each industry’s average to match the state's total for the 5 years spanned.  

To approximate payrolls and employee levels based on the number of establishments, we provide three options under the settings icon when at least one county is selected:  

1. Average of unallocated county payrolls  
2. Average of all state payrolls (less accurate)  
3. Leave unpublished values blank  

The default display is option 1 since it more accurately fills in the gaps with values that add up to the actual state total. In some cases, option 2 may more accurately match an individual county, so we advise comparing the two while factoring in attributes that may affect the level in the counties you are analysing.  

Option 1 dispersals add up to the state total by pulling their average from other counties with a similar low concentration of an industry.  

For example: With option 1 “Temporary Help Services” is five times higher than the state average for estimated counties using the average of unassigned payrolls - perhaps because agricultural counties with only a couple temp agencies tend to have larger payrolls since as the sole provider of local temp services.  With option 2 (state average), the level is low because overall counties have more temp services with smaller payrolls per establishment.  

This trend flips for industries that have larger revenue in counties where firms are concentrated, hence “Transportation Equipment Manufacturing” is estimated higher for McDuffie County, Georgia when using the average of all state payrolls because payrolls for similar firms in other counties with higher concentrations of equipment manufacturing skew the average upward, exceeding the value that is shared by the unallocated counties which have less concentration.  

[More about data prep](https://github.com/modelearth/community-data/)




