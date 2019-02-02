//  Helper functions to
// 1. Write a new poll to the database
// 2. Send an email to creator with the admin link and visitor link.
const ENV         = process.env.ENV || 'development';
const knexConfig  = require('./knexfile');
const knex        = require('knex')(knexConfig[ENV]);

var api_key = 'db88c9e27666194d9870bc47555b257e-c8c889c9-78662c6b';
var domain = 'sandbox15da19073efc4253b56be0368fe36362.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
const chance = require('chance').Chance();

function generateRandomUrl() {
  //uses chance library to generate random hash of length 20
  return chance.hash({length: 20});
}

module.exports = function writePollToDB (poll) {

  return knex('polls')
  .returning(['id', 'admin_email', 'admin_url', 'vote_url'])
  .insert({
      admin_email: poll.adminEmail,
      title: poll.newPollName,
      question: poll.newPollQuestion,
      admin_url: generateRandomUrl(),
      vote_url: generateRandomUrl()
    })
  .then((columns) => {

    // Breaks down return from insert to different values
    id = columns[0]['id'];
    admin_email = columns[0]['admin_email'];
    admin_url = columns[0]['admin_url'];
    vote_url = columns[0]['vote_url'];

    // Calls function to send email
    sendEmailToAdmin(admin_email, admin_url, vote_url);

    //  Inserts  into candidates table
    //calls manipulate form data
    let optionsData = manipulateFormData(poll);
    optionsData.forEach( (element) => {
      let candidate = poll[element[0]];
      let description = poll[element[1]];
      knex('candidates')
        .insert({polls_id: id, candidate, points: 0, description})
        .then( () => {
          console.log("inserted candidates");
        })
        .catch((err) => {
          console.log(err);
        });
    })

  })

  .catch((error) => {
    console.error(error);
  });
}

// manipulates form data to help writing to the database
function manipulateFormData(formdata) {
  var options = [];
  for(var name in formdata) {
    if(name.includes('option') && formdata[name]) {
      var desc = 'details' + name.substr(-1);
      options.push([name, desc]);
    }
  }
  return options;
}

function sendEmailToAdmin(adminEmail, admin_url, vote_url)  {
  // Creates email template
  var data = {
    from: 'admin@sandbox15da19073efc4253b56be0368fe36362.mailgun.org',
    to: adminEmail,
    subject: 'Your Poll is live',
    text: 'Hi! Your admin link is /' + admin_url + ' and the URL to share with your friends is /' + vote_url,
  };

  mailgun.messages().send(data, function (error, body) {
    if (error) console.log(error);
    console.log(body);
  });
}

// test data
const poll = { newPollName: 'Sumedha poll',
newPollQuestion: 'Where should we vacation?',
option1: 'Mexico',
details1: 'Cancun',
option2: 'Cuba',
details2: 'Havana',
option3: 'Australia',
details3: '',
option4: 'Greece',
details4: 'Athens',
option5: '',
details5: '',
adminEmail: 'sumedhanarayanan@gmail.com' }

// writePollToDB(poll);

