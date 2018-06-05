/**
 * Tax calculation on the basis of given parameters.
 */

var express = require('express');
var router = express.Router();
var configA = require('./config');

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
    getTaxValues("Residential", "House", "300");
}


function getTaxValues(propertyType, subType, coveredArea) {
    console.log('get values started ..');

    console.log('params ' + propertyType + " " + subType + " " + coveredArea);
    // console.log(JSON.stringify(configA.PropertType[propertyType][subType].range.length));
    let range = configA.PropertType[propertyType][subType].range;
    // var keys = Object.values(range);
    // console.log(keys);
    for(var index = 0 ; index < range.length ; index++){
        // var keys = Object.keys(range[index]);
        // var values = Object.values(range[index]);
        // console.log(values);
        // console.log( range[index][keys]);
        // console.log( range[index][values]);
        // console.log(range[index].category);
        // console.log(range[index].value);
// console.log(range[index].category);
        if(coveredArea < range[index].value && coveredArea > range[index-1].value){
            console.log('HI');
            var category  = range[index].category;
            console.log(category);
            process.exit();
        }
    }
    // console.log(category);
}