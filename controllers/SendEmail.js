const sgMail = require('@sendgrid/mail')
sgMail.setApiKey("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")

const msg = {
  to: 'test@example.com', // Change to your recipient
  from: 'test@example.com', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}

sgMail
  .send(msg)
  .then((response) => {
    console.log(response[0].statusCode)
    console.log(response[0].headers)
  })
  .catch((error) => {
    console.error(error)
  })