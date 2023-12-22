const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    name:{
        type: String,
        required: true,
        trim: true, 
    },
    phoneNum:{
        type:Number,
        unique:true,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
    },
    password: {
        type: String,
        required: true,
    },
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
    }],
    
    
})

module.exports = mongoose.model("User", userSchema);