const mongoose = require('mongoose');

async function connectMongoDB(mongoDBUrl,DbName){
    return mongoose.connect(mongoDBUrl+'/'+DbName).then(()=>{
        console.log('MongoDB Connected Successfully!');
    }).catch((err)=>{
        console.log(`Not connected with error->${err}`);
    });
};

module.exports={
    connectMongoDB,
};
