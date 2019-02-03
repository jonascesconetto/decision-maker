/* eslint-disable prefer-destructuring */
/* eslint-disable import/order */
//  Helper functions to
// 1. Write a new poll to the database
// 2. Send an email to creator with the admin link and visitor link.


const ENV = process.env.ENV || 'development';
// eslint-disable-next-line camelcase
const api_key = process.env.MAILGUN_KEY;
const domain = process.env.DOMAIN;

const mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });
const chance = require('chance').Chance();

const knexConfig = require('./knexfile');
const knex = require('knex')(knexConfig[ENV]);

function generateRandomUrl() {
  // uses chance library to generate random hash of length 20
  return chance.hash({ length: 20 });
}

// manipulates form data to help writing to the database
function manipulateFormData(formdata) {
  const options = [];

  // eslint-disable-next-line no-restricted-syntax
  for (let name in formdata) {
    if (name.includes('option') && formdata[name]) {
      // eslint-disable-next-line prefer-const
      let desc = `details${name.substr(-1)}`;
      options.push([name, desc]);
    }
  }
  return options;
}

function sendEmailToAdmin(adminEmail, admin_url, vote_url) {
  // Creates email template
  const data = {
    from: `decisionmaker@${domain}`,
    to: adminEmail,
    subject: 'Your Poll is live',
    text: `Hi! Thank you for creating your poll! We are excited to help you and your friends make a decision. Share the link below to start voting.

    Voting Link: http://localhost:8080/polls/${vote_url} 

    To view results you can view the admin link:
    Admin Link: http://localhost:8080/polls/admin/${admin_url} 

    Keep this email safe. You will be unable to access the poll without the links. 
    Happy Polling!`,
  };

  mailgun.messages().send(data, (error, body) => {
    if (error) console.error(error);
    console.log(body);
  });
}

module.exports = function writePollToDB(poll) {
  const vUrl = generateRandomUrl();
  return knex('polls')
    .returning(['id', 'admin_email', 'admin_url', 'vote_url'])
    .insert({
      admin_email: poll.adminEmail,
      title: poll.newPollName,
      question: poll.newPollQuestion,
      admin_url: generateRandomUrl(),
      vote_url: vUrl,
    })
    .then((columns) => {
      // Breaks down return value from insert to different values
      const id = columns[0]['id'];
      const admin_email = columns[0]['admin_email'];
      const admin_url = columns[0]['admin_url'];
      const vote_url = columns[0]['vote_url'];

      // Calls function to send email
      sendEmailToAdmin(admin_email, admin_url, vote_url);

      //  Inserts  into candidates table
      const optionsData = manipulateFormData(poll);
      return Promise.all(optionsData.map((element) => {
        const candidate = poll[element[0]];
        const description = poll[element[1]];
        return knex('candidates')
          .insert({
            polls_id: id,
            candidate,
            points: 0,
            description,
          })
          .then(() => {
            console.log('inserted candidates');
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

