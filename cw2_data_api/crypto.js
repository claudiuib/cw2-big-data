"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const AWS = require('aws-sdk');
// import * as dynamoDB from 'aws-sdk/clients/dynamoDB';
const dynamoDB = new AWS.DynamoDB({
    region: 'us-east-1',
    endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});
{
    //function to process data
    async function processData(data, currencyCrypto, toCurrency) {
        for (let dt in data['Data']['Data']) {
            //Get date to unix timestamp
            const date = new Date(data['Data']['Data'][dt]['time'] * 1000);
            console.log("DATE: " + date + "; UNIX TS: " + data['Data']['Data'][dt]['time']);
            console.log("Crypto Currency: " + currencyCrypto + " to currency: " + toCurrency);
            console.log("high: " + data['Data']['Data'][dt]['high']);
            console.log("low: " + data['Data']['Data'][dt]['low']);
            console.log("close: " + data['Data']['Data'][dt]['close']);
            //add data to DynamoDB    
            const params = {
                TableName: 'CryptoCurrency',
                Item: {
                    'CryptoSymbol': { S: currencyCrypto },
                    'CryptoTimeStamp': { N: "" + data['Data']['Data'][dt]['time'] },
                    'CryptoHigh': { S: "" + data['Data']['Data'][dt]['high'] },
                    'CryptoLow': { S: "" + data['Data']['Data'][dt]['low'] },
                    'CryptoClose': { S: "" + data['Data']['Data'][dt]['close'] }
                }
            };
            await dynamoDB.putItem(params, (err, data) => {
                if (err) {
                    console.log("Error", err);
                }
                else {
                    console.log("Success", data);
                }
            });
        }
    }
    //Downloads data from CryptoCompare.
    async function downloadData() {
        //Currency symbol
        const currencyCrypto1 = "BTC";
        const currencyCrypto2 = "ETH";
        const currencyCrypto3 = "DOGE";
        const currencyCrypto4 = "XRP";
        const currencyCrypto5 = "BUSD";
        //    const currencyCrypto6:string="SHIB";
        const toCurrency = "USD";
        //Base url
        let url1 = "https://min-api.cryptocompare.com/data/v2/histoday?fsym=";
        let url2 = "https://min-api.cryptocompare.com/data/v2/histoday?fsym=";
        let url3 = "https://min-api.cryptocompare.com/data/v2/histoday?fsym=";
        let url4 = "https://min-api.cryptocompare.com/data/v2/histoday?fsym=";
        let url5 = "https://min-api.cryptocompare.com/data/v2/histoday?fsym=";
        let url6 = "https://min-api.cryptocompare.com/data/v2/histoday?fsym=";
        url1 += currencyCrypto1 + "&tsym=" + toCurrency + "&limit=510&api_key=" + "{" + process.env.CRYPTOCOMPARE_API_KEY + "}";
        url2 += currencyCrypto2 + "&tsym=" + toCurrency + "&limit=510&api_key=" + "{" + process.env.CRYPTOCOMPARE_API_KEY + "}";
        url3 += currencyCrypto3 + "&tsym=" + toCurrency + "&limit=510&api_key=" + "{" + process.env.CRYPTOCOMPARE_API_KEY + "}";
        url4 += currencyCrypto4 + "&tsym=" + toCurrency + "&limit=510&api_key=" + "{" + process.env.CRYPTOCOMPARE_API_KEY + "}";
        url5 += currencyCrypto5 + "&tsym=" + toCurrency + "&limit=700&api_key=" + "{" + process.env.CRYPTOCOMPARE_API_KEY + "}";
        // url6+= currencyCrypto6+"&tsym="+toCurrency+"&limit=110&api_key=" +"{" +process.env.CRYPTOCOMPARE_API_KEY +"}"
        //display url
        console.log(url1);
        console.log(url2);
        console.log(url3);
        console.log(url4);
        console.log(url5);
        // console.log(url6);//test 
        //Sent GET to endpoint with Axios
        let data1 = (await axios_1.default.get(url1)).data;
        let data2 = (await axios_1.default.get(url2)).data;
        let data3 = (await axios_1.default.get(url3)).data;
        let data4 = (await axios_1.default.get(url4)).data;
        let data5 = (await axios_1.default.get(url5)).data;
        let data6 = (await axios_1.default.get(url6)).data;
        //process the data
        processData(data1, currencyCrypto1, toCurrency);
        processData(data2, currencyCrypto2, toCurrency);
        processData(data3, currencyCrypto3, toCurrency);
        processData(data4, currencyCrypto4, toCurrency);
        processData(data5, currencyCrypto5, toCurrency);
        // processData(data6, currencyCrypto6,toCurrency);//test
    }
    downloadData();
}
