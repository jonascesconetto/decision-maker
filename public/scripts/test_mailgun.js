var api_key = 'db88c9e27666194d9870bc47555b257e-c8c889c9-78662c6b';
var domain = 'sandbox15da19073efc4253b56be0368fe36362.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

var data = {
  from: 'admin@sandbox15da19073efc4253b56be0368fe36362.mailgun.org',
  to: 'petenol@gmail.com',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomeness! This is pretty cool! I think :)'
};

mailgun.messages().send(data, function (error, body) {
  if (error) console.log(error);
  console.log(body);
});
