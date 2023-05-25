import axios from 'axios'

import dotenv from 'dotenv'
dotenv.config();
const AWS = require('aws-sdk');
// import * as dynamoDB from 'aws-sdk/clients/dynamoDB';
const dynamoDB = new AWS.DynamoDB({
    region: 'us-east-1',
    endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});
{
    interface CryptoCompareData {
        [key: string]: {
            [key: string]: {//Data 
                [key: string]: {
                    [key: string]: number; //time,high,low,close

                }
            }
        }
    }

//function to process data
    async function processData(data: CryptoCompareData, currencyCrypto: string, toCurrency: string): Promise<void> {
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

            await dynamoDB.putItem(params, (err: any, data: any) => {
                if (err) {
                    console.log("Error", err);
                } else {
                    console.log("Success", data);
                }
            });

        }
    }



    //Downloads data from CryptoCompare.
    async function downloadData() {
        //Currency symbol
        const currencyCrypto1: string = "BTC";
        const currencyCrypto2: string = "ETH";
        const currencyCrypto3: string = "DOGE";
        const currencyCrypto4: string = "XRP";
        const currencyCrypto5: string = "BUSD";
        //    const currencyCrypto6:string="SHIB";
        const toCurrency: string = "USD"
        //Base url
        let url1: string = "https://min-api.cryptocompare.com/data/v2/histoday?fsym=";
        let url2: string = "https://min-api.cryptocompare.com/data/v2/histoday?fsym=";
        let url3: string = "https://min-api.cryptocompare.com/data/v2/histoday?fsym=";
        let url4: string = "https://min-api.cryptocompare.com/data/v2/histoday?fsym=";
        let url5: string = "https://min-api.cryptocompare.com/data/v2/histoday?fsym=";
        let url6: string = "https://min-api.cryptocompare.com/data/v2/histoday?fsym=";
        url1 += currencyCrypto1 + "&tsym=" + toCurrency + "&limit=510&api_key=" + "{" + process.env.CRYPTOCOMPARE_API_KEY + "}"
        url2 += currencyCrypto2 + "&tsym=" + toCurrency + "&limit=510&api_key=" + "{" + process.env.CRYPTOCOMPARE_API_KEY + "}"
        url3 += currencyCrypto3 + "&tsym=" + toCurrency + "&limit=510&api_key=" + "{" + process.env.CRYPTOCOMPARE_API_KEY + "}"
        url4 += currencyCrypto4 + "&tsym=" + toCurrency + "&limit=510&api_key=" + "{" + process.env.CRYPTOCOMPARE_API_KEY + "}"
        url5 += currencyCrypto5 + "&tsym=" + toCurrency + "&limit=700&api_key=" + "{" + process.env.CRYPTOCOMPARE_API_KEY + "}"
        // url6+= currencyCrypto6+"&tsym="+toCurrency+"&limit=110&api_key=" +"{" +process.env.CRYPTOCOMPARE_API_KEY +"}"
        //display url
        console.log(url1);
        console.log(url2);
        console.log(url3);
        console.log(url4);
        console.log(url5);
        // console.log(url6);//test 
        //Sent GET to endpoint with Axios

        let data1: CryptoCompareData = (await axios.get(url1)).data;
        let data2: CryptoCompareData = (await axios.get(url2)).data;
        let data3: CryptoCompareData = (await axios.get(url3)).data;
        let data4: CryptoCompareData = (await axios.get(url4)).data;
        let data5: CryptoCompareData = (await axios.get(url5)).data;

        let data6: CryptoCompareData = (await axios.get(url6)).data;

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




