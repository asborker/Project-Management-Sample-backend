'use strict';
let config = require('../config/config');
let mysql = require('mysql');

let dbConnection = undefined;
let events = {
    error: "error",
    end: "end"
};

function connectToDB() {
    dbConnection = mysql.createConnection({
        host: config.mysql.host,
        user: config.mysql.user,
        password: config.mysql.passcode,
        database: config.mysql.db,
        multipleStatements: true
    });
    dbConnection.connect();
    dbConnection.on(events.error, function (err) {
    });
    dbConnection.on(events.end, function (err) {
        setTimeout(function () {
            connectToDB();
        }, config.mysql.reconnectDelay);
    });
}
(function () {
    connectToDB();
})();

function query(sql, callback) {
    dbConnection.query(sql, function (err, rows, fields) {
        callback(err, rows);
    });
}

function getEscapedString(str) {
    return mysql.escape(str);
}

exports.query = query;
exports.getEscapedString = getEscapedString;