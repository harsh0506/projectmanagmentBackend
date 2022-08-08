const userSchema = require("../db/Schemas/UserSchema")
const ProjectSchema = require("../db/Schemas/ProjectSchema")

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
            res.json(await SchemaName.find({userId:req.params.id}).populate("Teams", "projects"));
        }
        else if (name === "TeamSchema") {
            const m = await SchemaName.findById(req.params.id)
            let tm = [];
            let pl = [];
            for (let i = 0; i < m.teamMembers.length; i++) {
                tm.push(await userSchema.findById(m.teamMembers[i]))
            }
            for (let i = 0; i < m.teamMembers.length; i++) {
                pl.push(await ProjectSchema.findById(m.projectList[i]))
            }

            m == null ? res.send("no data found") : res.json({ teamdata: m, teamMember: tm, Projects: pl })
        }
        res.json(await SchemaName.findById(req.params.id))
    } catch (err) {
        console.log("error is ", err);
        res.json({ msg: error }).status(500)
    }
}

async function postData(req,res,SchemaName){
    try {
        const data = new SchemaName(req.body)
        const response = await data.save()
        res.json(response).status(200)
    } catch (error) {
        console.log("error is ", error);
        res.json({ msg: error }).status(500)
    }
}

async function put(req,res,SchemaName){
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

async function addData(req,res,SchemaName){
    res.json(await SchemaName.findByIdAndUpdate(req.params.id, { $push: req.body }, { new: true }))
}

async function del(req,res,SchemaName){
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