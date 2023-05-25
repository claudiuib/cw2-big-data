
//open connection
const socket = new WebSocket('wss://17auwpwyv6.execute-api.us-east-1.amazonaws.com/production');

//log connection response
socket.addEventListener('open', event => {
    console.log('WebSocket connection established.');
});

//function display sentiment analysis results data using plotly pie char
function getPieChart() {

    console.log('Received data:', data);
    const cryptoName = document.getElementById('cryptoNameSelect').value;
    if (cryptoName && data.action === 'getData') {
        //filter data by CryptoName
        const filteredData = data.data.filter(d => d.CryptoName === cryptoName)[0];
        if (filteredData) {
            const pieData = [{
                values: [filteredData.SentimentScorePositive, filteredData.SentimentScoreMixed, filteredData.SentimentScoreNegative, filteredData.SentimentScoreNeutral],
                labels: ['Positive', 'Mixed', 'Negative', 'Neutral'],
                type: 'pie'
            }];
            Plotly.newPlot('chartPie', pieData);
        } else {
            console.log(`No data found for ${cryptoName}`);
        }
    }
}
//send message to server
socket.addEventListener('message', event => {
    try {
        data = JSON.parse(event.data);


        getPieChart();
    } catch (error) {
        console.log('Error parsing incoming data:', error);
    }
});
//log errors
socket.addEventListener('error', event => {
    console.log('WebSocket error:', event);
});
//close the connection with server
socket.addEventListener('close', event => {
    console.log('WebSocket connection closed:', event);
});
//send message to server
document.addEventListener('DOMContentLoaded', () => {
    function sendMessage() {
        const message = {
            action: 'getData', //route websocket
            data: 'Items'
        };
        socket.send(JSON.stringify(message));
        console.log('Sent message:', message);
    }

    document.getElementById('cryptoNameSelect').addEventListener('change', sendMessage);
});