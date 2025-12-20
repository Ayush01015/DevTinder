const express = require('express');

const app = express();
const {userProtectionChain} = require('./middleware.js')
const {createTestToken, JWT_SECRET} = require("./token.js");

app.use(express.json());

// console.log("TOKEN 101",createTestToken(101));

app.get('/token',(req,res,next)=>{
    if(!req.query.id || !req.query.role){
        return res.status(401).json({
            error:"USER ID AND ROLE NOT FOUND"
        })
    }
    const token  = createTestToken(req.query.id,req.query.role)

    return res.status(200).json({
        token
    })
})

const getProfileHandler = (req,res,next) => {
    console.log('Final Handler: Sending Profile Data...');
    const user = req.user;
    return res.status(200).json({
        id: user.id,
        name: user.name,
        role: user.role,
        settings: user.profileData,
        message: "Data retrieved successfully via middleware chain."
    });
}

app.get('/profile', userProtectionChain, getProfileHandler);

app.listen(3000);