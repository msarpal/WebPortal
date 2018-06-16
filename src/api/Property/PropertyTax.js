/**
 * Tax calculation on the basis of given parameters.
 */

var express = require('express');
var router = express.Router();
var utility = require('./functions')
var config = require('./config/configAa');

router.get('/calculate', taxCalculator);

var taxPerYear, jsonReply = "";
var rebVal = 0;
module.exports = router;

/**
 * Tax calculator API
 * @param {*} req 
 * @param {*} res 
 */
function taxCalculator(req, res) {

    console.log('Tax calculation started..');

    // if (req.body == undefined && req.body.property_type !== undefined && req.body.sub_type !== undefined && req.body.covered_area !== undefined && req.body.tax_year !== undefined) {

    // getTaxValues("specialcategory", "privatehospital", 9680, 8, '', '','','');
    // getTaxValues("specialcategory", "storagegodown", 3000, '','','','','');
    // getTaxValues("specialcategory", "marriagepalace", 500, '','','','','');
    // getTaxValues("specialcategory", "bank", 500, '','','','','');
    // getTaxValues("specialcategory", "club", 100, '','','','','');
    // getTaxValues("specialcategory", "pg", 100, '','','','','');
    // getTaxValues("specialcategory", "privateoffice", 10100, '','','','','');
    // getTaxValues("specialcategory", "restaurant", 900, '','','','','');
    // getTaxValues("specialcategory", "cinemahall", 10000, "", "", "standalone",'','');
    // getTaxValues("specialcategory", "hotel", 10000, '', 5, '','','');
    // getTaxValues("specialcategory", "grainmarket", 10000, '', '', 'booth','','');

    getTaxValues("residential", "flat", 200, '', '', '','','');
    // getTaxValues("laldora", "shop", 900, '', '', '', 'parking', 'basement');
    // getTaxValues("commercial", "shop", 900, '', '', '', 'parking','2015' 'basement');

    // getTaxValues("commercial", "commercialspace", 900, '', '', '','rented','');

    // getTaxValues("institutional", "commercial", 2600, '','','','','');
    // getTaxValues("industrial", "", 2600, '','','','','');
    // getTaxValues("vacantplot", "residential", 5000, '', '', '','','');
    // }
    // else {
    //     console.log('Invalid/missing parameters');
    //     res.send('Invalid/missing parameters');
    // }
    res.send('Property tax API');

}

/**
 * Getting tax values per year and total tax till given year.
 * @param {*} propertyType 
 * @param {*} subType 
 * @param {*} input 
 * @param {*} bed 
 * @param {*} star 
 * @param {*} subSubType 
 */
function getTaxValues(propertyType, subType, input, bed, star, subSubType, usage, floor) {

    var constructYear = 2014;

    console.log('Getting values ..');
    console.log('Taxation values --> ' + propertyType + " " + subType);

    propertyType = propertyType.toLowerCase();
    subType = subType.toLowerCase();
    subSubType = subSubType.toLowerCase();

    if (propertyType === "residential" || propertyType === "commercial" || propertyType === "institutional") {

        console.log("subtype " + subType);

        if (propertyType === "commercial") {
            if (input > 1000) {
                subType = "commercialspace";
            }
        }
        console.log("subtype " + subType);
        utility.getPriceCategory(propertyType, subType, input, function (price) {
            console.log(propertyType + ' done');
            if (propertyType === "commercial" && (subType === "shop" || subType === "commercialspace") && floor === "basement" && usage === "parking") {
                console.log('Commercial shop/comm space and parking')
                price = 0;
            }
            if (propertyType === "commercial" && (subType === "shop" || subType === "commercialspace") && usage === "rented") {
                console.log('Commercial shop/comm space and rented')
                price = price * 125;
            }
            taxPerYear = price;
        });
    }
    if (propertyType === "industrial") {
        utility.getPriceCategory(propertyType, "", input, function (price) {
            console.log(propertyType + ' done');
            taxPerYear = price;
        });
    }
    if (propertyType === "vacantplot") {

        // if (config.propertytype[propertyType][subType].min !== undefined && input > config.propertytype[propertyType][subType].min) {
        console.log(propertyType + ' Vacant plot');
        utility.getPriceCategory(propertyType, subType, input, function (price) {
            console.log(propertyType + ' done');
            taxPerYear = price;
        });
        // }
        // else {
        //     console.log('Could not calculate the tax as minimum covered area for this property is ' + config.propertytype[propertyType][subType].min);
        //     taxPerYear = "";
        // }
    }

    if (propertyType === "specialcategory") {
        switch (subType) {
            case "privatehospital":
            case "restaurant":
                console.log('Hospital' + JSON.stringify(config.propertytype[propertyType][subType]['commercial'], null, 2));
                if (config.propertytype[propertyType][subType]['commercial']['status'] !== undefined && config.propertytype[propertyType][subType]['commercial']['status'] == true) {
                    console.log('commercial');
                    utility.getPriceCategory(propertyType, subType, bed, function (price) {
                        utility.getCommercialPrice(input, function (commercialPrice) {
                            console.log('Price of commercial space as pe the given covred area ==> ' + price);
                            console.log('After ' + price + '% of ' + commercialPrice + ' is ==> ' + (price / 100) * commercialPrice);
                            taxPerYear = (price / 100) * commercialPrice;
                        })
                    });
                }
                break;

            case "marriagepalace":
            case "bank":
            case "club":
            case "pg":
            case "petrolpump":
            case "itparkcybercity/park":
            case "privateoffice":
                if (config.propertytype[propertyType][subType]['commercial']['status'] !== undefined && config.propertytype[propertyType][subType]['commercial']['status'] == true) {
                    commercialPrice = config.propertytype[propertyType][subType]['commercial']['value']
                    console.log(propertyType + " " + commercialPrice);
                    utility.getCommercialPrice(input, function (price) {
                        console.log('After ' + commercialPrice + '% of ' + price + ' is ==> ' + (commercialPrice / 100) * price);
                        taxPerYear = (commercialPrice / 100) * price;
                    });
                }
                break;

            case "storagegodown":
                console.log(subType);
                utility.getPriceCategory(propertyType, subType, input, function (price) {
                    console.log(propertyType + ' done');
                    taxPerYear = price;
                });
                break;

            case "cinemahall":
                console.log(config.propertytype[propertyType][subType]['commercial']);
                if (config.propertytype[propertyType][subType]['commercial']['status'] !== undefined && config.propertytype[propertyType][subType]['commercial']['status'] == true) {
                    commercialPrice = config.propertytype[propertyType][subType][subSubType]['value'];
                    utility.getCommercialPrice(input, function (price) {
                        console.log(commercialPrice + '% of ' + price + ' is ==> ' + (commercialPrice / 100) * price);
                        taxPerYear = (commercialPrice / 100) * price;
                    });
                }
                break;

            case "hotel":
                if (config.propertytype[propertyType][subType]['commercial']['status'] == true !== undefined && config.propertytype[propertyType][subType]['commercial']['status'] == true) {
                    utility.getPriceCategory(propertyType, subType, star, function (price) {
                        utility.getCommercialPrice(input, function (commercialPrice) {
                            console.log('Price of commercial space as pe the given covred area ==> ' + price);
                            console.log('After ' + price + '% of ' + commercialPrice + ' is ==> ' + (price / 100) * commercialPrice);
                            taxPerYear = (price / 100) * commercialPrice;
                        })
                    });
                }
                break;
            case "grainmarket":
                if (config.propertytype[propertyType][subType][subSubType]['value'] !== undefined) {
                    console.log('Grain market ' + config.propertytype[propertyType][subType][subSubType]['value']);
                    taxPerYear = config.propertytype[propertyType][subType][subSubType]['value'];
                }
                break;
            default:
                console.log('Sub type not available in backend');
                break;
        }
    }
    if (taxPerYear !== "") {
        console.log('Tax per year is ' + taxPerYear);
        let totalYears = new Date().getFullYear() - '2008';
        if (totalYears > 0) {
            taxPerYear = totalYears * taxPerYear;
            console.log("Total tax ==> " + taxPerYear);

        }

    }
    getRebate("norebate", propertyType, subType, "rent", "ground", input, constructYear, function (rebateValue) {
        console.log(rebateValue);
        taxPerYear = (taxPerYear / 100) * rebateValue;
        console.log('After rebate tax calculated is :' + taxPerYear);
    });
}



function getRebate(rebateParam, propertyType, subType, usage, floor, input, constructYear, callback) {
    var rebParams = config.propertytype['rebate'][rebateParam]['params'];
    console.log(JSON.stringify(rebParams, null, 2));
    if (propertyType == "residential" && rebParams['usage'] == true && rebateParam == "freedomfighters") {

        rebVal = rebParams['value'];
        console.log('residential,self_occupied and freedom fighters' + rebVal);
    }
    else if (propertyType === "residential" && subType === "flat" && input <= 2000) {
        console.log('Residential and flat rebate');
        rebVal = 50;
    }
    else if (propertyType == "residential" && rebParams['self_occupied'] == true) {
        console.log('residential and seff occupied');
        if (typeof rebParams['area'] == string && input < rebParams['area']) {
            console.log('in if');
            rebVal = rebParams['value'];
        }
    }
    else if (propertyType == "vacantplot" && input >= 4840) {
        console.log('Vacant pot');
        rebVal = 0;
    }
    else if (subType === "house" || subType === "shop") {

        console.log('House or flat rebate');
        if (usage === "self_occupied") {
            rebVal = config.propertytype[propertyType][subType]["rebate"]["ground"];
            console.log("resid rebate ==>" + config.propertytype[propertyType][subType]["rebate"][floor]);
        }
        else {
            console.log("Not self_occupied");
            rebVal = 40;
        }
    }
    else if (propertyType === "laldora") {
        if (constructYear < "2010" && constructYear > "2016") {
            rebVal = 0;
        }
    }
    else {
        console.log('Else rebate');
        rebVal = config.propertytype['rebate'][rebateParam]['params']['value'];
    }
    // console.log(rebVal + " <==");
    callback(rebVal);
}