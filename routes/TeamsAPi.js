const express = require("express");
const router = express.Router()
const mongoose = require("mongoose")
const myfunc = require("../controllers/Controller")

const TeamSchema = require("../db/Schemas/TeamsSchema");
const userSchema = require("../db/Schemas/UserSchema");
const ProjectSchema = require("../db/Schemas/ProjectSchema")


router.get("/", (req, res) => myfunc.getallData(req, res, TeamSchema, "TeamSchema"))

//get data using teamid
router.get("/:id", (req, res) => myfunc.getById(req, res, TeamSchema, "TeamSchema"))


router.get("/search/:name", async (req, res) => {
    try {
        res.json(await TeamSchema.find({ "teamName": req.params.name }))
    } catch (err) {
        console.log(err)
    }

}) 

//this api gets all teams associated with user,means the team he is a part of as a member or admin
router.get("/getTeamUsingUSerId/:id", async (req, res) => {
    try {
        //let data = await TeamSchema.find({ "teamMembers":mongoose.Types.ObjectId(req.params.id)})
        let id = mongoose.Types.ObjectId(req.params.id)
        let data = await TeamSchema.find().or([{ "teamMembers":req.params.id} , {"teamAdminID":id} ])
        res.json(data).status(200)
    } catch (error) {
res.json(error)
    }
})

//to create whole teams model
router.post("/", async(req, res) => {
    try {
        const data = new TeamSchema(req.body)
        const response = await data.save()
        console.log(await userSchema.findOneAndUpdate(
            //find the collection with id ,id mmust be equal to team admin id(the person's od who created the team)
            {"_id":response.teamAdminID},
            //if you find it then push the teams id in the user team array
             {$push:{"Teams":response._id}},
             //new flag
             { new: true }
             ))
        res.json(response).status(200)
    } catch (error) {
        console.log("error is ", error);
        res.json({ msg: error }).status(500)
    }
})


//adds ids of project as well as teammembers to their respective array 
router.put("/arrAdd/:id", async (req, res) => {

    res.json(await TeamSchema.findOneAndUpdate({ "teamid": req.params.id }, { $push: req.body }, { new: true }))
})

//removes ids of project as well as teammembers to their respective array 
router.put("/arrDel/:id", async (req, res) => {
    res.json(await TeamSchema.findByIdAndUpdate(req.params.id, { $pop: req.body }, { new: true }))

})

router.put("/:id", (req, res) => myfunc.put(req, res, TeamSchema))


router.delete("/:id", (req, res) => myfunc.del(req, res, TeamSchema))


module.exports = router
