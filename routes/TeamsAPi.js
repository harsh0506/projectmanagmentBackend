const express = require("express");
const router = express.Router()

const myfunc = require("../controllers/Controller")

const TeamSchema = require("../db/Schemas/TeamsSchema");
const userSchema = require("../db/Schemas/UserSchema");
const ProjectSchema = require("../db/Schemas/ProjectSchema")


router.get("/", (req,res)=>myfunc.getallData(req,res,TeamSchema,"TeamSchema"))

router.get("/:id",  (req, res) => myfunc.getById(req,res,TeamSchema , "TeamSchema"))

router.get("/search/:name" , async(req,res)=>{
    try{
    res.json(await TeamSchema.find({"teamName" : req.params.name}))
    }catch(err){
        console.log(err)
    }
    
})

//to create whole teams model
router.post("/",  (req, res) => myfunc.postData(req,res,TeamSchema))


//adds ids of project as well as teammembers to their respective array 
router.put("/arrAdd/:id",  (req, res) => myfunc.addData(req,res,TeamSchema))

//removes ids of project as well as teammembers to their respective array 
router.put("/arrDel/:id",async(req,res)=>{
    res.json(await TeamSchema.findByIdAndUpdate(req.params.id, { $pop: req.body }, { new: true }))
    
})

router.put("/:id",(req, res) => myfunc.put(req,res,TeamSchema))


router.delete("/:id",(req,res)=>myfunc.del(req,res,TeamSchema))


module.exports = router
