const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/List").then(()=>{
	console.log("Server is connected to MongoDb")
}).catch(e=>{
	console.log("Connection Failed: ",e);
})