/**
 * Tax calculation on the basis of given parameters.
 */

var express = require('express');
var router = express.Router();
var configA = require('./config');
var utility = require('./functions')

router.get('/calculate', taxCalculator);

module.exports = router;

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */

function taxCalculator(req, res) {

    console.log('Tax calculation started..');

    res.send('done');

    // getTaxValues("specialcategory", "privatehospital", 9680, 70);
    getTaxValues("specialcategory", "storagegodown", 3000, 70);
    // getTaxValues("residential", "house", 9680, 70);
    // getTaxValues("commercial", "shop", 800, 70);
    // getTaxValues("institutional", "commercial", 2600, 70);
    // getTaxValues("industrial", "", 2600, 70);
    // getTaxValues("vacantplot", "residential", 5020, 70);
    
}


function getTaxValues(propertyType, subType, coveredArea, bed) {
    console.log('Getting values ..');
    console.log('Taxation values ' + propertyType);

    if (propertyType === "residential" || propertyType === "commercial" || propertyType === "institutional") {
        utility.getPriceCategory(propertyType, subType, coveredArea, function (price) {
            console.log(propertyType + ' done');
        });
    }
    if (propertyType === "industrial") {
        utility.getPriceCategory(propertyType, "", coveredArea, function (price) {
            console.log(propertyType + ' done');
        });
    }
    if (propertyType === "vacantplot") {

        if (configA.propertytype[propertyType][subType].min !== undefined && coveredArea > configA.propertytype[propertyType][subType].min) {
            console.log(propertyType + ' Minimum value satisfied');
            utility.getPriceCategory(propertyType, subType, coveredArea, function (price) {
                console.log(propertyType + ' done');
            });
        }
        else {
            console.log('Minimum covered area is ' + configA.propertytype[propertyType][subType].min);
        }
    }

    if (propertyType === "specialcategory") {
        switch (subType) {
            case "privatehospital":
                console.log('Hospital' + JSON.stringify(configA.propertytype[propertyType][subType]['commercial'], null, 2));
                if (configA.propertytype[propertyType][subType]['commercial']['status'] == true) {
                    console.log('commercial');
                    utility.getPriceCategory(propertyType, subType, bed, function (price) {
                        utility.getCommercialPrice(coveredArea, function (commercialPrice) {
                            console.log('Price of commercial space as pe the given covred area ==> ' + price);
                            console.log('After ' + commercialPrice + '% of ' + price + ' is ==> ' + (commercialPrice / 100) * price);
                        })
                    });
                }
                break;
            case "cinemahall":
                if (configA.propertytype[propertyType]['commercial']['status'] == true) {
                    console.log('commercial');
                    utility.getPriceCategory(propertyType, subType, "", function (price) {
                        utility.getCommercialPrice(coveredArea, function (commercialPrice) {
                            console.log('Price of commercial space as pe the given covred area ==> ' + price);
                            console.log('After ' + commercialPrice + '% of ' + price + ' is ==> ' + (commercialPrice / 100) * price);
                        })
                    });
                }
                break;
            case "storagegodown":
                console.log(subType);
                utility.getPriceCategory(propertyType, subType, coveredArea, function (price) {
                    console.log(propertyType + ' done');
                });
                break;
            case "hotel":
                console.log(subType)
                break;
            default:
                console.log(subType);
                break;
        }
    }
}

