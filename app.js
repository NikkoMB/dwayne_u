'use strict';

require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
const { google } = require('googleapis'); 
const OAuth2 = google.auth.OAuth2;


let app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));

app.set('view engine', 'ejs');
app.use('/assets', express.static(path.join(__dirname, '/assets')));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/contact.html', function (req, res) {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

app.get('/mywork.html', function (req, res) {
    res.sendFile(path.join(__dirname, 'mywork.html'));
});

app.get('/about.html', function (req, res) {
    res.sendFile(path.join(__dirname, 'about.html'));
})

app.get('/resume.html', function (req, res) {
    res.sendFile(path.join(__dirname, 'resume.html'));
})

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'error.html'));
})


const oauth2Client = new OAuth2(
    process.env.CLIENT_ID, // ClientID
    process.env.SECRET, // Client Secret
    "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
    refresh_token: process.env.TOKEN
});
const accessToken = oauth2Client.getAccessToken()

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.SECRET,
        refreshToken: process.env.TOKEN,
        accessToken: accessToken
    }
});


app.post('/send-email', function (req, res) {
    let email = req.body["email"];
    let subject = req.body['subject'];
    let mailOptions = {
        from: email,
        replyTo: email,
        to: process.env.EMAIL,
        subject: 'Email from Personal Website',
        text: subject
    };



    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.sendFile(path.join(__dirname, 'error.html'));
        } else {
            console.log('Email sent: ' + info.response);
            console.log(mailOptions);
            res.sendFile(path.join(__dirname, 'success.html'));
        }
    });
});

app.listen(process.env.PORT || 5000, function () {
    console.log('OH BABY WE LIVE LIVE');
});