'use strict';
const dbConnection = require('../db/db');

class Utility {

    constructor() { }

    checkObjectPrototype(keys, obj) {
        let validPrototype = true;
        keys.forEach(function (key, value) {
            if (!obj.hasOwnProperty(key)) {
                validPrototype = false;
            }
        })
        return validPrototype
    }

    escapeStringUtil(obj) {
        for(let key in obj) {
            obj[key] = dbConnection.getEscapedString(obj[key]);
        }
        return obj
    }
}

module.exports = new Utility();
