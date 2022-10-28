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

router.get("/ti/:id", async (req, res) => {
    res.json(await ProjectSchema.find({ teamAdminId: req.params.id }))
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

router.put("/projDelete/:id", async (req, res) => {
    try {
        const key = req.body.Parentkey 
        const info = await ProjectSchema.updateOne({},
            { $pull: { "TaskList" : { '_id': req.params.id } } },
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

/* 
1 ==> function / enpoints which deletes the project
*/

router.delete("/:id", (req, res) => myfunc.del(req, res, userModel))

module.exports = router