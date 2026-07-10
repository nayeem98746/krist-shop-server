// ------------------- all require ------------------
const express = require('express')
const app = express()
const cors = require('cors')
 const dbConnection = require('./db');

const route  = require('./src/routes/routes');
 
require('dotenv').config();

const port = process.env.PORT || 8000
// const port =  8000

// ------------------- all middleware---------------
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
 app.use('/api', route)

app.use(cors())
 //  app.use('/api', route)



// -------------------- db connections -------------
dbConnection()   
// console.log(process.env.dbLink)  
app.get('/', (req, res) => {
  res.send('server is running fine');
});
// ------------------- run part -------------------
app.listen(port , ()=>{
    console.log(`this app is running at ${port}`)
})

 