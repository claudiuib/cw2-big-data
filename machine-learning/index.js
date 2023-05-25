const AWS = require("aws-sdk");
//import plotly layout for each prediction
// const { plotData } = require('plotData');
const { plotData } = require('plotDataCrypto');

let dynamodb = new AWS.DynamoDB({ region: "us-east-1" });
let awsRuntime = new AWS.SageMakerRuntime();

exports.handler = async (event) => {
    let syntheticData = null;

    const fetch = require("node-fetch");

    try {
        //fetch data from websocket api
        const response = await fetch(
            // "https://bmmkl4lj0d.execute-api.us-east-1.amazonaws.com/prod/M00812513"
           
            "https://4ixtv4ohi6.execute-api.us-east-1.amazonaws.com/production/crytoData"
        );

        syntheticData = await response.json();


    } catch (err) {
        console.log("Error fetching synthetic data: ", err);
        return {
            statusCode: 500,
            body: JSON.stringify("Error fetching synthetic data."),
        };
    }
    //last 100 items of original data
    const last100Items = syntheticData.target.slice(-100);
    const lastItemIndex = syntheticData.target.length - 100;
    let startOfLast100Items = syntheticData.start;
    console.log(startOfLast100Items)
    //loop to get start date of last 100 items
    for (let i = 0; i < lastItemIndex; i++) {
        startOfLast100Items = getNextTimeStamp(startOfLast100Items);
    }
    //endpoint parameters
    let endpointData = {
        instances: [
            {
                "start": startOfLast100Items,
                "target": last100Items,
            },
        ],
        configuration: {
            num_samples: 50,
            output_types: ["mean", "quantiles", "samples"],
            quantiles: ["0.1", "0.9"],
        },
    };
    //endpoint parameters
    let params = {
        EndpointName: "CryptoEndpoint",
        Body: JSON.stringify(endpointData),
        ContentType: "application/json",
        Accept: "application/json",
    };

    try {
        const data = await awsRuntime.invokeEndpoint(params).promise();
        let responseData = JSON.parse(
            Buffer.from(data.Body).toString("utf8")
        );
        // console.log(responseData.predictions[0].quantiles["0.1"])
        // console.log(JSON.stringify(responseData));


        // const studentID = "M00812513";//constant for student data prediction
        
        //replace for each CryptoSymbol & cryptoShorts from websocket api
         const cryptoSymbol = "XRP"; 
         const cryptoShortS = "XRP"; 
        const syntheticD = syntheticData.target;

        const predictionM = responseData.predictions[0];


        // ..
        // const plotResult = await plotData(studentID, syntheticD, predictionM);
        // console.log("Plot for student '" + studentID + "' available at: " + plotResult.url);
      
          const plotResult = await plotData(cryptoSymbol, syntheticD, predictionM);
        console.log("Plot for cryptoSymbol '" + cryptoSymbol + "' available at: " + plotResult.url);
        //generate today's date
      const today = new Date().toLocaleDateString() ;
      let dateT = Date.parse(today);
      console.log(dateT)
      
        //dynamoDB paramaters for crypto predictions 
        let dbParams = {
            TableName: "CryptoPrediction",
            Item: {
              
                "CryptoSymbol" :{"S":cryptoShortS },
                "PredictionTS": { "N": dateT.toString() },
                "mean": { "S": JSON.stringify(responseData.predictions[0].mean) },
                "quantiles1": { "S": JSON.stringify(responseData.predictions[0].quantiles["0.1"]) },
                "quantiles9": { "S": JSON.stringify(responseData.predictions[0].quantiles["0.9"]) },
                "samples": { "S": JSON.stringify(responseData.predictions[0].samples) }
            }
        };
//used for student data
        //   let dbParams = {
        //     TableName: "studentPrediction",
        //     Item: {
              
        //     
        //         "PredictionTS": { "N": dateT.toString() },
        //         "mean": { "S": JSON.stringify(responseData.predictions[0].mean) },
        //         "quantiles1": { "S": JSON.stringify(responseData.predictions[0].quantiles["0.1"]) },
        //         "quantiles9": { "S": JSON.stringify(responseData.predictions[0].quantiles["0.9"]) },
        //         "samples": { "S": JSON.stringify(responseData.predictions[0].samples) }
        //     }
        // };



        try {
            //store item to dynamoDB
            await dynamodb.putItem(dbParams).promise();
        } catch (err) {
            console.log("Error putting item in DynamoDB: ", err);
            return {
                statusCode: 500,
                body: JSON.stringify("Error putting item in DynamoDB."),
            };
        }

    } catch (err) {
        console.log(err, err.stack);
        return {
            statusCode: 500,
            body: JSON.stringify("ERROR: " + JSON.stringify(err)),
        };
    }
};

//function to determine the date for  prediction
function getNextTimeStamp(timestamp) {
    const current = new Date(timestamp);
    const next = new Date(current.getTime() + 1000 * 60 * 60 * 24);
    return next.toISOString().slice(0, 19).replace('T', ' ');
}
