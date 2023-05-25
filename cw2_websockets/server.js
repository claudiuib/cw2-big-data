
const  express = require('express')


const app = express();
//Start the app listening on port 8080
app.listen(3030,()=>{
    console.log('server is running');
})
app.use(express.static('public'));
//Status codes defined in external file
require('./http_status.js');