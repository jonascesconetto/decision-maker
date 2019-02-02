
require('dotenv').config();
const api_key = process.env.MAILGUN_KEY;
var domain = 'sandbox090311b5c2024041bfa7f700785a0ec5.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

var data = {
  from: 'admin@sandbox090311b5c2024041bfa7f700785a0ec5.mailgun.org',
  to: 'sumedha.lhl@gmail.com',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomeness! This is pretty cool! I think :)'
};

mailgun.messages().send(data, function (error, body) {
  if (error) console.log(error);
  console.log(body);
});

console.log(api_key);
