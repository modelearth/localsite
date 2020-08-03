//default is state13 for GA, change that number to get data for other states
//the number after naics is the number of digits in the naics code

// To do:
// This is commented out below, call heatmap widget instead.
// goHash({"naics":naicshash});

let dataObject={};
dataObject.stateshown=13;
let params = loadParams(location.search,location.hash);
if(params["geo"]){
    geo=params["geo"]
    if (geo.includes(",")){
        geos=geo.split(",")
        fips=[]
        for (var i = 0; i<geos.length; i++){
            fips.push(geos[i].split("US")[1])
        }
        dataObject.stateshown=(geos[0].split("US")[1]).slice(0,2)
    }else{
        fips = geo.split("US")[1]
        dataObject.stateshown=(geo.split("US")[1]).slice(0,2)
    }

}else{
    fips = dataObject.stateshown;
}

// Get the levels below root
/* Try something like this from navigation.js
    let foldercount = (location.pathname.split('/').length - 1); // - (location.pathname[location.pathname.length - 1] == '/' ? 1 : 0) // Removed because ending with slash or filename does not effect levels. Increased -1 to -2.
    foldercount = foldercount - 2;
    let climbcount = foldercount;
    if(location.host.indexOf('localhost') >= 0) {
        climbcount = foldercount - 0;
    }
    let climbpath = "";
    for (var i = 0; i < climbcount; i++) {
        climbpath += "../";
    }
    if (climbpath == "") {
        climbpath += "./"; // Eliminates ? portion of URL
    }
*/
d3.csv(dual_map.community_data_root() + "us/id_lists/state_fips.csv").then( function(consdata) {
    var filteredData = consdata.filter(function(d) {
        if(d["FIPS"]==String(dataObject.stateshown)) {
            var promises = [
                d3.csv(dual_map.community_data_root() + "us/id_lists/industry_id_list.csv"),
                d3.tsv(dual_map.community_data_root() + "us/state/"+d['Postal Code']+"/industries_state"+dataObject.stateshown+"_naics2_all.tsv"),
                //d3.tsv(dual_map.community_data_root() + "data/c3.tsv"),
                d3.tsv(dual_map.community_data_root() + "us/state/"+d['Postal Code']+"/industries_state"+dataObject.stateshown+"_naics4_all.tsv"),
                //d3.tsv(dual_map.community_data_root() + "data/c5.tsv"),
                d3.tsv(dual_map.community_data_root() + "us/state/"+d['Postal Code']+"/industries_state"+dataObject.stateshown+"_naics6_all.tsv"),
                d3.csv(dual_map.community_data_root() + "us/id_lists/county_id_list.csv"),
                d3.tsv(dual_map.community_data_root() + "us/state/"+d['Postal Code']+"/industries_state"+dataObject.stateshown+"_naics2_state_all.tsv"),
                d3.tsv(dual_map.community_data_root() + "us/state/"+d['Postal Code']+"/industries_state"+dataObject.stateshown+"_naics4_state_all.tsv"),
                d3.tsv(dual_map.community_data_root() + "us/state/"+d['Postal Code']+"/industries_state"+dataObject.stateshown+"_naics6_state_all.tsv"),
                d3.tsv(dual_map.community_data_root() + "us/state/"+d['Postal Code']+"/"+d['Postal Code']+"counties.csv")
            ]


            Promise.all(promises).then(ready);
    
        }
    })
})



function ready(values) {
    console.log("ready - promises loaded")
    d3.csv(dual_map.community_data_root() + "us/id_lists/state_fips.csv").then( function(consdata) {
        var filteredData = consdata.filter(function(d) {
            if(d["FIPS"]==String(dataObject.stateshown)) {
                let params = loadParams(location.search,location.hash);
                let lastParams = {};
                
                let industryData ={}
                subsetKeys = ['emp_reported','emp_est1','emp_est3', 'payann_reported','payann_est1','payann_est3', 'estab', 'NAICS2012_TTL','GEO_TTL','state','COUNTY','relevant_naics','estimate_est1','estimate_est3']
                subsetKeys_state = ['emp_agg', 'payann_agg', 'estab_agg', 'NAICS2012_TTL','GEO_TTL','state','COUNTY','relevant_naics']
                subsetKeys_state_api = ['emp_api', 'payann_api', 'estab_api', 'NAICS2012_TTL','GEO_TTL','state','COUNTY','relevant_naics']
                dataObject.subsetKeys=subsetKeys
                dataObject.subsetKeys_state=subsetKeys_state
                dataObject.subsetKeys_state_api=subsetKeys_state_api
                
                if (!params.catsort) {
                    params.catsort = "payann";
                }
                if (!params.catsize) {
                   params.catsize = 6;
                }
                if (!params.census_scope) {
                   params.census_scope = 'state';
                }

                console.log("tttttt"+params.census_scope)
                industryData = {
                    'ActualRate': formatIndustryData(values[params.catsize/2],dataObject.subsetKeys),
                }
                dataObject.industryData = industryData;
                //console.log(dataObject.industryData)
                if (params.catsize==2){
                    industryDataState = {
                        'ActualRate': formatIndustryData(values[5],dataObject.subsetKeys_state)
                    }
                }else if(params.catsize==4){
                    industryDataState = {
                        'ActualRate': formatIndustryData(values[6],dataObject.subsetKeys_state)
                    }
                }else if(params.catsize==6){
                    industryDataState = {
                        'ActualRate': formatIndustryData(values[7],dataObject.subsetKeys_state)
                    }
                }
                    
                dataObject.industryDataState=industryDataState;

                console.log(dataObject.industryDataState)
                if (params.catsize==2){
                    industryDataStateApi = {
                        'ActualRate': formatIndustryData(values[5],dataObject.subsetKeys_state_api)
                    }
                }else if(params.catsize==4){
                    industryDataStateApi = {
                        'ActualRate': formatIndustryData(values[6],dataObject.subsetKeys_state_api)
                    }
                }else if(params.catsize==6){
                    industryDataStateApi = {
                        'ActualRate': formatIndustryData(values[7],dataObject.subsetKeys_state_api)
                    }
                }
                    
                dataObject.industryDataStateApi=industryDataStateApi;
                
                industryNames = {}
                values[0].forEach(function(item){
                    industryNames[+item.relevant_naics] = item.industry_detail
                })
                dataObject.industryNames=industryNames;
                counties = []
                values[4].forEach(function(item){
                    if(item.abvr ==d['Name']){
                        counties.push(item.id)
                    }
                })
                dataObject.counties=counties;
                statelength=dataObject.counties.length
                if(params["geo"]){
                    geo=params["geo"]
                    if (geo.includes(",")){
                        geos=geo.split(",")
                        fips=[]
                        for (var i = 0; i<geos.length; i++){
                            fips.push(geos[i].split("US")[1])
                        }
                        dataObject.stateshown=(geos[0].split("US")[1]).slice(0,2)
                    }else{
                        fips = geo.split("US")[1]
                        dataObject.stateshown=(geo.split("US")[1]).slice(0,2)
                    }

                }else{
                    fips = dataObject.stateshown;
                }

                /*
                let geo_list={}
                counter=0
                */
                //renderIndustryChart(dataObject,values,params,geo_list,counter);
                renderIndustryChart(dataObject,values,params);
                $(document).ready(function() {

                    // `hashChangeEvent` event reside in multiple widgets. 
                    // Called by goHash within localsite.js
                    document.addEventListener('hashChangeEvent', function (elem) {
                        let params = loadParams(location.search,location.hash);
                        //displayTopIndustries();
                        console.log("naics.js detects hash change hashChangeEvent")
                        
                        
                        renderIndustryChart(dataObject,values,params)
                    }, false);
                                        
                    if (document.getElementById("clearButton")) {
                        document.getElementById("clearButton").addEventListener("click", function(){
                            clearHash("geo,regiontitle");
                            geoChanged(dataObject)
                        }); 
                    }
                    //addGeoChangeDetectToDOM(1);
                    function addGeoChangeDetectToDOM(count) { // Wait for county checkboxes to be added to DOM by map-filters.js
                        if($(".geo").length) {
                            //d3.selectAll(".geo").on("change",function() {
                            $(".geo").change(function(e) {
                                geoChanged(dataObject);
                            });
                        } else if (count<100) { 
                            setTimeout( function() {
                                addGeoChangeDetectToDOM(count+1)
                            }, 10 );
                        } else {
                            console.log("Geo location filter probably not in page. addGeoChangeDetectToDOM exceeded 100 attempts.");
                        }
                    }

                });
    

    // No luck
    //$(window).on('locationchange', function() {
    //    alert('The hash has changed!');
    //});
            }
        })
    })

}

// We might call this when hash changes.
//$(window).on('hashchange', function() { // Avoid window.onhashchange since overridden by map and widget embeds
function displayTopIndustries() { // Not currently called
    console.log("params.catsort " + params.catsort)
    lastParams = params;
    params = loadParams(location.search,location.hash);
    //alert("topindustries.js hashchange from lastParams.go: " + lastParams.go + " to " + params.go);

    // Both call topRatesInFips(). Might be good to move geoChanged processing into renderIndustryChart()
    
    if(params.geo){
        if (params.geo.includes(",")){
            geos=params.geo.split(",")
            dataObject.stateshown=(geos[0].split("US")[1]).slice(0,2)
        }else{
            dataObject.stateshown=(params.geo.split("US")[1]).slice(0,2)
        }
    }


    
    if(dataObject.stateshown!=dataObject.laststateshown){
        d3.csv(dual_map.community_data_root() + "us/id_lists/state_fips.csv").then( function(consdata) {
            var filteredData = consdata.filter(function(d) {
                if(d["FIPS"]==String(dataObject.stateshown)) {
                    var promises = [
                    d3.csv(dual_map.community_data_root() + "data/industry_id_list.csv"),
                    d3.tsv(dual_map.community_data_root() + "us/state/"+d['Postal Code']+"/industries_state"+dataObject.stateshown+"_naics2_all.tsv"),
                    //d3.tsv(dual_map.community_data_root() + "data/c3.tsv"),
                    d3.tsv(dual_map.community_data_root() + "us/state/"+d['Postal Code']+"/industries_state"+dataObject.stateshown+"_naics4_all.tsv"),
                    //d3.tsv(dual_map.community_data_root() + "data/c5.tsv"),
                    d3.tsv(dual_map.community_data_root() + "us/state/"+d['Postal Code']+"/industries_state"+dataObject.stateshown+"_naics6_all.tsv"),
                    d3.csv(dual_map.community_data_root() + "us/id_lists/county_id_list.csv"),
                    d3.tsv(dual_map.community_data_root() + "us/state/"+d['Postal Code']+"/industries_state"+dataObject.stateshown+"_naics2_state_all.tsv"),
                    d3.tsv(dual_map.community_data_root() + "us/state/"+d['Postal Code']+"/industries_state"+dataObject.stateshown+"_naics4_state_all.tsv"),
                    d3.tsv(dual_map.community_data_root() + "us/state/"+d['Postal Code']+"/industries_state"+dataObject.stateshown+"_naics6_state_all.tsv"),
                    d3.tsv(dual_map.community_data_root() + "us/state/"+d['Postal Code']+"/"+d['Postal Code']+"counties.csv")
                    ]
                    Promise.all(promises).then(ready);
                }
            })

        })
    }
//})
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Functions
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var priorHash_Naics = {};
function renderIndustryChart(dataObject,values,params) {

    if(!params.catsort){
        params.catsort = "payann";
    }
    if(!params.catsize){
        params.catsize = 6;
    }
    if(!params.census_scope){
        params.census_scope='state'
    }

    // Reduce params to only those used
    const filteredKeys = ['go','geo','catsort','catsize','catmethod','catpage','catcount','census_scope'];
    params = filteredKeys.reduce((obj, key) => ({ ...obj, [key]: params[key] }), {});

    console.log("params used by naics.js:")
    console.log(params)
    // Check which naics params have channged
    let whichHaveChanged = [];
    for (const key in params) {
      //if (watchingHash.includes(${key})) {
      if (params[key] != priorHash_Naics[key]) {
        whichHaveChanged.push(key)
      }
    }
    console.log("whichHaveChanged: " + whichHaveChanged);
    if (whichHaveChanged.length == 0) {
        console.log("Cancel naics.js, no params have changed")
        return; // None have changed
    }

    subsetKeys = ['emp_reported','emp_est1','emp_est3', 'payann_reported','payann_est1','payann_est3', 'estab', 'NAICS2012_TTL','GEO_TTL','state','COUNTY','relevant_naics','estimate_est1','estimate_est3']
    subsetKeys_state = ['emp_agg', 'payann_agg', 'estab_agg', 'NAICS2012_TTL','GEO_TTL','state','COUNTY','relevant_naics']
    subsetKeys_state_api = ['emp_api', 'payann_api', 'estab_api', 'NAICS2012_TTL','GEO_TTL','state','COUNTY','relevant_naics']
    dataObject.subsetKeys=subsetKeys
    dataObject.subsetKeys_state=subsetKeys_state
    dataObject.subsetKeys_state_api=subsetKeys_state_api
    industryData = {
        'ActualRate': formatIndustryData(values[params.catsize/2],dataObject.subsetKeys),
    }
    dataObject.industryData = industryData;
    dataObject.industryData=industryData;
    if (params.catsize==2){
        industryDataState = {
            'ActualRate': formatIndustryData(values[5],dataObject.subsetKeys_state)
        }
    }else if(params.catsize==4){
        industryDataState = {
            'ActualRate': formatIndustryData(values[6],dataObject.subsetKeys_state)
        }
    }else if(params.catsize==6){
        industryDataState = {
            'ActualRate': formatIndustryData(values[7],dataObject.subsetKeys_state)
        }
    }
        
    dataObject.industryDataState=industryDataState;
    console.log(dataObject.industryDataState)
    if (params.catsize==2){
        industryDataStateApi = {
            'ActualRate': formatIndustryData(values[5],dataObject.subsetKeys_state_api)
        }
    }else if(params.catsize==4){
        industryDataStateApi = {
            'ActualRate': formatIndustryData(values[6],dataObject.subsetKeys_state_api)
        }
    }else if(params.catsize==6){
        industryDataStateApi = {
            'ActualRate': formatIndustryData(values[7],dataObject.subsetKeys_state_api)
        }
    }
        
    dataObject.industryDataStateApi=industryDataStateApi;
    if (params.geo){
        if (params.geo.includes(",")){
            let geos=params.geo.split(",")
            fips=[]
            for (var i = 0; i<geos.length; i++){
                fips.push(geos[i].split("US")[1])
            }
            dataObject.stateshown=(geos[0].split("US")[1]).slice(0,2)
        }else{
            fips = params.geo.split("US")[1]
            dataObject.stateshown=(params.geo.split("US")[1]).slice(0,2)
        }
    }else{
        fips = dataObject.stateshown;
    }
    console.log("renderIndustryChart calls topRatesInFips with fips: " + fips)
    topRatesInFips(dataObject, dataObject.industryNames, fips, params);
    priorHash_Naics = params;
}

//function for when the geo hash changes
function geoChanged(dataObject,params){
    

    if (!params) {
        params = loadParams(location.search,location.hash); // Pull from updated hash
    }
    if (params.geo) {
        if (params.geo.includes(",")) {
            geos=params.geo.split(",")
            fips=[]
            for (var i = 0; i<geos.length; i++){
                fips.push(geos[i].split("US")[1])
            }
            dataObject.stateshown=(geos[0].split("US")[1]).slice(0,2)
        } else {
            fips = params.geo.split("US")[1]
            dataObject.stateshown=(params.geo.split("US")[1]).slice(0,2)
        }
    } else {
        fips = dataObject.stateshown;
    }
    if (fips == dataObject.stateshown) {
        $(".county-view").hide();
        $(".state-view").show();
        $(".industry_filter_settings").hide(); // temp
    } else {
        $(".state-view").hide();
        $(".county-view").show();
        $(".industry_filter_settings").show(); // temp
    }
    

    if(dataObject.stateshown!=dataObject.laststateshown){
        d3.csv(dual_map.community_data_root() + "us/id_lists/state_fips.csv").then( function(consdata) {
            var filteredData = consdata.filter(function(d) {
                if(d["FIPS"]==String(dataObject.stateshown)) {
                    var promises = [
                    d3.csv(dual_map.community_data_root() + "data/industry_id_list.csv"),
                    d3.tsv(dual_map.community_data_root() + "us/state/"+d['Postal Code']+"/industries_state"+dataObject.stateshown+"_naics2_all.tsv"),
                    //d3.tsv(dual_map.community_data_root() + "data/c3.tsv"),
                    d3.tsv(dual_map.community_data_root() + "us/state/"+d['Postal Code']+"/industries_state"+dataObject.stateshown+"_naics4_all.tsv"),
                    //d3.tsv(dual_map.community_data_root() + "data/c5.tsv"),
                    d3.tsv(dual_map.community_data_root() + "us/state/"+d['Postal Code']+"/industries_state"+dataObject.stateshown+"_naics6_all.tsv"),
                    d3.csv(dual_map.community_data_root() + "us/id_lists/county_id_list.csv"),
                    d3.tsv(dual_map.community_data_root() + "us/state/"+d['Postal Code']+"/industries_state"+dataObject.stateshown+"_naics2_state_all.tsv"),
                    d3.tsv(dual_map.community_data_root() + "us/state/"+d['Postal Code']+"/industries_state"+dataObject.stateshown+"_naics4_state_all.tsv"),
                    d3.tsv(dual_map.community_data_root() + "us/state/"+d['Postal Code']+"/industries_state"+dataObject.stateshown+"_naics6_state_all.tsv"),
                    d3.tsv(dual_map.community_data_root() + "us/state/"+d['Postal Code']+"/"+d['Postal Code']+"counties.csv")
                    ]
                    Promise.all(promises).then(ready);
                }
            })

        })
    }
    topRatesInFips(dataObject, dataObject.industryNames, fips, params)
    console.log('fips: '+fips)
}


function parseSubsetValues(entry, subsetKeys, randOffset) {
    subsets = {}
    subsetKeys.forEach(d=>{
        if (randOffset==true) {
            subsets[d] = entry[d] + getRndPercentError() * +entry[d]
        } else {
            subsets[d] = entry[d]
        }
    })
    return subsets
}


function formatIndustryData(rawData,subsetKeys) {
    // var industryByType = d3.map()
    var industryByType = {}

    if (rawData) {
    for (var i = 0; i<rawData.length; i++){

        entry = rawData[i]
        industryID = entry.relevant_naics

        if (industryID in industryByType) {
            industryByType[entry.relevant_naics][entry.id] = parseSubsetValues(entry, subsetKeys)
        } else {
            industryByType[entry.relevant_naics] = {}
            industryByType[entry.relevant_naics][entry.id] = parseSubsetValues(entry, subsetKeys)
        }
    }
    }
    return industryByType
}


function keyFound(this_key, cat_filter,params) {
    if (this_key <= 1) {
        return false;
    } else if (cat_filter.length == 0) { // No filter
        return true;
    } else if (params.go == "bioeconomy" && this_key.startsWith("11")) { // Quick hack, always include Agriculture
        return true;
    } else if (params.go == "manufacturing" && (this_key.startsWith("31") || this_key.startsWith("32") || this_key.startsWith("33") )) { // All manufacturing
        return true;
    } else if ( (params.go == "bioeconomy" || params.go=="parts")&& params.catsize== 2){ // Our 4 digit array matches key
        cat_filt=[]
        for(i=0;i<cat_filter.length;i++){
            cat_filt.push(cat_filter[i].slice(0,2))
        }
        if(cat_filt.includes(this_key.slice(0,2))){
            return true;
        }
    }  else if ( (params.go == "bioeconomy" || params.go=="parts")&& params.catsize== 4 ) { // Our 4 digit array matches key
        cat_filt=[]
        for(i=0;i<cat_filter.length;i++){
            cat_filt.push(cat_filter[i].slice(0,4))
        }
        if(cat_filt.includes(this_key.slice(0,4))){
            return true;
        }
    }else if ( (params.go == "bioeconomy" || params.go=="parts")&& params.catsize == 6 && cat_filter.includes(this_key.slice(0,6))) { // Our 4 digit array matches key
        return true;
    }else {
        return false;
    }
}

// Top rows of for a specific set of fips (states and counties)
function topRatesInFips(dataSet, dataNames, fips, params){
    let catcount = params.catcount || 20;

    $("#econ_list").html("");
    console.log("topRatesInFips")
    d3.csv(dual_map.community_data_root() + "us/id_lists/state_fips.csv").then( function(consdata) {
        var filteredData = consdata.filter(function(d) {
            if(d["FIPS"]==String(dataObject.stateshown)) {
                if(params.catsort=='estab'){
                    which=params.catsort;
                }else{
                    if(params.catmethod==0){
                        which=params.catsort+'_reported'
                        //console.log("jjjjjjjjjjjjjjjjj"+which)
                    }else if(params.catmethod==2){
                        which=params.catsort+'_est3'
                        estimed='estimate_est3'
                    }else{ // params.catmethod==1 or null
                        which= params.catsort+'_est1'
                        estimed='estimate_est1'
                    }
                }


                if(params['census_scope']=="state"){
                    which_state_api=params.catsort+'_api'
                }else{
                    which_state=params.catsort+'_agg'
                    
                }
                
                // NAICS FROM community/projects/biotech
                var bio_input = "113000,321113,113310,32121,32191,562213,322121,322110,"; // Omitted 541620
                var bio_output = "325211,325991,3256,335991,325120,326190,";
                var green_energy = "221117,221111,221113,221114,221115,221116,221118,";
                var fossil_energy = "221112,324110";
                var parts = "336111,336330,336340,336360,336370,336390,333613,336412,336413,335910,335912,339110,333111,325211,325520,326112,326220,331221,332211";
                var parts_carpets = "314110,313110,313210"

                var cat_filter = [];
                if (params.go){
                    if (params.go == "bioeconomy") {
                        cat_filter = (bio_input + bio_output + green_energy + fossil_energy).split(',');
                    }
                    if (params.go == "parts") {
                        cat_filter = (parts).split(',');
                    }
                    if (cat_filter.length) {
                        cat_filt=[]
                        for(i=0;i<cat_filter.length;i++){
                            
                                cat_filt.push(cat_filter[i].slice(0,6))
                            
                        }
                        cat_filter=cat_filt
                        //console.log(cat_filter)
                    }
                }
                if(params.go=="manufacturing"){
                    cat_filter=["manufacturing placeholder"]
                }
                
                var rates_dict = {};
                var rates_list = [];
                var forlist={}
                selectedFIPS = fips;
                if(Array.isArray(fips)){
                    for (var i = 0; i<fips.length; i++){
                        Object.keys(dataSet.industryData.ActualRate).forEach( this_key=>{
                            // this_key = parseInt(d.split("$")[1])
                            if (keyFound(this_key, cat_filter,params)){
                                this_rate = dataSet.industryData.ActualRate[this_key]
                                if (this_rate.hasOwnProperty(fips[i])){ 
                                    if(rates_dict[this_key]){
                                        forlist[this_key]=rates_dict[this_key]+parseFloat(this_rate[fips[i]][which])
                                        rates_dict[this_key] = rates_dict[this_key]+parseFloat(this_rate[fips[i]][which])      
                                    }else{
                                        rates_dict[this_key] = parseFloat(this_rate[fips[i]][which])
                                        forlist[this_key]=parseFloat(this_rate[fips[i]][which])
                                    }
                                    
                                } else {
                                    if(rates_dict[this_key]){
                                        rates_dict[this_key] = rates_dict[this_key]+0.0
                                        forlist[this_key]=rates_dict[this_key]+0.0
                                    }else{
                                    rates_dict[this_key] = 0.0
                                    forlist[this_key]=0.0
                                    }
                                }
                            }
                        })


                    }
                    var keys = Object.keys(forlist);
                    keys.forEach(function(key){
                        rates_list.push(forlist[key])
                    });

                }else if(fips==dataObject.stateshown){
                    //fips=13
                    
                        if(params['census_scope']=="state"){
                            Object.keys(dataSet.industryDataStateApi.ActualRate).forEach( this_key=>{
                                if (keyFound(this_key, cat_filter,params)){
                                    this_rate = dataSet.industryDataStateApi.ActualRate[this_key]
                                    if (this_rate.hasOwnProperty(fips)){ 
                                        rates_dict[this_key] = parseFloat(this_rate[fips][which_state_api])
                                        rates_list.push(parseFloat(this_rate[fips][which_state_api]))
                                    } else {
                                        rates_dict[this_key] = 0.0
                                        rates_list.push(0.0)
                                    }
                                }
                            })
                        }
                    else{
                        Object.keys(dataSet.industryDataState.ActualRate).forEach( this_key=>{
                            if (keyFound(this_key, cat_filter,params)){
                                this_rate = dataSet.industryDataState.ActualRate[this_key]
                                if (this_rate.hasOwnProperty(fips)){ 
                                    rates_dict[this_key] = parseFloat(this_rate[fips][which_state])
                                    rates_list.push(parseFloat(this_rate[fips][which_state]))
                                } else {
                                    rates_dict[this_key] = 0.0
                                    rates_list.push(0.0)
                                }
                            }
                        })
                    }    

                }else{
                    Object.keys(dataSet.industryData.ActualRate).forEach( this_key=>{
                        if (keyFound(this_key, cat_filter,params)){
                            this_rate = dataSet.industryData.ActualRate[this_key]
                            if (this_rate.hasOwnProperty(fips)){ 
                                rates_dict[this_key] = parseFloat(this_rate[fips][which])
                                rates_list.push(parseFloat(this_rate[fips][which]))
                            } else {
                                rates_dict[this_key] = 0.0
                                rates_list.push(0.0)
                            }
                        }
                    })
                }

                rates_list = rates_list.sort(function(a,b) { return a - b}).reverse()
                top_data_list = []
                top_data_ids = []
                naCount = 1
                let naicscode = [];
                x=Math.min(catcount,rates_list.length)

                if(Array.isArray(fips)){

                    for (var i=0; i<rates_list.length; i++) {
                        id = parseInt(getKeyByValue(rates_dict, rates_list[i]))
                        delete rates_dict[id]
                        rateInFips=0
                        rateArray={}
                        estim={}
                        naicscode=0
                        for (var j = 0; j<fips.length; j++){ 
                            if(dataSet.industryData.ActualRate[id]){ 
                                if (dataSet.industryData.ActualRate[id].hasOwnProperty(fips[j])) {
                                    rateInFips = rateInFips+parseFloat(dataSet.industryData.ActualRate[id][fips[j]][which])
                                    rateArray[j]=parseFloat(dataSet.industryData.ActualRate[id][fips[j]][which]);
                                    naicscode = dataSet.industryData.ActualRate[id][fips[j]]['relevant_naics']
                                    if(params.catmethod!=0 & params.catsort!='estab'){
                                        estim[j]=parseFloat(dataSet.industryData.ActualRate[id][fips[j]][estimed])
                                    }else{
                                        estim[j]=parseFloat(0)
                                    }
                                } else {
                                        rateInFips = rateInFips+0
                                        estim[j]=parseFloat(0)

                                }
                            }
                        }
                        if (keyFound(naicscode, cat_filter,params)){
                            if(dataNames[id]){
                                if (rateInFips == null) {
                                    rateInFips = 1
                                    top_data_list.push(
                                        {'data_id': dataNames[id], [which]: 1,'NAICScode': 1, 'rank': i,'Estimate':0}
                                    )
                                }  else {
                                    top_data_list.push(
                                        {'data_id': dataNames[id], [which]: rateInFips,'NAICScode': naicscode, 'rank': i, 'ratearray':rateArray,'Estimate':estim}
                                    )
                                    top_data_ids.push(id)
                                }
                            }
                        }
                    }   
                }else{
                    if(fips==dataObject.stateshown){
                    
                        if(params['census_scope']=="state"){
                            for (var i=0; i<rates_list.length; i++) {
                                id = parseInt(getKeyByValue(rates_dict, rates_list[i]))
                                delete rates_dict[id]

                                if (dataSet.industryDataStateApi.ActualRate[id].hasOwnProperty(fips)) {
                                    rateInFips = dataSet.industryDataStateApi.ActualRate[id][fips][which_state_api]
                                    naicscode = dataSet.industryDataStateApi.ActualRate[id][fips]['relevant_naics']
                                } else {
                                    rateInFips = 0
                                    naicscode = 1
                                }
                                
                                if (keyFound(naicscode, cat_filter,params)){
                                    if (rateInFips == null) {
                                        rateInFips = 1
                                        top_data_list.push(
                                            {'data_id': dataNames[id], [which_state_api]: 1,'NAICScode': 1, 'rank': i}
                                        )
                                    }  else {
                                        top_data_list.push(
                                            {'data_id': dataNames[id], [which_state_api]: rateInFips,'NAICScode': naicscode, 'rank': i}
                                        )
                                        top_data_ids.push(id)
                                    }
                                }
                            }
                        } else {
                            for (var i=0; i<rates_list.length; i++) {
                                id = parseInt(getKeyByValue(rates_dict, rates_list[i]))
                                delete rates_dict[id]

                                if (dataSet.industryDataState.ActualRate[id] && dataSet.industryDataState.ActualRate[id].hasOwnProperty(fips)) {
                                    rateInFips = dataSet.industryDataState.ActualRate[id][fips][which_state]
                                    naicscode = dataSet.industryDataState.ActualRate[id][fips]['relevant_naics']
                                } else {
                                    rateInFips = 0
                                    naicscode = 1
                                }
                                
                                if (keyFound(naicscode, cat_filter,params)){
                                    if (rateInFips == null) {
                                        rateInFips = 1
                                        top_data_list.push(
                                            {'data_id': dataNames[id], [which_state]: 1,'NAICScode': 1, 'rank': i}
                                        )
                                    }  else {
                                        top_data_list.push(
                                            {'data_id': dataNames[id], [which_state]: rateInFips,'NAICScode': naicscode, 'rank': i}
                                        )
                                        top_data_ids.push(id)
                                    }
                                }
                            }
                        }
                    }else{
                        for (var i=0; i<rates_list.length; i++) {
                            id = parseInt(getKeyByValue(rates_dict, rates_list[i]))
                            delete rates_dict[id]

                            if (dataSet.industryData.ActualRate[id].hasOwnProperty(fips)) {
                                rateInFips = dataSet.industryData.ActualRate[id][fips][which]
                                naicscode = dataSet.industryData.ActualRate[id][fips]['relevant_naics']
                                if(params.catmethod!=0 & params.catsort != 'estab'){
                                    estim = dataSet.industryData.ActualRate[id][fips][estimed]
                                }else{
                                    estim=0
                                }
                                //console.log(estim)
                            } else {
                                rateInFips = 0
                                naicscode = 1
                                estim = 0
                            }
                            
                            if (keyFound(naicscode, cat_filter,params)){
                                if (rateInFips == null) {
                                    rateInFips = 1
                                    top_data_list.push(
                                        {'data_id': dataNames[id], [which]: 1,'NAICScode': 1, 'rank': i,'Estimate':0}
                                    )
                                }  else {
                                    top_data_list.push(
                                        {'data_id': dataNames[id], [which]: rateInFips,'NAICScode': naicscode, 'rank': i,'Estimate':estim}
                                    )
                                    top_data_ids.push(id)
                                }
                            }
                        }
                    }
                }


                let icon = "";
                let rightCol = "";
                let midCol="";
                let text = "";
                let dollar = ""; // optionally: $
                let totalLabel = "Total";
                if(params.catsort=="payann"){
                    totalLabel = "Total Payroll ($)";
                }
                d3.csv(dual_map.community_data_root() + "us/id_lists/county_id_list.csv").then( function(consdata) {
                    d3.csv(dual_map.community_data_root() + "us/state/"+d['Postal Code']+"/"+d['Postal Code']+"counties.csv").then( function(latdata) {
                         // TABLE HEADER ROW

                        if(Array.isArray(fips) && statelength != fips.length){

                            fipslen=fips.length
                            for(var i=0; i<fipslen; i++){

                                var filteredData = consdata.filter(function(d) {

                                    if(d["id"]==fips[i]){
                                        if(i==fipslen-1){
                                           text += "<div class='cell-right'>" + d["county"].split("County")[0] + " County</div>";
                                        
                                        }else{
                                            text += "<div class='cell-right'>" + d["county"].split(" County")[0] + " County</div>";
                                        }
                                    }
                                })
                            }
                        }
                        text = "<div class='row'><div class='cell'><!-- col 1 -->NAICS</div><div class='cell' style='min-width:300px'><!-- col 2 -->Industry</div>" + text + "<div class='cell-right'>" + totalLabel + "</div><div></div class='cell mock-up' style='display:none'></div>"; // #676464
                        
                        // INDUSTRY ROWS
                        y=Math.min(catcount, top_data_ids.length)
                        naicshash=""
                        $("#econ_list").html("<div><br>No results found.</div><br>");
                        for (i = 0; i < y; i++) { // Naics
                            rightCol="";
                            midCol="";

                            // Update these:
                                let latitude = "";
                                let longitude = "";
                                //let county = "Coweta" + " County"; // Replace "Coweta" with county name from dataset
                                //let county = ""; // Delete this line
                                
                                //d3.csv(dual_map.community_data_root() + "us/id_lists/county_id_list.csv").then( function(consdata) {
                                    if(Array.isArray(fips) && statelength!=fips.length){
                                        mapLink=[]
                                        for(var j=0; j<fipslen; j++){
                                            var filteredData = consdata.filter(function(d) {
                                                var filteredData = latdata.filter(function(e) {
                                                    if(d["id"]==fips[j]){
                                                        if(d["county"]==e["NAMELSAD"]){
                                                            //mapLink.push("https://www.google.com/search?q=" + top_data_list[i]['data_id'].replace(/ /g,"+") + " " + d["county"].replace(/ /g,"+") + ",+Georgia")
                                                            mapLink.push("https://www.google.com/maps/search/" + top_data_list[i]['data_id'].replace(/ /g,"+") + "/@" + e['latitude'] + "," + e['longitude'] + ",11z")
                                                            //mapLink.push("https://bing.com/maps/?q=" + top_data_list[i]['data_id'].replace(/ /g,"+") + "&cp=" + e['latitude'] + "~" + e['longitude'] + "&lvl=11"); // lvl not working
                                                        }
                                                    }
                                                })
                                            })
                                        }
                                    }else if(fips==dataObject.stateshown){
                                            //county=""
                                            mapLink = "https://www.google.com/maps/search/" + top_data_list[i]['data_id'].replace(/ /g,"+") + "/@32.9406955,-84.5411485,8z"
                                            //mapLink = "https://bing.com/maps/?q=" + top_data_list[i]['data_id'].replace(/ /g,"+") + "&cp=32.94~-84.54&z=8"; // lvl not working
                                    }else{
                                        var filteredData = consdata.filter(function(d) {
                                            var filteredData = latdata.filter(function(e) {
                                                if(d["id"]==fips ){      
                                                    if(d["county"]==e["NAMELSAD"]){
                                                                //mapLink.push("https://www.google.com/search?q=" + top_data_list[i]['data_id'].replace(/ /g,"+") + " " + d["county"].replace(/ /g,"+") + ",+Georgia")
                                                        mapLink="https://www.google.com/maps/search/" + top_data_list[i]['data_id'].replace(/ /g,"+") + "/@" + e['latitude'] + "," + e['longitude'] + ",11z"
                                                                //console.log("xxxxxxxxx"+e["longitude"])
                                                    }
                                                }
                                            })
                                        })
                                    }
                                //})
                                //let mapLink = "https://www.google.com/maps/search/" + top_data_list[i]['data_id'].replace(/ /g,"+") + "/@" + latitude + "," + longitude + ",11z";


                            if(params.catsort=="payann"){
                                //text += top_data_list[i]['NAICScode'] + ": <b>" +top_data_list[i]['data_id']+"</b>, "+String(whichVal.node().options[whichVal.node().selectedIndex].text).slice(3, )+": $"+String((top_data_list[i][whichVal.node().value]/1000).toFixed(2))+" million <br>";
                                if(Array.isArray(fips)){

                                    //if(String((top_data_list[i][whichVal.node().value]/1000).toFixed(2)).length<7){
                                    if (1==1) { // Always use million
                                        
                                        for (var j = 0; j<fips.length; j++){
                                            if(top_data_list[i]['ratearray'][j]){
                                                if(top_data_list[i]['Estimate'][j]){    
                                                    if(top_data_list[i]['Estimate'][j]>0){
                                                        
                                                        midCol=midCol + "<div class='cell-right'>" + dollar +"<a href='" + mapLink[j] + "' target='_blank'>"+'<span style="color: #676464" >'+ String((top_data_list[i]['ratearray'][j]/1000).toFixed(2)) + " million</span></a></div>";
                                                    }else{
                                                        midCol=midCol + "<div class='cell-right'>" + dollar +"<a href='" + mapLink[j] + "' target='_blank'>"+ String((top_data_list[i]['ratearray'][j]/1000).toFixed(2)) + " million</a></div>";
                                                    }
                                                }else{
                                                    midCol=midCol + "<div class='cell-right'>" + dollar +"<a href='" + mapLink[j] + "' target='_blank'>"+ String((top_data_list[i]['ratearray'][j]/1000).toFixed(2)) + " million</a></div>";
                                                }


                                                    
                                            } else {
                                                    midCol = midCol +"<div class='cell-right'>"+"<a href='" + mapLink[j] + "' target='_blank'>"+"0</a></div>";
                                            }    
                                        }
                                        rightCol = rightCol + "<div class='cell-right'>" + dollar + String((top_data_list[i][which]/1000).toFixed(2)) + " million</div>";
                                    }else{
                                        for (var j = 0; j<fips.length; j++){
                                            if(top_data_list[i]['ratearray'][j]){
                                                
                                                    midCol=midCol + "<div class='cell-right'>" + dollar + String((top_data_list[i]['ratearray'][j]/1000000).toFixed(2)) + " million</div>";
                                                
                                            }else{
                                                    midCol = midCol +"<div class='cell-right'>"+"<a href='" + mapLink[j] + "' target='_blank'>"+"0</a></div>";
                                            }   
                                        }
                                        // <span style="color: #676464">
                                        rightCol += "<div class='cell-right'>" + dollar + String((top_data_list[i][which]/1000000).toFixed(2)) + " billion</div>";
                                    }
                                }else{
                                    //if(String((top_data_list[i][whichVal.node().value]/1000).toFixed(2)).length<7){

                                    if(top_data_list[i]['Estimate']){    
                                        if(top_data_list[i]['Estimate']>0){
                                            rightCol = "<div class='cell-right'>" + dollar + "<a href='" + mapLink + "' target='_blank'>"+'<span style="color: #676464" >'+String((top_data_list[i][which]/1000).toFixed(2))+" million</span></a></div>";
                                        }else{
                                            rightCol = "<div class='cell-right'>" + dollar + "<a href='" + mapLink + "' target='_blank'>"+String((top_data_list[i][which]/1000).toFixed(2))+" million</a></div>";  
                                        }
                                    }else{
                                        if(fips==dataObject.stateshown){
                                            if(params['census_scope']=="state"){
                                                rightCol = "<div class='cell-right'>" + dollar + "<a href='" + mapLink + "' target='_blank'>"+String((top_data_list[i][which_state_api]/1000).toFixed(2))+" million</a></div>";  
                                            }else{
                                                rightCol = "<div class='cell-right'>" + dollar + "<a href='" + mapLink + "' target='_blank'>"+String((top_data_list[i][which_state]/1000).toFixed(2))+" million</a></div>";  
                                            
                                            }
                                        }else{
                                            rightCol = "<div class='cell-right'>" + dollar + "<a href='" + mapLink + "' target='_blank'>"+String((top_data_list[i][which]/1000).toFixed(2))+" million</a></div>";  
                                        
                                        }
                                    }
                                    //}else{
                                    //    rightCol = "<div class='cell'>$" + String((top_data_list[i][whichVal.node().value]/1000000).toFixed(2))+" billion</div>";
                                    //}
                                }
                     
                            } else {

                                //rightCol = String(whichVal.node().options[whichVal.node().selectedIndex].text).slice(3, )+": "+Math.round(top_data_list[i][whichVal.node().value]);
                                if(Array.isArray(fips)){
                                    rightCol=""
                                    midCol=""
                                    for (var j = 0; j<fips.length; j++){
                                        if(top_data_list[i]['ratearray'][j]){

                                            if(params.catsort=="estab"){
                                                midCol += "<div class='cell-right'><a href='" + mapLink[j] + "' target='_blank'>" + String(Math.round(top_data_list[i]['ratearray'][j])) + "</a></div>";
                                                
                                            }else{
                                                if(top_data_list[i]['Estimate'][j]){    
                                                        if(top_data_list[i]['Estimate'][j]>0){
                                                            midCol += "<div class='cell-right'><a href='" + mapLink[j] + "' target='_blank'>" + '<span style="color: #676464" >'+String(Math.round(top_data_list[i]['ratearray'][j])) + "</span></a></div>";
                                                
                                                        }else{
                                                            midCol += "<div class='cell-right'><a href='" + mapLink[j] + "' target='_blank'>" + String(Math.round(top_data_list[i]['ratearray'][j])) + "</a></div>";
                                                
                                                        }
                                                    }else{
                                                        midCol += "<div class='cell-right'><a href='" + mapLink[j] + "' target='_blank'>" + String(Math.round(top_data_list[i]['ratearray'][j])) + "</a></div>";
                                                
                                                    }
                                            }

                                                
                                        } else {
                                                midCol += "<div class='cell-right'>"+"<a href='" + mapLink[j] + "' target='_blank'>"+"0</a></div>";
                                        } 
                                    }
                                    rightCol += "<div class='cell-right'>" + String(Math.round(top_data_list[i][which])) + "</div>";


                                    //rightCol = String(Math.round(top_data_list[i][whichVal.node().value]));
                                }else{
                                    if(params.catsort=="estab"){
                                        if(fips==dataObject.stateshown){
                                            if(params['census_scope']=="state"){
                                                rightCol = "<div class='cell-right'><a href='" + mapLink + "' target='_blank'>" + String(Math.round(top_data_list[i][which_state_api])) + "</a></div>";
                                            }else{
                                                rightCol = "<div class='cell-right'><a href='" + mapLink + "' target='_blank'>" + String(Math.round(top_data_list[i][which_state])) + "</a></div>";
                                            }
                                        }else{
                                            rightCol = "<div class='cell-right'><a href='" + mapLink + "' target='_blank'>" + String(Math.round(top_data_list[i][which])) + "</a></div>";
                                        }
                                    }else{

                                        if(top_data_list[i]['Estimate']){    
                                            if(top_data_list[i]['Estimate']>0){
                                                
                                                rightCol = "<div class='cell-right'><a href='" + mapLink + "' target='_blank'>" +'<span style="color: #676464" >'+ String(Math.round(top_data_list[i][which])) + "</span></a></div>";

                                            }else{
                                                rightCol = "<div class='cell-right'><a href='" + mapLink + "' target='_blank'>" + String(Math.round(top_data_list[i][which])) + "</a></div>";
                                            }
                                        }else{
                                            if(fips==dataObject.stateshown){
                                                if(params['census_scope']=="state"){
                                                    rightCol = "<div class='cell-right'><a href='" + mapLink + "' target='_blank'>" + String(Math.round(top_data_list[i][which_state_api])) + "</a></div>";
                                                }else{
                                                    rightCol = "<div class='cell-right'><a href='" + mapLink + "' target='_blank'>" + String(Math.round(top_data_list[i][which_state])) + "</a></div>";
                                                }
                                            }else{
                                                rightCol = "<div class='cell-right'><a href='" + mapLink + "' target='_blank'>" + String(Math.round(top_data_list[i][which])) + "</a></div>";
                                            }
                                        }
                                    }
                                }
                                
                            }


                            rightCol += "<div class='cell mock-up' style='display:none'><img src='http://localhost:8887/localsite/info/img/plus-minus.gif' class='plus-minus'></div>";
                            //text += top_data_list[i]['NAICScode'] + ": <b>" +top_data_list[i]['data_id']+"</b>, "+String(whichVal.node().options[whichVal.node().selectedIndex].text).slice(3, )+": "+Math.round(top_data_list[i][whichVal.node().value])+"<br>";
                            
                            if(Array.isArray(fips)){
                                text += "<div class='row'><div class='cell'>" + icon + top_data_list[i]['NAICScode'] + "</div><div class='cell'>" + top_data_list[i]['data_id'] +"</div>" + midCol + rightCol + "</div>";
                            }else{
                                text += "<div class='row'><div class='cell'>" + icon + top_data_list[i]['NAICScode'] + "</div><div class='cell'>" + top_data_list[i]['data_id'] + "</div>" + rightCol + "</div>";
                            }
                            
                            // use GoHash()
                            let alertStr = "<p class='mapinfo'>Grey text indicates approximated values. <a href='#go=dataprep'>Learn more</a></p>"
                            $("#econ_list").html("<div id='sector_list'>" + text + "</div><br>" + alertStr);
                            if(i<=20){
                                if(i==0){
                                    naicshash=naicshash+top_data_list[i]['NAICScode']
                                }else{
                                    naicshash=naicshash+","+top_data_list[i]['NAICScode']
                                }
                                
                            }
                        
                        } // End naics rows

                        // Send to USEEIO Widget
                        $('#industry-list').attr('data-naics', naicshash);

                        //updateHash({"naics":naicshash});
                        //params = loadParams(location.search,location.hash);
                        //midFunc(params.x,params.y,params.z,params);
                        })
                })
                d3.csv(dual_map.community_data_root() + "us/id_lists/county_id_list.csv").then( function(consdata) {
                    //document.getElementById("industryheader").text = ""; // Clear initial.
                    $(".location_titles").text(""); //Clear
                    if (params.go == "bioeconomy") {
                        $(".regiontitle").text("Bioeconomy and Fossil Fuel Industries");
                    } else if (params.go == "parts") {
                        $(".regiontitle").text("Automotive Parts Manufacturing");
                    } else if (params.go == "manufacturing") {
                        $(".regiontitle").text("Manufacturing");
                    }
                    if(Array.isArray(fips) && statelength!=fips.length){

                        fipslen=fips.length
                        if (!params.regiontitle) {
                            $(".regiontitle").text("Industries within "+fipslen+" counties");
                        } else if (params.regiontitle) {
                            
                                $(".regiontitle").text(params.regiontitle.replace(/\+/g," "));
                            
                        }
                        for(var i=0; i<fipslen; i++){
                            var filteredData = consdata.filter(function(d) {
                                if(d["id"]==fips[i]){
                                    
                                    /*
                                    if(i==fipslen-1){
                                        document.getElementById("industryheader").innerHTML=document.getElementById("industryheader").innerHTML+'<font size="3">'+d["county"]+'</font>'
                                    }else if(i==0){
                                        document.getElementById("industryheader").innerHTML=document.getElementById("industryheader").innerHTML+'<font size="3">'+d["county"]+', '+'</font>'
                                    }else{
                                    document.getElementById("industryheader").innerHTML=document.getElementById("industryheader").innerHTML+'<font size="3">'+d["county"]+', '+'</font>'
                                    }
                                    */

                                    $(".location_titles").text($(".location_titles").text() + d["county"] + ", ");
                                }
                            })
                        }
                        $(".location_titles").text($(".location_titles").text().replace(/,\s*$/, ""));
                        if (fipslen >= 2 && fipslen <= 3) {
                            $(".regiontitle").text($(".location_titles").text());
                        }

                    }else if(fips==dataObject.stateshown){
                        if (params.go == "bioeconomy") {
                            $(".regiontitle").text("Bioeconomy and Fossil Fuel Industries");
                        } else if (params.go == "parts") {
                            $(".regiontitle").text("Automotive Parts");
                        } else if (params.go == "manufacturing") {
                            $(".regiontitle").text("Manufacturing");
                        } else {
                            $(".regiontitle").text(String(d['Name'])+"'s Top Industries");
                        }
                    }else{

                        var filteredData = consdata.filter(function(d) {
                            if (params.go) {
                                // Remove " County" from this .replace(" County","")
                                $(".regiontitle").text(d["county"] + " - " + params.go.toTitleCase());
                            }
                            else if(d["id"]==fips )
                            {      
                                $(".regiontitle").text(d["county"] + " Industries");
                            }
                        })
                    }
                })
                return top_data_list;
            }
        })
    })
}


function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value)
}


