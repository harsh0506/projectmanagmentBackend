const mongoose = require("mongoose")


const documnet = new mongoose.Schema({
    "url": {
        type:String,
        default:""
    },
    "docName": {
        type:String,
        default:""
    },
    "tag": {
        type:String,
        default:""
    },
    "Adder_id": {
        type:Number,
        default:""
    },
    "date": {
        type:Date,
        default:""
    }
})

const tasklist = new mongoose.Schema(
    {
        "taskName":  {
            type:String,
            default:""
        },
        "userId":  {
            type:String,
            default:""
        },
        "userName" : {
            type:String,
            default:""
        },
        "SubmissionDate": {
            type:Date,
            default:""
        },
        "progress":{
            type:String,
            default:"0%"
        }
    }
)

const ProjectSchema = new mongoose.Schema(
    {
        "userId": {
            type:mongoose.Schema.Types.ObjectId,
            default:""
        },
        "teamId": {
            type:String,
            default:""
        },
        "projectId": {
            type:String,
            default:""
        },
        "teamAdminId": {
            type:String,
            default:""
        },
        "Documents": [documnet],
        "projectName": {
            type:String,
            default:""
        },
        "SubmissionDate": {
            type:Date,
            default:""
        },
        "personal": {
            type:Boolean,
            default:true
        },
        "TaskList": [tasklist],
        "calendar":{
            type:Array,
            default:[]
        },
        "activity":{
            type:Object,
            default:{}
        }
    }
)

module.exports = mongoose.model("ProjectSchema" , ProjectSchema , "ProjectSchema" )