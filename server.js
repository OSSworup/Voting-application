const express=require('express');
const app=express();
require('dotenv').config();

const db=require('./db');

const bodyParser=require('body-parser');
app.use(bodyParser.json());
const PORT=process.env.PORT||3000;

const userRoute=require('./routes/userRoute');
const candidateRoute=require('./routes/candidateRoute');

app.use('/candidate',candidateRoute);
app.use('/user',userRoute);

app.listen(PORT,()=>{
    console.log('listening on port 3000');
});

