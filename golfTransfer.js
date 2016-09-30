var config = require('./config.js');
var request = require('request');
var fs = require("fs");
var xml2json = require("node-xml2json");

var feedNo = 0;    // so starts with first feed
var tick = 0;
var maxTime = config.timecount;

var myVar = setInterval(function(){ myTimer() },  config.polltime * 1000);

function myTimer() {
    tick++;
    feed = config.feeds[feedNo];
    if (tick == maxTime) {
        console.log(getDateTime());
        tick = 0;
    } else {
        process.stdout.write('.');
    }
    request({
        url: feed.url, //URL to hit
        qs: {from: 'feed example', time: +new Date()}, //Query string data
        method: 'GET', //Specify the method
        headers: { //We can define headers too
            'Content-Type': 'MyContentType',
            'Custom-Header': 'Custom Value'
        }
    }, function(error, response, body){
        // console.log("...returned", error);
        if(error) {
            console.log("Feed err: ", error);
        } else {
            if (response.statusCode !== 200) {
                console.log("Status code: ", response.statusCode);
            } else {
       //         if (!quiet) console.log(body);
              // write to file
                fs.writeFile('c:/golf/rydercup.xml', body, function (err) {
                    if (err) return console.log(err);
                    console.log('Y');
                });
                var jsonObj = xml2json.parser( body );
                fs.writeFile('c:/golf/rydercup.json', JSON.stringify(jsonObj), function (err) {
                    if (err) return console.log(err);
                    console.log('Z');
                });
            }
        }
    });
};


function getDateTime() {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return day + "-" + month + "-" + year + " " + hour + ":" + min + ":" + sec;
}
