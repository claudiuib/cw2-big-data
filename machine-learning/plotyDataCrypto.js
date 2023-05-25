const PLOTLY_USERNAME = 'cb1465';
const PLOTLY_KEY = '*******';
let plotly = require('plotly')(PLOTLY_USERNAME, PLOTLY_KEY);

async function plotData(cryptoSymbol,  syntheticD,predictionM) {
  const prediction =predictionM.mean
  const xValuesT1 =  [];
   for(let i=0; i<syntheticD.length; ++i){
             xValuesT1.push(i);
        }
const traceSynthetic = {
  x: xValuesT1,
  y: syntheticD,
  type: 'scatter',
  mode: 'lines',
  line: {
    color: 'red',
  },
  name: 'Original Data',
};
const xValuesT2 = [];
for(let i = syntheticD.length-1 ; i < syntheticD.length + prediction.length; ++i){
  xValuesT2.push(i);
}
const tracePrediction = {
  x: xValuesT2,
  y: prediction,
  type: 'scatter',
  mode: 'lines',
  line: {
    color: 'green',
  },
  name: 'Prediction(Mean)',
};

const traces = [tracePrediction, traceSynthetic];

const layout = {
//   title: 'Synthetic Data and Prediction for Student ' +cryptoSymbol,
   title: 'Synthetic Data and Prediction for Crypto ' +cryptoSymbol,
  font: {
    size: 25,
  },
  xaxis: {
    title: 'Time (hours)',
  },
  yaxis: {
    title: 'Value(Close)',
  },
};

const graphOptions = {
  
  layout: layout,
  filename: 'date-axes',
  fileopt: 'overwrite',
};

  return new Promise((resolve, reject) => {
    plotly.plot(traces, graphOptions, function (err, msg) {
      if (err) reject(err);
      else {
        resolve(msg);
      }
    });
  });
}

module.exports = { plotData };
