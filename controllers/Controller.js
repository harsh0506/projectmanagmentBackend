const userSchema = require("../db/Schemas/UserSchema")
const ProjectSchema = require("../db/Schemas/ProjectSchema")
const TeamSchema = require("../db/Schemas/TeamsSchema")
var mongoose = require('mongoose');

async function getallData(req, res, SchemaName, name) {
    try {
        res.json(await SchemaName.find())
        console.log(typeof (SchemaName))
    } catch (error) {
        console.log(error)
    }
}

async function getById(req, res, SchemaName, name) {
    try {
        if (name === "userModel") {
            // just gonna return all the projects of the user which are his personal or he is a admin of 
            console.log(await ProjectSchema.find({ teamAdminId: req.params.id }))
            //const data = await TeamSchema.find().or([{ "teamMembers":req.params.id} , {"teamAdminID":mongoose.Types.ObjectId(req.params.id)} ])
            res.json(await SchemaName.find({ "userId": req.params.id }).populate("Teams", "projects"));
        }
        else if (name === "TeamSchema") {

            const m = await SchemaName.find({ "teamid": req.params.id })
            let tm = [];
            let pl = [];
            console.log(m[0])

            for (let i = 0; i <= 1; i++) {
                tm.push(await userSchema.find({ "_id": m[0].teamMembers[i] + '' }))
            }
            m === null ? res.send("no data found") : res.json({ teamdata: m, teamMember: tm, Projects: pl })

        }
        else {
            const id = req.params.id
            res.json(await SchemaName.find({ teamAdminId: id }))
        }
    } catch (err) {
        console.log("error is ", err);
        res.json({ msg: err }).status(500)
    }
}

async function postData(req, res, SchemaName) {
    try {
        const data = new SchemaName(req.body)
        const response = await data.save()
        if (SchemaName === ProjectSchema) { await userSchema.findOneAndUpdate({ "_id": req.body.userId }, { "$push": { "projects": response._id } }, { new: true }) }
        if (SchemaName === "TeamSchema") {
            try {
                console.log(await userSchema.find({ "_id": response.teamAdminID }))
                console.log(await userSchema.findOneAndUpdate(
                    //find the collection with id ,id mmust be equal to team admin id(the person's od who created the team)
                    { "_id": response.teamAdminID },
                    //if you find it then push the teams id in the user team array
                    { $push: { "Teams": response._id } },
                    //new flag
                    { new: true }
                ))
            } catch (err) { console.log(err) }
        }
        res.json(response).status(200)
    } catch (error) {
        console.log("error is ", error);
        res.json({ msg: error }).status(500)
    }
}

async function put(req, res, SchemaName) {
    try {
        const id = req.params.id
        const newData = req.body
        const opt = { new: true }
        const updatedData = await SchemaName.findByIdAndUpdate(id, newData, opt)
        res.json(updatedData)
    } catch (error) {
        console.log("error is ", error);
        res.json({ msg: error }).status(500)
    }
}

async function addData(req, res, SchemaName) {
    res.json(await SchemaName.findOneAndUpdate({ "projectId": req.params.id }, { $push: req.body }, { new: true }))
}

async function del(req, res, SchemaName) {
    try {
        const id = req.params.id;
        await SchemaName.findByIdAndDelete(id)
        res.send(`deleted id is ${id}`)

    } catch (error) {
        console.log("error is ", error);
        res.json({ msg: error }).status(500)
    }
}

module.exports = {
    getallData,
    getById,
    postData,
    put,
    addData,
    del
}