const mongoose = require('mongoose');

const connectDB = () =>{
    mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log('connect mongoose successfully');
    });
}

module.exports = {
    connectDB
}