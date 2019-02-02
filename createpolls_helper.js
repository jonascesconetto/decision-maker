//  Helper functions to
// 1. Write a new poll to the database
// 2. Send an email to creator with the admin link and visitor link.
const ENV         = process.env.ENV || 'development';
const knexConfig  = require('./knexfile');
const knex        = require('knex')(knexConfig[ENV]);

const api_key = process.env.MAILGUN_KEY;
const domain = process.env.DOMAIN;
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
const chance = require('chance').Chance();

function generateRandomUrl() {
  //uses chance library to generate random hash of length 20
  return chance.hash({length: 20});
}

function generateEmailText(admin_url, vote_url) {
 

}

module.exports = function writePollToDB (poll) {
  const vUrl = generateRandomUrl();
  return knex('polls')
  .returning(['id', 'admin_email', 'admin_url', 'vote_url'])
  .insert({
      admin_email: poll.adminEmail,
      title: poll.newPollName,
      question: poll.newPollQuestion,
      admin_url: generateRandomUrl(),
      vote_url: vUrl
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
    return Promise.all(optionsData.map( (element, index) => {
      let candidate = poll[element[0]];
      let description = poll[element[1]];
      console.log('From pollshelper: candidate',candidate , 'description', description, 'element', element);
      return knex('candidates')
        .insert({ polls_id: id, candidate, points: 0, description })
        .then(() => {
          console.log("inserted candidates");
        })
        .catch((err) => {
          console.log(err);
        });
    }));
  })
  .then(() => { return vUrl; })
  .catch((error) => {
    console.error(error);
  });
};

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
    from: 'decisionmaker@' + domain,
    to: adminEmail,
    subject: 'Your Poll is live',
    text:`Hi! Thank you for creating your poll! We are excited to help you and your friends make your decision. Share the link below with your to get the votes started.

    Voting Link: http://localhost:8080/polls/${vote_url}. 

    To view results you can view the admin link:
    Admin Link: http://localhost:8080/polls/${admin_url} 

    Keep this email safe. You will be unable to access the poll without the links. 
    Happy Polling!`
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

