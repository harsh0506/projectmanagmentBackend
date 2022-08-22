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
    "adderId": {
        type:String,
        default:""
    },
    "date": {
        type:String,
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
        },
        "dateOfCreation":{
            type:String,
            default:""
        },
        "taskId":{
            type:String,
            default:''
        }
    }
)

const ProjectSchema = new mongoose.Schema(
    {
        "userId": {
            type:String,
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
            type:Object,
            default:{}
        },
        "activity":{
            type:Object,
            default:{}
        }
    }
)

module.exports = mongoose.model("ProjectSchema" , ProjectSchema , "ProjectSchema" )