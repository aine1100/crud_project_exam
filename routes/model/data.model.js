const mongoose=require("mongoose")
const Schema=     new mongoose.Schema({
    title:{
     type:String,
     required:true   
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:String,
        required:true
    }
})
const Tasks= new mongoose.model("Task",Schema)
module.exports= Tasks