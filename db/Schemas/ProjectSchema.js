const mongoose = require("mongoose")

const Calendar = {
    "event_id": {
        type: String,
        default: ""
    },
    "title": {
        type: String,
        default: ""
    },
    "start": {
        type: String,
        default: new Date()
    },
    "end": {
        type: String,
        default: ""
    },
    "disabled": {
        type: String,
        default: ""
    },
    "color": {
        type: String,
        default: "Blue"
    },
    "editable": {
        type: String,
        default: "true"
    },
    "deletable": {
        type: String,
        default: "true"
    },
    "draggable": {
        type: String,
        default: "false"
    },
    "allDay": {
        type: String,
        default: "true"
    },
}

const documnet = new mongoose.Schema({
    "url": {
        type: String,
        default: ""
    },
    "docName": {
        type: String,
        default: ""
    },
    "tag": {
        type: String,
        default: ""
    },
    "adderId": {
        type: String,
        default: ""
    },
    "date": {
        type: String,
        default: ""
    }
})

const tasklist = new mongoose.Schema(
    {
        "taskName": {
            type: String,
            default: ""
        },
        "priority": {
            type: String,
            default: ""
        },
        "userId": {
            type: String,
            default: ""
        },
        "userName": {
            type: String,
            default: ""
        },
        "SubmissionDate": {
            type: String,
            default: ""
        },
        "progress": {
            type: String,
            default: "0%"
        },
        "dateOfCreation": {
            type: String,
            default: ""
        },
        "taskId": {
            type: String,
            default: ''
        },
        "dateOfActualSubmission":{
            type:String,
            default:""
        }
    }
)

const ProjectSchema = new mongoose.Schema(
    {
        "userId": {
            type: String,
            default: ""
        },
        "teamId": {
            type: String,
            default: ""
        },
        "priority": {
            type: String,
            default: ""
        },
        "projectId": {
            type: String,
            default: ""
        },
        "dateOfCreation": {
            type: String,
            default: ""
        },
        "teamAdminId": {
            type: String,
            default: ""
        },
        "Documents": [documnet],
        "projectName": {
            type: String,
            default: ""
        },
        "SubmissionDate": {
            type: String,
            default: ""
        },
        "personal": {
            type: Boolean,
            default: true
        },
        "TaskList": [tasklist],
        "calendar": [Calendar],
        "activity": {
            type: Object,
            default: {}
        }
    }
)

module.exports = mongoose.model("ProjectSchema", ProjectSchema, "ProjectSchema")