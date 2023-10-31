const express = require('express');
const personController = require('../controller/person');
const userController = require('../controller/user');
const notesController = require('../controller/notes');
const db = require('../db/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'admin',
  port: 5432,
})

const router = express.Router();
router.post('/person', personController.createPerson);
router.post('/user', userController.createUser);
router.get('/user/home/:id', userController.getUser);
router.post('/notes', notesController.createNotes);
router.get("/notes/:id", (request, response, next) => {
    db("notes")
    .where({id: request.params.id})
    .then(async note => {
        if(!note){
            response.status(200).json({
                status_code:404,
                error: "Invalid Id",
                data:null
            })
        }else{
            response.status(200).json({
                status_code:200,
                error: "Note details",
                data:note
            })
        }
    })
})

router.put("/notes/:id", (request, response, next) => {
    const id = parseInt(request.params.id)
    const { title, body } = request.body

    pool.query(
        'UPDATE notes SET title = $1, body = $2 WHERE id = $3',
        [title, body, id],
        (error, results) => {
        if (error) {
            console.log(error);
            response.status(400).json({
                status_code:404,
                error: "There was some error while updating",
                data:null
            })
        }
        else{
            response.status(200).json({
                status_code:200,
                error: "Note updated",
                data: ''
            })
        }
        }
    )
})

router.delete("/notes/:id", (request, response, next) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM notes WHERE id = $1', [id], (error, results) => {
        if (error) {
            console.log(error);
            response.status(400).json({
                status_code:404,
                error: "There was some error while deleting",
                data:null
            })
        }
        else{
            response.status(200).json({
                status_code:200,
                error: "Note deleted",
                data: ''
            })
        }
  })
})

router.get("/notesbyuserid/:id", (request, response, next) => {
    db("notes")
    .where({user_id: request.params.id})
    .then(async note => {
        if(!note){
            response.status(200).json({
                status_code:404,
                error: "No notes found",
                data:null
            })
        }else{
            response.status(200).json({
                status_code:200,
                error: "Note details",
                data:note
            })
        }
    })
})


router.post("/login", (request, response, next) => {
    db("user")
    .where({email: request.body.email})
    .first()
    .then(user => {
        if(!user){
            response.status(200).json({
                status_code:404,
                error: "No user by that email",
                data:null
            })
        }else{
            return bcrypt
            .compare(request.body.password, user.password)
            .then(isAuthenticated => {
                if(!isAuthenticated){
                    response.status(200).json({
                        status_code: 401,
                        error: "Incorrect username or password!",
                        data: null
                    })
                }else{
                    return jwt.sign(user, "SECRET", (error, token) => {
                        response.status(200).json({
                            status_code: 200,
                            token: token,
                            data: {
                                id: user.id,
                                firstName: user.first_name,
                                lastName: user.last_name,
                                phoneNo: user.phone_no,
                                email: user.email
                            }
                        })
                    })
                    
                }
            })
        }
    })
});

router.post("/user/verify", (request, response, next) => {
    db("otp")
    .where({user_id: request.body.id})
    //.first()
    .then(async user => {
        if(!user){
            response.status(200).json({
                status_code:404,
                error: "Invalid User",
                data:null
            })
        }else{
            console.log(user);
            if(user[0].otp == request.body.eotp || user[0].otp == request.body.potp)
            {
                let id = request.body.id;
               //Change status to true return success
               const count = await db("user").where({id}).update({status: true});
               console.log(count);
                response.status(200).json({
                    status_code:200,
                    error: "User Verified",
                    data:null
                })
            }
            else{
                //return faliur
                response.status(200).json({
                    status_code:401,
                    error: "Incorrect OTP",
                    data:null
                })
            }
        }
    })
})

module.exports = router;
