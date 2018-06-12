/**
 * Tax calculation on the basis of given parameters.
 */

var express = require('express');
var router = express.Router();
var utility = require('./functions')
var config = require('./config/configAa');

router.get('/calculate', taxCalculator);

var taxPerYear, jsonReply = "";
var rebVal = 1;
module.exports = router;

/**
 * Tax calculator API
 * @param {*} req 
 * @param {*} res 
 */
function taxCalculator(req, res) {

    console.log('Tax calculation started..');

    // if (req.body == undefined && req.body.property_type !== undefined && req.body.sub_type !== undefined && req.body.covered_area !== undefined && req.body.tax_year !== undefined) {

    // getTaxValues("specialcategory", "privatehospital", 9680, 8, '', '');
    // getTaxValues("specialcategory", "storagegodown", 3000, '','','');
    // getTaxValues("specialcategory", "marriagepalace", 500, '','','');
    // getTaxValues("specialcategory", "bank", 500, '','','');
    // getTaxValues("specialcategory", "club", 100, '','','');
    // getTaxValues("specialcategory", "pg", 100, '','','');
    // getTaxValues("specialcategory", "privateoffice", 10100, '','','');
    // getTaxValues("specialcategory", "restaurant", 900, '','','');
    // getTaxValues("specialcategory", "cinemahall", 10000, "", "", "standalone");
    // getTaxValues("specialcategory", "hotel", 10000, '', 5, '');
    // getTaxValues("specialcategory", "grainmarket", 10000, '', '', 'booth');

    // getTaxValues("residential", "house", 9680, '', '', '');
    // getTaxValues("commercial", "shop", 200, '', '', '');
    // getTaxValues("institutional", "commercial", 2600, '','','');
    // getTaxValues("industrial", "", 2600, '','','');
    getTaxValues("vacantplot", "residential", 5000  , '','','');
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
function getTaxValues(propertyType, subType, input, bed, star, subSubType) {
    console.log('Getting values ..');
    console.log('Taxation values --> ' + propertyType + " " + subType);

    propertyType = propertyType.toLowerCase();
    subType = subType.toLowerCase();
    subSubType = subSubType.toLowerCase();



    if (propertyType === "residential" || propertyType === "commercial" || propertyType === "institutional") {
        utility.getPriceCategory(propertyType, subType, input, function (price) {
            console.log(propertyType + ' done');
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

        if (config.propertytype[propertyType][subType].min !== undefined && input > config.propertytype[propertyType][subType].min) {
            console.log(propertyType + ' Minimum value satisfied');
            utility.getPriceCategory(propertyType, subType, input, function (price) {
                console.log(propertyType + ' done');
                taxPerYear = price;
            });
        }
        else {
            console.log('Could not calculate the tax as minimum covered area for this property is ' + config.propertytype[propertyType][subType].min);
            taxPerYear = "";
        }
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

    getRebate("stategovernmentbuilding", propertyType,"self_occupied" ,  "", input, function (rebateValue) {
        console.log(rebateValue);
        taxPerYear = (taxPerYear / 100) * rebateValue;
        console.log('After rebate tax calculated is :' + taxPerYear);
    })

}



function getRebate(rebateParam, propertyType,self_occupied, floor, input, callback) {
    var rebParams = config.propertytype['rebate'][rebateParam]['params'];
    console.log(JSON.stringify(rebParams, null, 2));
    if (propertyType == "residential" && rebParams['self_occupied'] == true && rebateParam == "freedomfighters") {

        rebVal = rebParams['value'];
        console.log('sass' + rebVal);
    }
    else if (propertyType == "residential" && rebParams['self_occupied'] == true) {
        console.log('strindsg')
        if (typeof rebParams['area'] == string && input < rebParams['area']) {
            console.log('in if');
            rebVal = rebParams['value'];
        }
    }
    else if (propertyType == "vacantplot" && input >= 4840) {
        console.log('Vacant pot');
        rebVal = 0;
    }
    else {
        rebVal = config.propertytype['rebate'][rebateParam]['params']['value'];
    }
    // console.log(rebVal + " <==");
    callback(rebVal);
}