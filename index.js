const express = require('express')
const app = express()
const router = require('./api/routes')
const bodyParser = require('body-parser')
const cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

router(app);
app.listen("8030" , () => {
    console.log("App started at 8030...")
})