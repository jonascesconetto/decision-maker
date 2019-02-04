const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || 'development';
const knexConfig  = require('./knexfile');
const knex        = require('knex')(knexConfig[ENV]);

const api_key = process.env.MAILGUN_KEY;
const domain = process.env.DOMAIN;

const mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });
// sends notification to admin when new response is received

module.exports = function voteSubmitEmail (voteURL, voterName) {
  knex('polls')
    .select('admin_email', 'admin_url', 'title')
    .where('vote_url', voteURL)
    .then((rows) => {
      const adminEmail = rows[0].admin_email;
      const pollTitle = rows[0].title;
      const adminURL = rows[0].admin_url;
      const data = {
        from: `decisionmaker@${domain}`,
        to: adminEmail,
        subject: `${voterName} just voted on your poll`,
        text:
        `Hi!
        ${voterName} has just voted on your poll: ${pollTitle}. Click below to see the updated results.

        Admin Link: http://localhost:8080/polls/admin/${adminURL}


        Share the link below to get more responses.
        Voting Link: http://localhost:8080/polls/${voteURL}

        Happy Polling!`,
      };

      mailgun.messages().send(data, (error, body) => {
        if (error) console.error(error);
      });
    });
};

