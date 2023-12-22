const express=require('express')
const app=express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

require('dotenv').config();
const PORT=process.env.PORT || 4000

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend's origin
    credentials: true,
  }));
app.use(cookieParser());


const dbConnect=require('./config/database');
dbConnect();

const user=require('./routes/user')
app.use('/api/v1',user);

app.listen(PORT,()=>{
    console.log(`app is running at ${PORT}`);
})