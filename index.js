const express=require('express');
const app=express();
const PORT=8000;
const DATABASE_NAME = 'geekcoderr';
const dbURL='mongodb://127.0.0.1:27017'
const userRoute=require('./routes/user');
const {connectMongoDB}=require('./connection');
const {logAppend}=require("./middlewares");
logAppend('requestLogs.txt');
connectMongoDB(dbURL,DATABASE_NAME);

app.use(express.urlencoded({ extended: false }));  // middleware for parsing application/x-www-form
app.use(logAppend('responseLogs.txt'));
console.log('Middleware Bypassed');


app.use('/users',userRoute);

app.listen(PORT,console.log('Server Initiated!'));