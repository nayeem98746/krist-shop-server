const mongoose = require('mongoose')
const dbConnection = ()=>{
    mongoose.connect(process.env.dbLink)
    .then(()=>console.log('db Connected'))
    .catch((err)=>{
        console.log(err)
    })
}

module.exports = dbConnection