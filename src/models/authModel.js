const mongoose = require('mongoose')

const authSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true
    },
     email : {
        type: String,
        required: true
    },
     password : {
        type: String,
        required: true
    },

    userRole :{
        type: String,
        default:'user',
        enum: ['user' ,'admin' , 'staff']
    }
} , {timestamps: true}

)

module.exports = mongoose.model('User' , authSchema )