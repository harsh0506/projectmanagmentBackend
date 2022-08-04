const mongoose = require("mongoose")
const TeamSchema = require("./TeamsSchema")
const ProjectSchema = require("./ProjectSchema")

const userSchema = new mongoose.Schema({
    "userName": {type:String , unique : true },
    "userid": {type : mongoose.Schema.Types.ObjectId } ,
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
    "projects" : [{type : mongoose.Schema.Types.ObjectId ,ref:ProjectSchema}],
    "Teams" : [{type : mongoose.Schema.Types.ObjectId ,ref:TeamSchema}]
    //"_id":mongoose.isObjectIdOrHexString
    //"teams": [...teamsDetailShort]
})

module.exports = mongoose.model("userSchema",userSchema,"userSchema" )