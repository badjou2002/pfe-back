const nodemailer = require('nodemailer');

const transporter =nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'bil602u@gmail.com',
        pass: 'kmkq snfw vzzd ftwb'
    },
    tls: {
        rejectUnauthorized: false
    }
})
module.exports={transporter}