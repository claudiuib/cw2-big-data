# cw2-big-data
# Project Description
Crypto Spy is a data visualisation website for crypto coins that provides an interactive
display of the price history, the actual price and different predictions related to the
cryptocurrency market. The graphic representations of the website allow users to 
explore the price of the coins for a specific date or time. In addition, some predictions
about the coin value are displayed and will help the user identify trends in the 
cryptocurrency market. The website also contains a feature that shows the sentiment 
analyses of the data displayed over time, allowing the user to understand the 
relationship between public sentiment and cryptocurrency prices.
The predictions displayed on the website are generated using data collected through 
APIs, trained with cloud machine learning provided by AWS SageMaker and shown in 
graphical pictures with Plotly software. In this case, the data is collected from 
CrymptoCompare APIs using Axios and uploaded to the AWS DynamoDB table
named Cryptocurrency. The data from the database table is processed with the 
Lambda Aws function in the correct format for the AWS Sagemaker. Therefore 
synthetic data is trained with Aws Deep AR built-in algorithm – Times Series Forecast. 
The results from the training job will be mean, quantiles 0_1, quantiles 0_9, and 
samples. After that, the AWS lambda function will pin the endpoint and APi synthetic 
data link and will save the predictions in the Plotly Line Graph.
![crypto_project](https://github.com/claudiuib/cw2-big-data/assets/95749647/845ab803-f3b3-4a20-ad4c-289af52b7965)
![crypto_predictions](https://github.com/claudiuib/cw2-big-data/assets/95749647/8654c7fb-9941-4807-89e6-9245e75707e4)
