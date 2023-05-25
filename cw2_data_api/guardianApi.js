"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const guardian_js_1 = __importDefault(require("guardian-js"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const AWS = require('aws-sdk');
// import * as dynamoDB from 'aws-sdk/clients/dynamoDB';
const dynamoDB = new AWS.DynamoDB({ region: 'us-east-1',
    endpoint: "https://dynamodb.us-east-1.amazonaws.com" });
// setup guardian variables for guardian-js
const apiKey = process.env.GUARDIAN_API_KEY;
const guardian = new guardian_js_1.default(apiKey || '', false);
// function that search for articles
const searchArticles = (keyword, date) => {
    return guardian.content.search(keyword, {
        "from-date": date,
        "page-size": 200,
        "order-by": "oldest",
        "show-tags": keyword
    }).then((response) => {
        const articles = response.results;
        return articles;
    }).catch((err) => {
        console.error(err);
    });
};
//function to save data to DynamoDB
const saveToDyanmoDB = (keyword, article) => {
    const date = new Date(article.webPublicationDate);
    dynamoDB.putItem({
        TableName: 'GuardianTextT',
        Item: {
            "CryptoKeyword": {
                S: "" + keyword
            },
            "CryptoTS": {
                N: "" + date.getTime()
            },
            "CryptoText": {
                S: article.webTitle
            }
        }
    }).promise()
        .then((data) => console.log(data))
        .then(console.log("Success"))
        .catch((err) => console.log(err));
};
// call the function  for Bitcoin and upload to Dynamo from 26-09-21
searchArticles("Bitcoin", "2021-03-26").then((articles) => {
    articles.forEach((article) => {
        // display  the results
        console.log("Article data:" + article.webPublicationDate);
        console.log("Article title: " + article.webTitle);
        saveToDyanmoDB("Bitcoin", article);
    });
});
// call function for Ethereum coin and save to dynamoDb
searchArticles("Ethereum", "2021-03-26").then((articles) => {
    articles.forEach((article) => {
        // display  the results
        console.log("Article data:" + article.webPublicationDate);
        console.log("Article title: " + article.webTitle);
        saveToDyanmoDB("Ethereum", article);
    });
});
// call function for Dogecoin coin and save to dynamoDb
searchArticles("Dogecoin", "2021-03-26").then((articles) => {
    articles.forEach((article) => {
        // display  the results
        console.log("Article data:" + article.webPublicationDate);
        console.log("Article title: " + article.webTitle);
        saveToDyanmoDB("Dogecoin", article);
    });
});
// call function for XRP coin and save to dynamoDb
searchArticles("XRP", "2021-03-26").then((articles) => {
    articles.forEach((article) => {
        // display  the results
        console.log("Article data:" + article.webPublicationDate);
        console.log("Article title: " + article.webTitle);
        saveToDyanmoDB("XRP", article);
    });
});
// call function for Binance USD coin and save to dynamoDb
searchArticles("Binance USD", "2021-09-26").then((articles) => {
    articles.forEach((article) => {
        // display  the results
        console.log("Article data:" + article.webPublicationDate);
        console.log("Article title: " + article.webTitle);
        saveToDyanmoDB("Binance USD", article);
    });
});
