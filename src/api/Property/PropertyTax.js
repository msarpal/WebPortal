/**
 * Tax calculation on the basis of given parameters.
 */

var express = require('express');
var router = express.Router();
var utility = require('./functions')

var config = require('./configAa');


router.get('/calculate', taxCalculator);

var taxPerYear = "";
module.exports = router;

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */

function taxCalculator(req, res) {

    console.log('Tax calculation started..');

    res.send('done');

    // getTaxValues("specialcategory", "privatehospital", 9680, '');
    // getTaxValues("specialcategory", "storagegodown", 3000, '');
    // getTaxValues("specialcategory", "marriagepalace", 500, '');
    // getTaxValues("specialcategory", "bank", 500, '');
    // getTaxValues("specialcategory", "club", 100, '');
    // getTaxValues("specialcategory", "pg", 100, '');
    // getTaxValues("specialcategory", "privateoffice", 10100, '');
    // getTaxValues("specialcategory", "restaurant", 900, '');
    // getTaxValues("specialcategory", "cinemahall",  10000 , "standalone");
    getTaxValues("specialcategory", "hotel", 10000, '', 5, '');
    // getTaxValues("specialcategory", "grainmarket", 10000, '', '', 'booth');

    // getTaxValues("residential", "house", 9680, 70);
    // getTaxValues("commercial", "shop", 800, 70);
    // getTaxValues("institutional", "commercial", 2600, 70);
    // getTaxValues("industrial", "", 2600, 70);
    // getTaxValues("vacantplot", "residential", 5020, 70);

}

/**
 * Getting tax per year and total tax till given year
 * @param {*} propertyType 
 * @param {*} subType 
 * @param {*} input 
 * @param {*} bed 
 * @param {*} star 
 * @param {*} subSubType 
 */
function getTaxValues(propertyType, subType, input, bed, star, subSubType) {
    console.log('Getting values ..');
    console.log('Taxation values ' + propertyType);

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

        if (configA.propertytype[propertyType][subType].min !== undefined && input > configA.propertytype[propertyType][subType].min) {
            console.log(propertyType + ' Minimum value satisfied');
            utility.getPriceCategory(propertyType, subType, input, function (price) {
                console.log(propertyType + ' done');
                taxPerYear = price;
            });
        }
        else {
            console.log('Minimum covered area is ' + configA.propertytype[propertyType][subType].min);
        }
    }

    if (propertyType === "specialcategory") {
        switch (subType) {
            case "privatehospital", "restaurant":
                console.log('Hospital' + JSON.stringify(configA.propertytype[propertyType][subType]['commercial'], null, 2));
                if (configA.propertytype[propertyType][subType]['commercial']['status'] !== undefined && configA.propertytype[propertyType][subType]['commercial']['status'] == true) {
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

            case "marriagepalace", "bank", "club", "pg", "privateoffice":
                if (configA.propertytype[propertyType][subType]['commercial']['status'] !== undefined && configA.propertytype[propertyType][subType]['commercial']['status'] == true) {
                    commercialPrice = configA.propertytype[propertyType][subType]['commercial']['value']
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
                console.log(configA.propertytype[propertyType][subType]['commercial']);
                if (configA.propertytype[propertyType][subType]['commercial']['status'] !== undefined && configA.propertytype[propertyType][subType]['commercial']['status'] == true) {
                    commercialPrice = configA.propertytype[propertyType][subType][subSubType]['value'];
                    utility.getCommercialPrice(input, function (price) {
                        console.log(commercialPrice + '% of ' + price + ' is ==> ' + (commercialPrice / 100) * price);
                        taxPerYear = (commercialPrice / 100) * price;
                    });
                }
                break;

            case "hotel":
                if (configA.propertytype[propertyType][subType]['commercial']['status'] == true !== undefined && configA.propertytype[propertyType][subType]['commercial']['status'] == true) {
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
                if (configA.propertytype[propertyType][subType][subSubType]['value'] !== undefined) {
                    console.log('Grain market ' + configA.propertytype[propertyType][subType][subSubType]['value']);
                    taxPerYear = configA.propertytype[propertyType][subType][subSubType]['value'];
                }
                break;
            default:
                console.log('Sub type not available in backend');
                break;
        }
    }
    if (taxPerYear !== "") {
        console.log('Tax per year is ' + taxPerYear);
        let totalYears = new Date().getFullYear() - '2016  ';
        if (totalYears > 0) {
            console.log('Tax till current year ' + totalYears * taxPerYear);
        }
    }
}

