const mongoose = require("mongoose")
const TeamSchema = require("./TeamsSchema")
const ProjectSchema = require("./ProjectSchema")

const userSchema = new mongoose.Schema({
    "userName": {type:String , unique : true },
    "userId": String,
    "profilepic": {
        type:String,
        default:""
    },
    "userEmail": {
        type:String,
        default:""
    },
    "githubUrl": {
        type:String,
        default:""
    },
    "projects" : [{type : String ,ref:ProjectSchema}],
    "Teams" : [{type : String ,ref:TeamSchema}]
    //"_id":mongoose.isObjectIdOrHexString
    //"teams": [...teamsDetailShort]
})

module.exports = mongoose.model("userSchema",userSchema,"userSchema" )