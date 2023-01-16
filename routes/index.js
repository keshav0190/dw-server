const express = require('express');
const personController = require('../controller/person');
const userController = require('../controller/user');
const db = require('../db/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const router = express.Router();
router.post('/person', personController.createPerson);
router.post('/user', userController.createUser);
router.get('/user/home/:id', userController.getUser);
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
                    if(user.status == false)
                    {
                        response.status(200).json({
                            status_code: 403,
                            error: "Not verified",
                            data: {
                                id: user.id,
                                firstName: user.first_name,
                                lastName: user.last_name,
                                phoneNo: user.phone_no,
                                email: user.email
                            }
                        })
                    }
                    else{
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
                    
                }
            })
        }
    })
});

router.post("/user/verify", (request, response, next) => {
    db("otp")
    .where({user_id: request.body.id})
    .first()
    .then(user => {
        if(!user){
            response.status(200).json({
                status_code:404,
                error: "Invalid User",
                data:null
            })
        }else{
            if(user.otp == request.body.eotp || user.otp == request.body.potp)
            {
               //Change status to true return success
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
