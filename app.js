const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const expressLayouts = require('express-ejs-layouts');

const app = express();

app.use(express.static('public'));
app.use(expressLayouts);
app.set('layout','./layouts/main');
app.set('view engine', 'ejs');



// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('contact');
  });

  app.post('/send', (req, res) => {
    const output = `
      <p>You have a new contact request</p>
      <h3>Contact Details</h3>
      <ul>  
        <li>Name: ${req.body.name}</li>
        <li>Company: ${req.body.company}</li>
        <li>Email: ${req.body.email}</li>
        <li>Phone: ${req.body.phone}</li>
      </ul>
      <h3>Message</h3>
      <p>${req.body.message}</p>
    `;
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      // true for 465, false for other ports
      auth: {
          user: 'example@ethereal.email', // generated ethereal user
          pass: ''  // generated ethereal password
      },
      tls:{
        rejectUnauthorized:false
      }
    });
  
    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Nodemailer Contact" <marion.brekke@ethereal.email>', // sender address
        to: '', // list of receivers
        subject: 'Node Contact Request', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };
  
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        
  
        res.render('contact');
    });
    });

  app.listen(3000, () => console.log('Server started...'));
