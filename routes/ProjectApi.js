const express = require("express");
const router = express.Router()

const myfunc = require("../controllers/Controller")

const ProjectSchema = require("../db/Schemas/ProjectSchema")

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
    try{
        res.json(await ProjectSchema.find({ "_id": req.params.id }))
    }catch (err) {console.log(err)}
})

router.get("/projectId/:id",async (req, res) => {
    res.json(await ProjectSchema.find({ _id: req.params.id }))
})

/* 
1 ==> function / endpoint to get projets objects of multiple ids
2 ==> return array of objects ,which is made of project object which hav eid given in array
3 ==> takes array of ids
4 ==> url for the function is get call "http://localhost:8000/projects/multipleProj"
note ==> this service wont be used in future when the loadbalancer and multiple server are going to be in use wh.
*/

router.get("/multipleProj", async (req, res) => {
    try {
        const data = req.body.arrObject
        let response = []
        for (let i = 0; i < data; i++) {
            response.push(await ProjectSchema.findById(data[0]))
        }
        res.json(response)
    } catch (err) {

    }
})

//for deleting task from taskList
router.put("/projDelete/:id", async (req, res) => {
    try {
        const key = req.body.Parentkey 
        const info = await ProjectSchema.updateOne({"_id":req.params.id},
            { $pull: { "TaskList" : { '_id': key } } },
            { multi: true })
        console.log("yup did it")
        res.send("id removed is " + info + req.params.id);
    } catch (err) {
        console.log(err)
    }
})

//for deleteing document form document list
router.put("/proj_delte_doc/:id",async(req,res)=>{
    try {
        const key = req.body.Parentkey 
        const info = await ProjectSchema.updateOne({"_id":req.params.id},
            { $pull: { "Documents" : { '_id': key } } },
            { multi: true })
        console.log("yup did it")
        res.send("id removed is " + info + req.params.id);
    } catch (err) {
        console.log(err)
    }
})

//for deleteing Calendar from calendar list
router.put("/proj_delte_Cal/:id",async(req,res)=>{
    try {
        const key = req.body.Parentkey 
        const info = await ProjectSchema.updateOne({"_id":req.params.id},
            { $pull: { "calendar" : { '_id': key } } },
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

router.put("/_idProj/:id",async(req,res)=>{
    res.json(await ProjectSchema.findOneAndUpdate({"_id":req.params.id}, { $push: req.body }, { new: true }))
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

router.put("/uAoO/:id",async(req,res)=>{
    try {
        const { id } = req.params;
        const { key,  _id , value  } = req.body;
        const a = ".$." + String(req.body.key)
        const doc = await ProjectSchema.findOneAndUpdate({"_id":id,"calendar._id":_id},{ $set: { ["calendar" + a ]: value } },{new:true})
        res.json(doc)
    } catch (error) {
        res.json({ msg: error }).status(500)
    }
})

router.put("/arrayUpdateAll/:Pid", async(req,res)=>{
    try {
        const { Pid } = req.params;
        const { Tid, data } = req.body;
        const doc = await ProjectSchema.findOneAndUpdate(
            {"_id":Pid,"TaskList._id":Tid},
            { $set: data },
            {new:true})
        res.json(doc)
    } catch (error) {
        res.json({ msg: error }).status(500)
    }
} )

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