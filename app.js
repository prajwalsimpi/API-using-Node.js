require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');



const app = express();
const port = process.env.PORT || 5000;
// for parsing application/json
app.use(express.json()); 

// for parsing application/xwww-
app.use(express.urlencoded({ extended: true }));

const userData=[
    {
        "userid" : "ThomasEdison",
        "username" : "Thomas Edison",
        "useremail" : "tomedi@son.com",
        "userpassword" : "tom123@"
    }
]
const advisorData = [
    {
        "advisorName": "Jon Doe",
        "advisorPhotourl": "Jon Doe Photo",
        "advisorId" : "JD100"
    },
    {
        "advisorName": "James Bond",
        "advisorPhotourl": "James Bond Photo",
        "advisorId" : "JB101"  
    },
    {
        "advisorName": "Tony Stark",
        "advisorPhotourl": "Tony Stark Photo",
        "advisorId" : "TS102"
    }
]

const bookingData = [
    {
        bookingId: '66',
        userId: 'TestUser1',
        bookingTime: '12:34:38 pm',
        advisorId: 'JD100',
        advisorName: 'Jon Doe',
        advisorPhotoUrl: 'Jon Doe Photo'
      },
      {
        bookingId: '80',
        userId: 'TestUser2',
        bookingTime: '12:34:38 pm',
        advisorId: 'TS102',
        advisorName: 'Tony Stark',
        advisorPhotoUrl: 'Tony Stark Photo'
      },
      {
        bookingId: '84',
        userId: 'TestUser1',
        bookingTime: '12:34:38 pm',
        advisorId: 'TS102',
        advisorName: 'Tony Stark',
        advisorPhotoUrl: 'Tony Stark Photo'
      }
]

app.post('/admin/advisor/', (req,res) =>{
    const advisorName = req.body.advisorname;
    const advisorPhotoUrl = req.body.advisorphotourl;
    if(advisorName && advisorPhotoUrl){
        const advisorid = advisorName.replace(/ +/g, "").slice(0,4);
        let newAdvisor = {advisorName : advisorName, advisorPhotourl: advisorPhotoUrl, advisorId: advisorid}
        advisorData.push(newAdvisor);
        console.log(advisorData);
        res.sendStatus(200);
    }
    else{
        res.sendStatus(400);
    }
});

// function authenticateToken(req,res,next){
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1]
//     if (token == null) return res.sendStatus(401)

//     jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,user) =>{
//         if(err) return res.sendStatus(403);
//         req.user = user;
//         next();
//     })
// }

app.post('/user/register/', (req,res) =>{
    const userEmail = req.body.useremail;
    const userPassword = req.body.userpassword;
    const userName = req.body.username;
    if (userName && userEmail && userPassword)
    {
        let userId = userName.replace(/ +/g, "").slice(0,4);
        let userString = { userid : userId, username : userName, useremail : userEmail, userpassword: userPassword }
        userData.push(userString);
        console.log(userData);        
        const user = { name : userId }
        
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
        res.status(200).json({ accessToken : accessToken, userId: userId})
    }
    else
    {
        res.sendStatus(400)
    }
});

app.post('/user/login/', (req,res) =>{
    const userEmail = req.body.useremail;
    const userPassword = req.body.userpassword;
    if( userEmail && userPassword)
    {
        const finduser = userData.find(user => user.useremail === userEmail)
        if( finduser == null)
        {
            return res.status(400)
        }
        else
        {
            if(finduser.userpassword === userPassword)
            {
                const user = { name : finduser.userid }
                const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
                res.status(200).json({ accessToken : accessToken , userId: finduser.userid})
            }
            else{
                res.sendStatus(401)
            }
        }
    }
    else{
        res.sendStatus(400)
    }
});


app.get('/user/:userId/advisor', (req,res) =>{
    const userId = req.params['userId'];
    if(userId){
        res.status(200).json(advisorData);
    }
});

app.post('/user/:userId/advisor/:advisorId/', (req,res) =>{
    const bookingDateTime = new Date(req.body.bookingTime);
    const bookingTime = bookingDateTime.toLocaleTimeString()
    console.log(bookingTime);
    const userId = req.params['userId'];
    const advisorId = req.params['advisorId'];
    if(bookingTime === 'Invalid Date')
    {
        res.send(400);
    }
    else
    {
        let matchedadvisorName ='';
        let matchedadvisorPhoto = '';
        let matchFound = false;
        advisorData.forEach((elem) => {
            if(elem.advisorId === advisorId)
            {
                matchFound = true;
                matchedadvisorName = elem.advisorName;
                matchedadvisorPhoto = elem.advisorPhotourl;
                let bookingString = '{ "bookingId" : "' + (Math.floor((Math.random() * 100) + 1)) + '" , "userId" : "'+ userId +'" , "bookingTime" : "' + bookingTime + '" , "advisorId" : "' + advisorId +'" , "advisorName" : "' + matchedadvisorName + '" , "advisorPhotoUrl" : "' + matchedadvisorPhoto + '" }';
                bookingString = JSON.parse(bookingString);
                bookingData.push(bookingString);
                console.log(bookingData);
                res.sendStatus(200);
            }
        })
        if(!matchFound){
            res.sendStatus(400);
        }
    }

});

app.get('/user/:userId/advisor/booking/', (req,res) =>{
    let getUserBookings = [];
    const userId = req.params['userId'];
    bookingData.forEach((elem) =>{
        if(elem.userId === userId)
        {
            getUserBookings.push(elem);
        }
    })
    if(getUserBookings.length > 0){
        res.status(200).json(getUserBookings);
    }


});
app.listen(port);
