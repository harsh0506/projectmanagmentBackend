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
    "dateOfCreation": {
        type: String,
        default: ""
    },
    "teamMembers": {
        type:[String],
        validate: {
            validator: (arr) => arr.length <= 3,
            message: () => 'TeamMembers array cannot have more than 3 elements'
          }
    },
    "inviteCode": {
        type:String,
        default:null
    },
    "status": {
        type: String,
        default: "assigned"
    },
    "projectList": [{type:String , ref : ProjectSchema }]
})



module.exports = mongoose.model("TeamSchema",TeamSchema  )