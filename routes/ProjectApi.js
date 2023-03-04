const express = require("express");
const router = express.Router()

const myfunc = require("../controllers/Controller")

const ProjectSchema = require("../db/Schemas/ProjectSchema");
const TeamsSchema = require("../db/Schemas/TeamsSchema");
const userSchema = require("../db/Schemas/UserSchema");

/*
1 ==> function to get all the projects regardless of team id or project id or any other metadata
2 ==> this function returns arrray of objects which are in ProjectsSchema collection
3 ==> it takes no parameters
4 ==> url for the function is "http://localhost:8000/projects"
*/
router.get("/", (req, res) => myfunc.getallData(req, res, ProjectSchema))

/* 
1 ==> function / endpoint to get data of given id
2 ==> function returns only one object
3 ==> takes id
4 ==> url for the function is "http://localhost:8000/projects/<id>" example "http://localhost:8000/projects/62d3aa21f4bdddd0ea6504b9"
*/

router.get("/:id", async (req, res) => myfunc.getById(req, res, ProjectSchema, "ProjectSchema"))

router.get("/SingleProject/:id", async (req, res) => {
    try {
        res.json(await ProjectSchema.find({ "_id": req.params.id }))
    } catch (err) { console.log(err) }
})

router.get("/projectId/:id", async (req, res) => {
    res.json(await ProjectSchema.find({ _id: req.params.id }))
})

router.get("/DashBoard/:id", async (req, res) => {
    try {
        const date = new Date()
        let color = "";
        let OnGoingEvents = [], statusCount = [], HighPrioityTask = [], TaskCloseToSubmission = [];
        let did = 0, count_of_dateOfActualSubmissionw_when_its_emptyString = 0;
        let PieChartData = { "completed": 0 }, No_of_Completed_events = { completed: 0 };


        const data = await ProjectSchema.find({ "_id": req.params.id })
        const { _id, projectId, SubmissionDate, personal, TaskList, calendar, priority, projectName } = data[0]

        let remainingDays = Math.round((new Date(SubmissionDate).getTime() - date.getTime()) / (1000 * 3600 * 24)) + 1

        if (priority.toLowerCase() === "high") {
            color = "red"
        } else if (priority.toLowerCase() === "medium") {
            color = "orange"
        } else if (priority.toLowerCase() === "low") {
            color = "yellow"
        } else {
            color = "grey"
        }


        TaskList.forEach(obj => {
            if (obj.priority.toLowerCase() === "high") { HighPrioityTask.push(obj) }

            statusCount.push(obj.Status)

            if (obj.dateOfActualSubmission === '') {
                count_of_dateOfActualSubmissionw_when_its_emptyString += 1
                return;
            }

            const diffInDays = (obj.dateOfActualSubmission - obj.SubmissionDate) / (1000 * 60 * 60 * 24);

            did += diffInDays
        });

        calendar.forEach(element => {
            element.start = new Date(
                new Date(element.start).getFullYear(),
                new Date(element.start).getMonth(),
                new Date(element.start).getDate(),
                new Date(element.start).getHours(),
                new Date(element.start).getMinutes(),
                new Date(element.start).getSeconds())
            element.end = new Date(
                new Date(element.end).getFullYear(),
                new Date(element.end).getMonth(),
                new Date(element.end).getDate(),
                new Date(element.end).getHours(),
                new Date(element.end).getMinutes(),
                new Date(element.end).getSeconds()
            )
            if (new Date(element.end) >= new Date()) { OnGoingEvents.push(element) }
        })

        const data1 = TaskList.map(task => ({
            x: task.dateOfActualSubmission === '' ? "" : new Date(task.dateOfActualSubmission),
            y: task.dateOfActualSubmission === '' ? "" : new Date(task.dateOfActualSubmission)
        }));
        const data2 = TaskList.map(task => ({
            x: task.dateOfActualSubmission === "" ? "" : new Date(task.dateOfActualSubmission),
            y: task.SubmissionDate === "" ? "" : new Date(task.SubmissionDate)
        }));

        OnGoingEvents.sort((a, b) => new Date(a.end) - new Date(b.end))

        for (let i = 0; i < statusCount.length; i++) {
            const word = statusCount[i];
            PieChartData[word] = PieChartData[word] ? PieChartData[word] + 1 : 1;
        }

        TaskList.forEach(element => { if (element.Status.toLowerCase() === "completed") { No_of_Completed_events.completed++; } })

        TaskCloseToSubmission = TaskList
            .filter(item => new Date(item.SubmissionDate) >= date)
            .sort((a, b) => new Date(a.SubmissionDate - new Date(b.SubmissionDate))
            )

        res.json({
            remainingDays, color, No_of_Completed_events, calendar, OnGoingEvents, PieChartData, data1, data2,
            HighPrioityTask, TaskCloseToSubmission, priority, projectName, projectId, _id, SubmissionDate,
            PredictionData: count_of_dateOfActualSubmissionw_when_its_emptyString === TaskList.length ? "no task are compllted" : did
        })

    } catch (error) {
        res.json(error)
    }
})

router.get("/Tasks/:Pid", async (req, res) => {
    try {
        let color = "";
        let tm = []
        const data = await ProjectSchema.find({ "_id": req.params.Pid })
        const { _id, projectId, priority, projectName, teamAdminId, teamId, TaskList, SubmissionDate, personal } = data[0]
        if (teamId === "" || teamId === undefined || teamId === " ") {
            res.json({ _id, projectId, priority, projectName, teamAdminId, teamId, TaskList, SubmissionDate, tm })
        }
        else {
            const m = await TeamsSchema.find({ "_id": teamId })
            if (m[0].teamMembers.length === 0) {
                tm = []
            }
            else {
                for (let i = 0; i < m[0].teamMembers.length; i++) {
                    tm.push(await userSchema.findById(m[0].teamMembers[i]))
                }
            }

            TaskList.map((ele) => {
                if (ele.priority.toLowerCase() === "high") {
                    ele.color = "red"
                } else if (ele.priority.toLowerCase() === "medium") {
                    ele.color = "orange"
                } else if (ele.priority.toLowerCase() === "low") {
                    ele.color = "yellow"
                } else {
                    ele.color = "grey"
                }
            })

            tm = tm.reduce((acc, { _id, userName }) => {
                acc.push({ value: _id, label: userName });
                return acc;
            }, []);

            res.json({ _id, projectId, priority, projectName, teamAdminId, teamId, TaskList, SubmissionDate, tm , personal })
        }
    } catch (error) {
        res.json(error.message)
    }
})

/* 
1 ==> function / endpoint to get projets objects of multiple ids
2 ==> return array of objects ,which is made of project object which hav eid given in array
3 ==> takes array of ids
4 ==> url for the function is get call "http://localhost:8000/projects/multipleProj"
note ==> this service wont be used in future when the loadbalancer and multiple server are going to be in use wh.
*/

router.get("/Mu", async (req, res) => {
    try {
        ProjectSchema.updateMany(
            {}, // Filter to update all documents
            {
                $set:
                    { TaskList: { status: { $cond: { if: { $lte: [Math.floor(Math.random() * 2), 0] }, then: "completed", else: "assigned" } } } }
            }, // Update operation to set the new value for the status key
            function (err, result) {
                if (err) throw err;
                console.log(result);
            }
        );



    } catch (err) {
        console.log(err)
    }
})

//for deleting task from taskList
router.put("/projDelete/:id", async (req, res) => {
    try {
        const key = req.body.Parentkey
        const info = await ProjectSchema.updateOne({ "_id": req.params.id },
            { $pull: { "TaskList": { '_id': key } } },
            { multi: true })
        console.log("yup did it")
        res.send("id removed is " + info + req.params.id);
    } catch (err) {
        console.log(err)
    }
})

//for deleteing document form document list
router.put("/proj_delte_doc/:id", async (req, res) => {
    try {
        const key = req.body.Parentkey
        const info = await ProjectSchema.updateOne({ "_id": req.params.id },
            { $pull: { "Documents": { '_id': key } } },
            { multi: true })
        console.log("yup did it")
        res.send("id removed is " + info + req.params.id);
    } catch (err) {
        console.log(err)
    }
})

//for deleteing Calendar from calendar list
router.put("/proj_delte_Cal/:id", async (req, res) => {
    try {
        const key = req.body.Parentkey
        const info = await ProjectSchema.updateOne({ "_id": req.params.id },
            { $pull: { "calendar": { '_id': key } } },
            { multi: true })
        console.log("yup did it")
        res.send("id removed is " + info + req.params.id);
    } catch (err) {
        console.log(err)
    }
})

router.delete("/projDelete/:id", async (req, res) => {
    try {
        await ProjectSchema.findByIdAndRemove(req.params.id);
        console.log("yup did it")
    } catch (err) {
        console.log(err)
    }
})
/* 
1 ==> function / endpoint to create the project
2 ==> creates the object and stores it in db with given data
3 ==> takes information as input in json format
4 ==> url for the function is post call "http://localhost:8000/projects"
*/

router.post("/", (req, res) => myfunc.postData(req, res, ProjectSchema))

/*
1 ==> function/endpoint to update the data 
2 ==> expect the json object ,object has key and value key reprent key of value to be changed and value i.e. new value
3 ==> takes information as input in json format
4 ==> url for the function is post call "http://localhost:8000/projects/62d3aa21f4bdddd0ea6504b9"
example data ==> { "projectName" : "proj1"}
*/

router.put("/:id", (req, res) => myfunc.put(req, res, ProjectSchema))

/* 
1 ==> function / endpoint which specifically adds data in array of object
2 ==> returns the json object , 
3 ==> takes information as input in json format
4 ==> url for the function is "http://localhost:8000/projects/arrAdd/<id of projct>" for example "http://localhost:8000/projects/arrAdd/62d3aa21f4bdddd0ea6504b9"
example data ==> { <key as per the schema>: <keys as per schema>} i.e {"TaskList" : {"taskName" : "task2"}}
*/

router.put("/arrAdd/:id", (req, res) => myfunc.addData(req, res, ProjectSchema))

router.put("/_idProj/:id", async (req, res) => {
    res.json(await ProjectSchema.findOneAndUpdate({ "_id": req.params.id }, { $push: req.body }, { new: true }))
})

/*
1 ==> function / endpoints which specifically updates the values of objects in array of object 
2 ==> returns updated json object
3 ==> takes information as input in form of json
4 ==> url for the function is "http://localhost:8000/projects/arrayUpdate/<id of projct>" for example "http://localhost:8000/projects/arrayUpdate/62d984453add0cb4d4d252cc"
example data ==> {"Parentkey" : "TaskList","key_to_change" : "taskName","value" : "task2.1.1"}
tip ==> id in this function/enpoint call should be of task not the whole project object
*/

router.put("/arrayUpdate/:id", async (req, res) => {
    try {
        const a = String(req.body.Parentkey) + ".$." + String(req.body.key_to_change)
        const parentkey = String(req.body.Parentkey + "._id");
        console.log(parentkey)
        res.json(await ProjectSchema.findOneAndUpdate({
            [parentkey]: req.params.id
        }, { $set: { [a]: req.body.value } }, { new: true }))
    } catch (err) {
        console.log("error is ", err);
        res.json({ msg: err }).status(500)
    }
})

router.put("/uAoO/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { key, _id, value } = req.body;
        const a = ".$." + String(req.body.key)
        const doc = await ProjectSchema.findOneAndUpdate({ "_id": id, "calendar._id": _id }, { $set: { ["calendar" + a]: value } }, { new: true })
        res.json(doc)
    } catch (error) {
        res.json({ msg: error }).status(500)
    }
})

router.put("/arrayUpdateAll/:Pid", async (req, res) => {
    try {

        const { Pid } = req.params;
        const { Tid, data } = req.body;
        const doc = await ProjectSchema.findOneAndUpdate(
            { "_id": Pid, "TaskList._id": Tid },
            { $set: data },
            { new: true })
        res.json(doc)

    } catch (error) {
        res.json({ msg: error }).status(500)
    }
})

router.put("/arrayUpdateAllCalendar/:Pid", async (req, res) => {
    try {

        const { Pid } = req.params;
        const { Cid, data } = req.body;
        const doc = await ProjectSchema.findOneAndUpdate(
            { "_id": Pid, "calendar._id": Cid },
            { $set: data },
            { new: true })
        res.json(doc)

    } catch (error) {
        res.json({ msg: error }).status(500)
    }
})

/*
dashboard api call
dashboard must have -
1) project name,
2) Submission Date
3) Priority with color
4) Remaining Days to complete the Project
5) OnGoing Events, and Calendar
6) No of task completed,ongoging , (can be shown using a pie chart or donut chart)
7) diffrence between date of submission and date of actual submission , and the graph to display that
and predicting how much more dates are needed to compltete that
8) Prediction of project submission date
*/

/* 
1 ==> function / enpoints which deletes the project
*/

router.delete("/:id", (req, res) => myfunc.del(req, res, ProjectSchema))

module.exports = router