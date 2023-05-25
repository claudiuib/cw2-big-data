
//open connection to server
const socket = new WebSocket('wss://17auwpwyv6.execute-api.us-east-1.amazonaws.com/production');


socket.addEventListener('open', event => {
    console.log('WebSocket connection established.');
    const message = {
        action: 'updateData',//route websocket
        data: 'crypto' 
    };
    // send message
    socket.send(JSON.stringify(message));
    //log connected response
    console.log('Sent message:', message);
  
});

let data = [];
//function to display data using plotly line chart 
function updateChart() {
    const cryptoSymbol = document.getElementById('cryptoName').value;
 
    //filter data by CryptoSymbol
    const filteredData = data.filter(item => item.CryptoSymbol === cryptoSymbol);
      //convert data from  unix timestamp to MM/DD/YYYY
    const timestamps = filteredData.map(item => new Date(item.CryptoTimeStamp * 1000));
    const closeValues = filteredData.map(item => item.CryptoClose);
    //the mean  from data
    const futurePred = filteredData[filteredData.length - 1].mean.split(",");
    //format mean same as  CryptoClose 
    const formattedFuturePred = futurePred.map(value => `'${value}'`);
    //timestamp for prediction
    const timestampsPred  = filteredData[filteredData.length - 1].PredictionTS
    const timestampsDateP = new Date(timestampsPred * 1000);
  
     const xValuesT1 =  [];
     for(let i=0; i<timestamps.length; ++i){
               xValuesT1.push(i);
          }
    const chartData = {
        x: xValuesT1,
        y: closeValues,
        type: 'line',
        line: {
            color: 'blue',
          },
          name: 'Data colected',
        
    };
    const xValuesT2 = [];
for(let i = timestamps.length-1 ; i < timestamps.length +formattedFuturePred.length; ++i){
  xValuesT2.push(i);
}
  
      const tracePrediction = {
        x: xValuesT2,
        y:formattedFuturePred,
        type: 'scatter',
        mode: 'lines',
        line: {
          color: 'green',
        },
        name: 'Prediction'
      
      };
      const traces = [tracePrediction, chartData];
    
     //Set up graph
     let layout1 = {
        title: `${cryptoSymbol}`,
        xaxis: {
            title: 'Date'
        },
        yaxis: {
            title: 'Close Value'
        }
    };
    let layout2 = {
        title: `${cryptoSymbol}`,
        xaxis: {
            title: 'Date from: '+ `${timestamps[0].toDateString()}`+' to '+`${timestampsDateP.toDateString()}`+' 2023'
        },
        yaxis: {
            title: 'Close Value'
        }
    };

  //plot the graph
    Plotly.newPlot('chart',traces,layout2);
    
}

socket.addEventListener('message', event => {
    try {
        const incomingData = JSON.parse(event.data);
        console.log('Received data:', incomingData);
        data = incomingData.data;
        document.getElementById('cryptoName').value = 'BTC'
        updateChart();
    } catch (error) {
        console.log('Error parsing incoming data:', error);
    }
});
//log errors
socket.addEventListener('error', event => {
    console.log('WebSocket error:', event);
});
//close connection
socket.addEventListener('close', event => {
    console.log('WebSocket connection closed:', event);
});

