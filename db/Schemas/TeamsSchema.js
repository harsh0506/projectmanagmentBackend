const mongoose = require("mongoose")
const ProjectSchema = require("./ProjectSchema")
const userSchema = require("./UserSchema")
const projectList = new mongoose.Schema(
    {
        'projectName': String,
        'projectId': Number
    }
)

const teamMember = new mongoose.Schema({
    userName:{
        type:String,
        default : ""
    },
    userId:{
        type:String,
        default:null
    },
    userEmail:{
        type:String,
        default:""
    }
})

const TeamSchema =  mongoose.Schema({
    "teamName": {
        type:String,
        default:""
    },
    "teamid": {
        type:String,
        default:""
    },
    "teamAdminID": {
        type:String,
        default:""
    },
    "userName": {
        type:String,
        default:""
    },
    "teamMembers": [{type:mongoose.Schema.Types.ObjectId , ref : userSchema }],
    "inviteCode": {
        type:Number,
        default:null
    },
    "projectList": [{type:String , ref : ProjectSchema }]
})



module.exports = mongoose.model("TeamSchema",TeamSchema  )