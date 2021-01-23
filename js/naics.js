// Default is currently state13 for GA.
// The value after naics is the number of digits in the naics code

//  Sample: Columns from 6_state_all
// id  COUNTY  GEO_TTL NAICS_Sector    NAICS2012_TTL   state   relevant_naics  estab_agg   emp_agg payann_agg  emp_api payann_api  estab_api
// 759 13  999 Statewide   55  Corporate, subsidiary, and regional managing offices    13  551114  1541.3499999999995  110283.20000000004  11605999.4  116336.0    12059746.4  1542.8

let params = loadParams(location.search,location.hash);
let dataObject = {};
let defaultState = "GA";
let stateID = {AL:1,AK:2,AZ:4,AR:5,CA:6,CO:8,CT:9,DE:10,FL:12,GA:13,HI:15,ID:16,IL:17,IN:18,IA:19,KS:20,KY:21,LA:22,ME:23,MD:24,MA:25,MI:26,MN:27,MS:28,MO:29,MT:30,NE:31,NV:32,NH:33,NJ:34,NM:35,NY:36,NC:37,ND:38,OH:39,OK:40,OR:41,PA:42,RI:44,SC:45,SD:46,TN:47,TX:48,UT:49,VT:50,VA:51,WA:53,WV:54,WI:55,WY:56,AS:60,GU:66,MP:69,PR:72,VI:78,}
let stateAbbr;
// To 
function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}
//alert(getKeyByValue(stateID,12));

if (params.geo){
    fip=params.geo.split("US")[1]   
    if(fip.startsWith("0")){
        dataObject.stateshown=params.geo.split("US0")[1]
    }else{
        dataObject.stateshown=params.geo.split("US")[1]
    }
    
}
[fips,dataObject.stateshown]=getStateFips(params)
function getStateFips(params){
    if (params.geo) {
        //if (params.geo.includes(",")) {
            geos=params.geo.split(",")
            fips=[]
            for (var i = 0; i<geos.length; i++){
                fip=geos[i].split("US")[1]
                if(fip.startsWith("0")){
                    fips.push(parseInt(geos[i].split("US0")[1]))
                }else{
                    fips.push(parseInt(geos[i].split("US")[1]))
                }
            }
            st=(geos[0].split("US")[1]).slice(0,2)
            if(st.startsWith("0")){
                dataObject.stateshown=(geos[0].split("US0")[1]).slice(0,1)
            }else{
                if(geos[0].split("US")[1].length==4){
                    dataObject.stateshown=(geos[0].split("US")[1]).slice(0,1)
                }else{
                    dataObject.stateshown=(geos[0].split("US")[1]).slice(0,2)
                }
                
            }
        /* BUG - was loading Westion County from Wyoming when only one county selected.
        } else {
            //alert("split on US")
            fip=params.geo.split("US")[1]
            
            if(fip.startsWith("0")){
                fips=parseInt(params.geo.split("US0")[1])
            }else{
                fips=parseInt(params.geo.split("US")[1])
            }
            st=(params.geo.split("US")[1]).slice(0,2)
            if(st.startsWith("0")){
                    dataObject.stateshown=(params.geo.split("US0")[1]).slice(0,1)
            }else{
                if(params.geo.split("US")[1].length==4){
                    dataObject.stateshown=(params.geo.split("US")[1]).slice(0,1)
                }else{
                    dataObject.stateshown=(params.geo.split("US")[1]).slice(0,2)
                }
            
            }
        }
        */
    } else {
        fips = dataObject.stateshown;
    }
    stuff=[]
    stuff.push(fips)
    stuff.push(dataObject.stateshown)
    return stuff
}

console.log("fips" + fips)
console.log("dataObject.stateshown" + dataObject.stateshown)


function loadIndustryData() {
    console.log("No function " + stateAbbr + " " + dataObject.stateshown + " Promises");

    var promises = [
        d3.csv(dual_map.community_data_root() + "us/id_lists/industry_id_list.csv"),
        d3.tsv(dual_map.community_data_root() + "us/state/" + stateAbbr + "/industries_state"+dataObject.stateshown+"_naics2_all.tsv"),
        //d3.tsv(dual_map.community_data_root() + "data/c3.tsv"),
        d3.tsv(dual_map.community_data_root() + "us/state/" + stateAbbr + "/industries_state"+dataObject.stateshown+"_naics4_all.tsv"),
        //d3.tsv(dual_map.community_data_root() + "data/c5.tsv"),
        d3.tsv(dual_map.community_data_root() + "us/state/" + stateAbbr + "/industries_state"+dataObject.stateshown+"_naics6_all.tsv"),
        d3.csv(dual_map.community_data_root() + "us/id_lists/county_id_list.csv"),
        d3.tsv(dual_map.community_data_root() + "us/state/" + stateAbbr + "/industries_state"+dataObject.stateshown+"_naics2_state_all.tsv"),
        d3.tsv(dual_map.community_data_root() + "us/state/" + stateAbbr + "/industries_state"+dataObject.stateshown+"_naics4_state_all.tsv"),
        d3.tsv(dual_map.community_data_root() + "us/state/" + stateAbbr + "/industries_state"+dataObject.stateshown+"_naics6_state_all.tsv"),
        d3.tsv(dual_map.community_data_root() + "us/state/" + stateAbbr + "/" + stateAbbr + "counties.csv")
    ]
    Promise.all(promises).then(promisesReady);
}

// INIT
let priorHash_naicspage = {};
refreshNaicsWidget();

document.addEventListener('hashChangeEvent', function (elem) {
    let params = loadParams(location.search,location.hash);
    refreshNaicsWidget();                    
 }, false);

function refreshNaicsWidget() {
    let reloadedMap = false;
    //param = loadParams(location.search,location.hash); // param is declared in localsite.js
    //let hash = getHash();
    
    params = loadParams(location.search,location.hash); // Also used by loadIndustryData()

    if (!params.catsort) {
        params.catsort = "payann";
    }
    if (!params.catsize) {
       params.catsize = 6;
    }
    if (!params.census_scope) {
       params.census_scope = 'state';
    }

    // NOTE: params after ? are not included, just the hash.
    if (!params.state || params.state != priorHash_naicspage.state) {
        stateAbbr = params.state || defaultState;
        dataObject.stateshown=stateID[stateAbbr];
        loadIndustryData(); // Occurs on INIT
    }
    priorHash_naicspage = getHash();
}


function promisesReady(values) {
    console.log("promisesReady - promises loaded")
    d3.csv(dual_map.community_data_root() + "us/id_lists/state_fips.csv").then( function(consdata) {
        var filteredData = consdata.filter(function(d) {
            if(d["FIPS"]==String(dataObject.stateshown)) {
                //let params = loadParams(location.search,location.hash);
                let lastParams = {};
                
                let industryData ={}
                subsetKeys = ['emp_reported','emp_est1','emp_est3', 'payann_reported','payann_est1','payann_est3', 'estab', 'NAICS2012_TTL','GEO_TTL','state','COUNTY','relevant_naics','estimate_est1','estimate_est3']
                subsetKeys_state = ['emp_agg', 'payann_agg', 'estab_agg', 'NAICS2012_TTL','GEO_TTL','state','COUNTY','relevant_naics']
                subsetKeys_state_api = ['emp_api', 'payann_api', 'estab_api', 'NAICS2012_TTL','GEO_TTL','state','COUNTY','relevant_naics']
                dataObject.subsetKeys=subsetKeys
                dataObject.subsetKeys_state=subsetKeys_state
                dataObject.subsetKeys_state_api=subsetKeys_state_api
                


                console.log("tttttt" + params.census_scope)
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
                    
                dataObject.industryDataState = industryDataState;

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
                [fips,dataObject.stateshown]=getStateFips(params)


                renderIndustryChart(dataObject,values,params);
                // $(document).ready was here
                

    // No luck
    //$(window).on('locationchange', function() {
    //    alert('The hash has changed!');
    //});
            }
        })
    })

}

$(document).ready(function() {

    // `hashChangeEvent` event reside in multiple widgets. 
    // Called by goHash within localsite.js
    //alert("Add addEventListener"); // Confirms only added once, but why does this occur twice?
    document.addEventListener('hashChangeEvent', function (elem) {
        if (location.host.indexOf('localhost') >= 0) {
            console.log('BUGBUG hashChangeEvent invoked 2 times by info/index.html'); // Invoked twice by iogrid inflow-outflow chart
        }
        console.log("The hash: " + location.hash);
        let params = loadParams(location.search,location.hash);
        console.log("naics.js detects hash change hashChangeEvent");
        if(typeof value == 'undefined') {
            console.log("ALERT value object undefined in naics.js")
        } else {
            renderIndustryChart(dataObject,values,params);
        }

    }, false);
                        
    if (document.getElementById("clearButton")) {
        document.getElementById("clearButton").addEventListener("click", function(){

            // Clears all counties, so reset title:
            let currentState = $("#state_select").find(":selected").text();
            if (currentState) {
                $(".regiontitle").text(currentState + "'s Top Industries");
            } else {
                $(".regiontitle").text("Top Industries");
            }
            refreshNaicsWidget();
            return; 


            // Disabled

            clearHash("geo,regiontitle");

            alert('clearButton');

            // BUGBUG - This causes industry list removal and commodity list reduction.
            // Problem occurred before adding applyIO function and the newer script it contains.
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


/////// Functions /////// 

function renderIndustryChart(dataObject,values,params) {

    stateAbbr = params.state || "GA"; // Previously used +d['Postal Code']+
    dataObject.stateshown=stateID[stateAbbr];

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
    const filteredKeys = ['go','geo','regiontitle','catsort','catsize','catmethod','catpage','catcount','census_scope','naics','state','hs']; // hs not yet implemented for Harmonized System codes
    params = filteredKeys.reduce((obj, key) => ({ ...obj, [key]: params[key] }), {});

    console.log("params used by naics.js:")
    console.log(params)
    // Check which naics params have channged
    let whichHaveChanged = [];
    for (const key in params) {
      //if (watchingHash.includes(${key})) {
      if (params[key] != priorHash_naicspage[key]) {
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
    [fips,dataObject.stateshown]=getStateFips(params)
    console.log("renderIndustryChart calls topRatesInFips with fips: " + fips);
    topRatesInFips(dataObject, dataObject.industryNames, fips, params);
}

//function for when the geo hash changes
function geoChanged(dataObject,params){

    // REMOVE


    return;

    if (!params) {
        params = loadParams(location.search,location.hash); // Pull from updated hash
    }
    [fips,dataObject.stateshown]=getStateFips(params)
    if (fips == dataObject.stateshown) {
        $(".county-view").hide();
        $(".state-view").show();
        //$(".industry_filter_settings").hide(); // temp
    } else {
        $(".state-view").hide();
        $(".county-view").show();
        //$(".industry_filter_settings").show(); // temp
    }
    

    if(dataObject.stateshown!=dataObject.laststateshown){
        //d3.csv(dual_map.community_data_root() + "us/id_lists/state_fips.csv").then( function(consdata) {
        //    var filteredData = consdata.filter(function(d) {
        //        if(d["FIPS"]==String(dataObject.stateshown)) {
            console.log("geoChanged " + stateAbbr + " " + dataObject.stateshown + " Promises");

            var promises = [
            d3.csv(dual_map.community_data_root() + "us/id_lists/industry_id_list.csv"),
            d3.tsv(dual_map.community_data_root() + "us/state/" + stateAbbr + "/industries_state"+dataObject.stateshown+"_naics2_all.tsv"),
            //d3.tsv(dual_map.community_data_root() + "data/c3.tsv"),
            d3.tsv(dual_map.community_data_root() + "us/state/" + stateAbbr + "/industries_state"+dataObject.stateshown+"_naics4_all.tsv"),
            //d3.tsv(dual_map.community_data_root() + "data/c5.tsv"),
            d3.tsv(dual_map.community_data_root() + "us/state/" + stateAbbr + "/industries_state"+dataObject.stateshown+"_naics6_all.tsv"),
            d3.csv(dual_map.community_data_root() + "us/id_lists/county_id_list.csv"),
            d3.tsv(dual_map.community_data_root() + "us/state/" + stateAbbr + "/industries_state"+dataObject.stateshown+"_naics2_state_all.tsv"),
            d3.tsv(dual_map.community_data_root() + "us/state/" + stateAbbr + "/industries_state"+dataObject.stateshown+"_naics4_state_all.tsv"),
            d3.tsv(dual_map.community_data_root() + "us/state/" + stateAbbr + "/industries_state"+dataObject.stateshown+"_naics6_state_all.tsv"),
            d3.tsv(dual_map.community_data_root() + "us/state/" + stateAbbr + "/" + stateAbbr + "counties.csv")
            ]
            Promise.all(promises).then(promisesReady);
        //        }
        //    })
        //})
    }
    console.log("geoChanged calls topRatesInFips with fips: " + fips);
    topRatesInFips(dataObject, dataObject.industryNames, fips, params)
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


function keyFound(this_key, cat_filter, params) {
    if (this_key <= 1) {
        return false;
    } else if (cat_filter.length == 0) { // No filter
        return true;
    } else if (params.go == "bioeconomy" && (this_key.startsWith("11") || this_key.startsWith("311"))) { // Quick hack, always include Agriculture
        return true;
    //} else if (params.go == "farmfresh" && (this_key.startsWith("11") || this_key.startsWith("311"))) { // Quick hack, always include Agriculture
    //    return true;
    } else if (params.go == "manufacturing" && (this_key.startsWith("31") || this_key.startsWith("32") || this_key.startsWith("33") )) { // All manufacturing
        return true;
    } else if ( (params.go == "bioeconomy" || params.go=="parts") && params.catsize == 2) { // Our 4 digit array matches key
        cat_filt=[]
        for(i=0;i<cat_filter.length;i++){
            cat_filt.push(cat_filter[i].slice(0,2))
        }
        if(cat_filt.includes(this_key.slice(0,2))){
            return true;
        }
    } else if ( (params.go == "bioeconomy" || params.go=="parts") && params.catsize == 4 ) { // Our 4 digit array matches key
        cat_filt=[]
        for(i=0;i<cat_filter.length;i++){
            cat_filt.push(cat_filter[i].slice(0,4))
        }
        if(cat_filt.includes(this_key.slice(0,4))){
            return true;
        }
    } else if ( (params.go == "bioeconomy" || params.go=="parts" || cat_filter.length > 0) && params.catsize == 6 && cat_filter.includes(this_key.slice(0,6))) { // Our 6 digit array matches key
        return true;
    } else {
        console.log("NO CAT MATCH FOUND");
        return false;
    }
}

// Top rows of for a specific set of fips (states and counties)
function topRatesInFips(dataSet, dataNames, fips, params) {
    let catcount = params.catcount || 40;
    let gotext = "";
    if (params.go) {
        gotext = params.go.replace(/_/g," ").toTitleCase();
        if (gotext == "Smart") {
            gotext = "EV Ecosystem";
        } else if (gotext == "Ppe") {
            gotext = "Healthcare";
        }
    }

    $("#econ_list").html("");
    console.log("topRatesInFips")
    //alert(String(dataObject.stateshown))
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

                // TO DO: Use hiddenhash.naics here instead
                var cat_filter = getNaics_setHiddenHash(params.go);

                //alert(cat_filter)
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
                top_data_list = [];
                top_data_ids = [];
                naCount = 1;
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

                                        /// ENTIRE STATE
                                        top_data_list.push(
                                            {'data_id': dataNames[id], [which_state_api]: rateInFips, 'emp_api': dataSet.industryDataStateApi.ActualRate[id][fips]['emp_api'], 'estab_api': dataSet.industryDataStateApi.ActualRate[id][fips]['estab_api'], 'NAICScode': naicscode, 'rank': i}
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
                                        {'data_id': dataNames[id], [which]: rateInFips, 'NAICScode': naicscode, 'rank': i,'Estimate':estim}
                                    )
                                    top_data_ids.push(id)
                                }
                            }
                        }
                    }
                }

                console.log(top_data_list);

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
                    d3.csv(dual_map.community_data_root() + "us/state/" + stateAbbr + "/" + stateAbbr + "counties.csv").then( function(latdata) {
                         // TABLE HEADER ROW

                        if(Array.isArray(fips) && statelength != fips.length){

                            for(var i=0; i < fips.length; i++){

                                var filteredData = consdata.filter(function(d) {

                                    if(d["id"]==fips[i]){
                                        if(i == fips.length-1){
                                           text += "<div class='cell-right'>" + d["county"].split("County")[0] + " County</div>";
                                        }else{
                                            text += "<div class='cell-right'>" + d["county"].split(" County")[0] + " County</div>";
                                        }
                                    }
                                })
                            }
                        }
                        text = "<div class='row'><div class='cell'><!-- col 1 -->NAICS</div><div class='cell' style='min-width:300px'><!-- col 2 -->Industry</div>" + text + "<div class='cell-right'>" + totalLabel + "</div>";
                        if (fips == dataObject.stateshown && params.catsort == "payann") {
                            text += "<div class='cell' style='text-align:right'>Employees</div><div class='cell' style='text-align:right'>Firms</div>";
                        }
                        text += "</div>"; // #9933aa
                        
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

                                // Populate maplink with Google Map URL for each industry

                                //d3.csv(dual_map.community_data_root() + "us/id_lists/county_id_list.csv").then( function(consdata) {
                                    if(Array.isArray(fips) && statelength != fips.length) {
                                        mapLink=[]
                                        for(var j=0; j<fips.length; j++){
                                            var filteredData = consdata.filter(function(d) {
                                                var filteredData = latdata.filter(function(e) {
                                                    if(d["id"]==fips[j]){
                                                        if(d["county"]==e["NAMELSAD"]){
                                                            //mapLink.push("https://www.google.com/search?q=" + top_data_list[i]['data_id'].replace(/ /g," + ") + " " + d["county"].replace(/ /g," + ") + ",+Georgia")
                                                            mapLink.push("https://www.google.com/maps/search/" + top_data_list[i]['data_id'].replace(/ /g," + ") + "/@" + e['latitude'] + "," + e['longitude'] + ",11z")
                                                            //mapLink.push("https://bing.com/maps/?q=" + top_data_list[i]['data_id'].replace(/ /g," + ") + "&cp=" + e['latitude'] + "~" + e['longitude'] + "&lvl=11"); // lvl not working
                                                        }
                                                    }
                                                })
                                            })
                                        }
                                    } else if (fips == dataObject.stateshown) {
                                            //county=""
                                            mapLink = "https://www.google.com/maps/search/" + top_data_list[i]['data_id'].replace(/ /g," + ") + "/@32.9406955,-84.5411485,8z"
                                            //mapLink = "https://bing.com/maps/?q=" + top_data_list[i]['data_id'].replace(/ /g," + ") + "&cp=32.94~-84.54&z=8"; // lvl not working
                                    } else {
                                        var filteredData = consdata.filter(function(d) {
                                            var filteredData = latdata.filter(function(e) {
                                                if(d["id"]==fips ){      
                                                    if(d["county"]==e["NAMELSAD"]){
                                                                //mapLink.push("https://www.google.com/search?q=" + top_data_list[i]['data_id'].replace(/ /g," + ") + " " + d["county"].replace(/ /g," + ") + ",+Georgia")
                                                        mapLink = "https://www.google.com/maps/search/" + top_data_list[i]['data_id'].replace(/ /g," + ") + "/@" + e['latitude'] + "," + e['longitude'] + ",11z"
                                                                //console.log("xxxxxxxxx"+e["longitude"])
                                                    }
                                                }
                                            })
                                        })
                                    }
                                //})
                                //let mapLink = "https://www.google.com/maps/search/" + top_data_list[i]['data_id'].replace(/ /g," + ") + "/@" + latitude + "," + longitude + ",11z";


                            if(params.catsort=="payann"){
                                //text += top_data_list[i]['NAICScode'] + ": <b>" +top_data_list[i]['data_id']+"</b>, "+String(whichVal.node().options[whichVal.node().selectedIndex].text).slice(3, )+": $"+String((top_data_list[i][whichVal.node().value]/1000).toFixed(2))+" million <br>";
                                
                                // Multiple counties
                                if(Array.isArray(fips)) {

                                    //if(String((top_data_list[i][whichVal.node().value]/1000).toFixed(2)).length<7){
                                    if (1==1) { // Always use million
                                        
                                        // The counties
                                        for (var j = 0; j < fips.length; j++) {
                                            if(top_data_list[i]['ratearray'][j]){
                                                if(top_data_list[i]['Estimate'][j]){    
                                                    if(top_data_list[i]['Estimate'][j]>0){
                                                        
                                                        midCol += "<div class='cell-right'>" + dollar +"<a href='" + mapLink[j] + "' target='_blank'>"+'<span style="color: #9933aa" >'+ String((top_data_list[i]['ratearray'][j]/1000).toFixed(2)) + " million</span></a></div>";
                                                    }else{
                                                        midCol += "<div class='cell-right'>" + dollar +"<a href='" + mapLink[j] + "' target='_blank'>"+ String((top_data_list[i]['ratearray'][j]/1000).toFixed(2)) + " million</a></div>";
                                                    }
                                                }else{
                                                    midCol += "<div class='cell-right'>" + dollar +"<a href='" + mapLink[j] + "' target='_blank'>"+ String((top_data_list[i]['ratearray'][j]/1000).toFixed(2)) + " million</a></div>";
                                                }
                                            } else {
                                                midCol += "<div class='cell-right'>" + "<a href='" + mapLink[j] + "' target='_blank'>" + "0</a></div>";
                                            }    
                                        }
                                        // The total
                                        rightCol += "<div class='cell-right'>" + dollar + String((top_data_list[i][which]/1000).toFixed(2)) + " million</div>";
                                    }else{
                                        for (var j = 0; j<fips.length; j++){
                                            if(top_data_list[i]['ratearray'][j]){
                                                
                                                    midCol += "<div class='cell-right'>" + dollar + String((top_data_list[i]['ratearray'][j]/1000000).toFixed(2)) + " million</div>";
                                                
                                            }else{
                                                    midCol +="<div class='cell-right'>" + "<a href='" + mapLink[j] + "' target='_blank'>" + "0</a></div>";
                                            }   
                                        }
                                        // <span style="color: #9933aa">
                                        rightCol += "<div class='cell-right'>" + dollar + String((top_data_list[i][which]/1000000).toFixed(2)) + " billion</div>";
                                    }
                                    
                                } else { // One entity (state or county)
                                    //if(String((top_data_list[i][whichVal.node().value]/1000).toFixed(2)).length<7){

                                    if(top_data_list[i]['Estimate']){    
                                        if(top_data_list[i]['Estimate'] > 0){
                                            rightCol = "<div class='cell-right'>" + dollar + "<a href='" + mapLink + "' target='_blank'>"+'<span style="color: #9933aa" >'+String((top_data_list[i][which]/1000).toFixed(2))+" million</span></a></div>";
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

                                        // ADDITIONAL COLUMNS

                                        // employee count
                                        if(fips==dataObject.stateshown){
                                            if(params['census_scope']=="state"){
                                                rightCol += "<div class='cell-right'><a href='" + mapLink + "' target='_blank'>" + String(Math.round(top_data_list[i]["emp_api"])) + "</a></div>";
                                            }else{
                                                //rightCol += "<div class='cell-right'><a href='" + mapLink + "' target='_blank'>" + String(Math.round(top_data_list[i][which_state])) + "</a></div>";
                                            }
                                        }else{
                                            //rightCol += "<div class='cell-right'><a href='" + mapLink + "' target='_blank'>" + String(Math.round(top_data_list[i][which])) + "</a></div>";
                                        }

                                        // establishments
                                        if(fips==dataObject.stateshown){
                                            if(params['census_scope']=="state"){
                                                rightCol += "<div class='cell-right'><a href='" + mapLink + "' target='_blank'>" + String(Math.round(top_data_list[i]["estab_api"])) + "</a></div>";
                                            }else{
                                                //rightCol += "<div class='cell-right'><a href='" + mapLink + "' target='_blank'>" + String(Math.round(top_data_list[i][which_state])) + "</a></div>";
                                            }
                                        }else{
                                            //rightCol += "<div class='cell-right'><a href='" + mapLink + "' target='_blank'>" + String(Math.round(top_data_list[i][which])) + "</a></div>";
                                        }
                                    }
                                }
                     
                            } else {

                                //rightCol = String(whichVal.node().options[whichVal.node().selectedIndex].text).slice(3, )+": "+Math.round(top_data_list[i][whichVal.node().value]);
                                if(Array.isArray(fips)){
                                    rightCol = ""
                                    midCol = ""
                                    for (var j = 0; j<fips.length; j++){
                                        if(top_data_list[i]['ratearray'][j]){

                                            if(params.catsort=="estab"){
                                                midCol += "<div class='cell-right'><a href='" + mapLink[j] + "' target='_blank'>" + String(Math.round(top_data_list[i]['ratearray'][j])) + "</a></div>";
                                                
                                            }else{
                                                if(top_data_list[i]['Estimate'][j]){    
                                                        if(top_data_list[i]['Estimate'][j]>0){
                                                            midCol += "<div class='cell-right'><a href='" + mapLink[j] + "' target='_blank'>" + '<span style="color: #9933aa" >'+String(Math.round(top_data_list[i]['ratearray'][j])) + "</span></a></div>";
                                                
                                                        }else{
                                                            midCol += "<div class='cell-right'><a href='" + mapLink[j] + "' target='_blank'>" + String(Math.round(top_data_list[i]['ratearray'][j])) + "</a></div>";
                                                
                                                        }
                                                    }else{
                                                        midCol += "<div class='cell-right'><a href='" + mapLink[j] + "' target='_blank'>" + String(Math.round(top_data_list[i]['ratearray'][j])) + "</a></div>";
                                                
                                                    }
                                            }

                                                
                                        } else {
                                                midCol += "<div class='cell-right'>" + "<a href='" + mapLink[j] + "' target='_blank'>" + "0</a></div>";
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
                                                
                                                rightCol = "<div class='cell-right'><a href='" + mapLink + "' target='_blank'><span style='color:#9933aa'>" + String(Math.round(top_data_list[i][which])) + "</span></a></div>";

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
                            
                            text += "<div class='row'><div class='cell'><a href='#naics=" + top_data_list[i]['NAICScode'] + "' onClick='goHash({\"naics\":" + top_data_list[i]['NAICScode'] + "}); return false;' style='color:#aaa;white-space:nowrap'>" + icon + top_data_list[i]['NAICScode'] + "</a></div><div class='cell'>" + top_data_list[i]['data_id'].replace("Other ","") +"</div>"
                            if(Array.isArray(fips)) {
                                text +=  midCol; // Columns for counties
                            }
                            text += rightCol + "</div>";
                            
                            // use GoHash()
                            let topMessage = "<p class='mapinfo'><b>Industry Comparison Tools</b> - List does not yet include data for industries without state-level payroll reporting by BEA. <a href='/localsite/info/data/'>Learn&nbsp;more&nbsp;and&nbsp;get&nbsp;involved</a></p>";
                            $("#topMessage").html(topMessage);

                            if(i<=20){
                                if(i==0){
                                    naicshash = naicshash+top_data_list[i]['NAICScode'];
                                }else{
                                    naicshash = naicshash+","+top_data_list[i]['NAICScode']
                                }
                                
                            }
                        
                        } // End naics rows

                        let lowerMessage = "";
                        // If none estimated
                        if (!param.naics) {
                            lowerMessage += "Click NAICS number above to view industry's supply chain. ";
                        }
                        lowerMessage += "Purple&nbsp;text&nbsp;indicates approximated values.";

                        $("#econ_list").html("<div id='sector_list'>" + text + "</div><br><p class='mapinfo'>" + lowerMessage + "</p>");
                        

                        console.log('send naics to #industry-list data-naics attribute: ' + naicshash)

                        // Send to USEEIO Widget
                        //$('#industry-list').attr('data-naics', naicshash);
                        
                        if (!$.trim( $('#iogrid').html() ).length) { // If empty, otherwise triggered by hash change.
                            applyIO(naicshash);
                        }
                        updateMosic(naicshash);

                        //updateHash({"naics":naicshash});
                        //params = loadParams(location.search,location.hash);
                        //midFunc(params.x,params.y,params.z,params);
                        })
                })
                d3.csv(dual_map.community_data_root() + "us/id_lists/county_id_list.csv").then( function(consdata) {
                    //document.getElementById("industryheader").text = ""; // Clear initial.
                    $(".location_titles").text(""); //Clear
                    if (params.go == "bioeconomy") {
                        $(".regiontitle").text("Bioeconomy and Petroleum Industries");
                    } else if (params.go == "parts") {
                        $(".regiontitle").text("Parts Manufacturing");
                    } else if (params.go == "manufacturing") {
                        $(".regiontitle").text("Manufacturing");
                    } else if (params.go == "ppe") {
                        $(".regiontitle").text("Healthcare");
                    } else if (params.go == "vehicles") {
                        $(".regiontitle").text("Vehicle Manufacturing");
                    } else if (gotext) {
                        //$(".regiontitle").text(gotext);
                    }
                    //alert("statelength " + statelength + " fips.length " + fips.length)
                    //if(Array.isArray(fips) && statelength != fips.length) {
                    if(Array.isArray(fips)) {
                        if (!params.regiontitle) {
                            //if (params.go && fips.length == 1) {
                            //    // Remove " County" from this .replace(" County","")
                            //    $(".regiontitle").text(d["county"] + " - " + gotext);
                            //} else 
                            if (params.go) {

                                $(".regiontitle").text(gotext + " Industries within "+ fips.length + " counties");
                            } else {
                                $(".regiontitle").text("Industries within "+ fips.length + " counties");
                            }
                            $(".filterSelected").text(fips.length + " counties");
                            //}
                        } else if (params.regiontitle) {
                            if (params.go) {
                                $(".regiontitle").text(params.regiontitle.replace(/\+/g," ") + " - " + gotext);
                            } else {
                                $(".regiontitle").text(params.regiontitle.replace(/\+/g," "));
                            }
                            $(".filterSelected").text(params.regiontitle.replace(/\+/g," "));
                        }
                        for(var i=0; i < fips.length; i++){
                            var filteredData = consdata.filter(function(d) {
                                if(d["id"]==fips[i]){
                                    
                                    /*
                                    if(i==fips.length-1){
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
                        if (fips.length >= 1 && fips.length <= 3) {
                            if (params.go) {
                                $(".regiontitle").text($(".location_titles").text() + " - " + gotext);
                            } else {
                                $(".regiontitle").text($(".location_titles").text());
                            }
                        }

                    } else if (fips==dataObject.stateshown) {
                        if (params.go == "bioeconomy") {
                            $(".regiontitle").text("Bioeconomy and Petroleum Industries");
                        } else if (params.go == "parts") {
                            $(".regiontitle").text("Parts Manufacturing");
                        } else if (params.go == "manufacturing") {
                            $(".regiontitle").text("Manufacturing");
                        } else if (params.go == "farmfresh") {
                            $(".regiontitle").text("Farm Fresh");
                        } else if (params.go == "ppe") {
                            $(".regiontitle").text("Healthcare Industries");
                        } else if (params.go == "smart") {
                            $(".regiontitle").text("EV Ecosystem");
                        } else if (params.go == "vehicles") {
                            $(".regiontitle").text("Vehicles and Vehicle Parts");
                        } else if (gotext) {
                            $(".regiontitle").text(gotext);
                        } else {
                            // Temp, reactivate after iogrid stops deleteing hash values.
                            $(".regiontitle").text("Industries");
                            //$(".regiontitle").text(String(d['Name'])+"'s Top Industries");
                        }
                        //alert("filterSelected2")
                        $(".filterSelected").text("State"); // Temp
                    } else {

                        var filteredData = consdata.filter(function(d) {
                            if (params.go) {
                                // Remove " County" from this .replace(" County","")
                                $(".regiontitle").text(d["county"] + " - " + gotext);
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
