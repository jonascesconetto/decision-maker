//  Helper functions to  
// 1. Write a new poll to the database
// 2. Send an email to creator with the admin link and visitor link.

var api_key = 'db88c9e27666194d9870bc47555b257e-c8c889c9-78662c6b';
var domain = 'sandbox15da19073efc4253b56be0368fe36362.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

function generateRandomUrl() {
  //uses chance library to generate random hash of length 20
  return chance.hash({length: 20});
}

function writePollToDB (poll) {
  knex('polls')
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
    let optionsData = manipulateFormData(formdata);
    optionsData.forEach( (element) => {
      let candidate = poll[element[0]];
      let description = poll[element[1]];
      knex('candidates')
        .insert({polls_id: id[0], candidate, points: 0, description})
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

module.exports = {
  writePollToDB: writePollToDB(poll)
}
