const express = require("express");
const router = express.Router()
const userModel = require("../db/Schemas/UserSchema")

const myfunc = require("../controllers/Controller")


/*
1 ==> function to get all the usrs regardless of team id or project id or any other metadata
2 ==> this function returns arrray of objects which are in userSchema collection
3 ==> it takes no parameters
4 ==> url for the function is "http://localhost:8000/user"
*/

router.get("/", async (req, res) =>myfunc.getallData(req,res,userModel))

/* 
1 ==> function / endpoint to get data of given id
2 ==> function returns only one object
3 ==> takes id
4 ==> url for the function is "http://localhost:8000/user/<id>" example "http://localhost:8000/user/62d3aa21f4bdddd0ea6504b9"
*/
router.get("/:id", async (req, res) => myfunc.getById(req,res,userModel , "userModel"))

/* 
1 ==> function / endpoint to get data of given username
2 ==> function returns only one object
3 ==> takes id
4 ==> url for the function is "http://localhost:8000/user/userName/<username>" example "http://localhost:8000/user/UserName/62d3aa21f4bdddd0ea6504b9"
*/

router.get("/userName/:userName" , async(req,res)=>{
    try{
        if (req.params.userName === undefined || req.params.userName === null || req.params.userName === ""){
            res.json({msg:"parameter issue please check"}).status(400)
        }
        res.json(await userModel.find({userEmail:req.params.userName}))
    }   catch (error) {
        console.log("error is ", error);
        res.json({ msg: error }).status(500)
    }  
})

/* 
1 ==> function / endpoint to create the project
2 ==> creates the object and stores it in db with given data
3 ==> takes information as input in json format
4 ==> url for the function is post call "http://localhost:8000/user"
*/

router.post("/",(req, res) => myfunc.postData(req,res,userModel))

router.put("/arr/:id", (req, res) => myfunc.addData(req,res,userModel))

router.put("/:id",(req, res) => myfunc.put(req,res,userModel))

router.delete("/:id",(req,res)=>myfunc.del(req,res,userModel))

module.exports = router