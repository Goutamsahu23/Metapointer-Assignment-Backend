const mongoose=require('mongoose')
require('dotenv').config();

const dbConnect=()=>{
    mongoose.connect(process.env.MONGODB_URL,{
        useUnifiedTopology:true,
        useNewUrlParser:true
    })
    .then(()=>{console.log("db connected successfully.")})
    .catch((err)=>{
        console.log("issue in db connection");
        console.log(err)
        process.exit(1);
    })
}
module.exports= dbConnect;