import Guardian from 'guardian-js';
import dotenv from 'dotenv'
import { DynamoDB } from 'aws-sdk';
dotenv.config();
const AWS = require('aws-sdk');

// import * as dynamoDB from 'aws-sdk/clients/dynamoDB';
const dynamoDB = new AWS.DynamoDB({region: 'us-east-1',
                                   endpoint: "https://dynamodb.us-east-1.amazonaws.com"});


// setup guardian variables for guardian-js
const apiKey = process.env.GUARDIAN_API_KEY; 
const  guardian = new Guardian(apiKey|| '', false);



interface Article {
    id: string;
    webUrl: string;
    webPublicationDate: string;
    webTitle: string;
}
// function that search for articles
const searchArticles = (keyword: string,date:string): Promise<Article[]> => {
    return guardian.content.search(keyword, {
     
        "from-date": date, 
        "page-size": 200,
        "order-by":"oldest",
        "show-tags":keyword
  

    }).then((response) => {
        const articles = response.results;
        return articles;
    }).catch((err) => {
        console.error(err);
    });
}

//function to save data to DynamoDB
const saveToDyanmoDB = (keyword:string,article:{webPublicationDate:string; webTitle:string}) => {
    const date = new Date(article.webPublicationDate);
    dynamoDB.putItem({
        TableName: 'GuardianTextT',
        Item: {
            "CryptoKeyword": {
                S: ""+ keyword
            },
            "CryptoTS": {
                N:""+ date.getTime()
            },
            "CryptoText":{
                S: article.webTitle
            }
         


        }
    }).promise()
        .then((data: any) => console.log(data))
        .then(console.log("Success"))
        .catch((err: any) => console.log(err));
}
// call the function  for Bitcoin and upload to Dynamo from 26-09-21
searchArticles("Bitcoin","2021-03-26").then((articles: { webPublicationDate: string; webTitle: string; }[]) => {
    articles.forEach((article) => {
        // display  the results
        console.log("Article data:"+    article.webPublicationDate)
        console.log("Article title: " + article.webTitle);
        saveToDyanmoDB("Bitcoin",article);
    });
});
// call function for Ethereum coin and save to dynamoDb
searchArticles("Ethereum","2021-03-26").then((articles: { webPublicationDate: string; webTitle: string; }[]) => {
    articles.forEach((article) => {
        // display  the results
        console.log("Article data:"+    article.webPublicationDate)
        console.log("Article title: " + article.webTitle);
        saveToDyanmoDB("Ethereum",article);
    });
});
// call function for Dogecoin coin and save to dynamoDb
searchArticles("Dogecoin","2021-03-26").then((articles: { webPublicationDate: string; webTitle: string; }[]) => {
    articles.forEach((article) => {
        // display  the results
        console.log("Article data:"+    article.webPublicationDate)
        console.log("Article title: " + article.webTitle);
        saveToDyanmoDB("Dogecoin",article);
    });
});
// call function for XRP coin and save to dynamoDb
searchArticles("XRP","2021-03-26").then((articles: { webPublicationDate: string; webTitle: string; }[]) => {
    articles.forEach((article) => {
        // display  the results
        console.log("Article data:"+    article.webPublicationDate)
        console.log("Article title: " + article.webTitle);
        saveToDyanmoDB("XRP",article);
    });
});
// call function for Binance USD coin and save to dynamoDb
searchArticles("Binance USD","2021-09-26").then((articles: { webPublicationDate: string; webTitle: string; }[]) => {
    articles.forEach((article) => {
        // display  the results
        console.log("Article data:"+    article.webPublicationDate)
        console.log("Article title: " + article.webTitle);
        saveToDyanmoDB("Binance USD",article);
    });
});


