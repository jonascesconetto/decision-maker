# Node Skeleton

## Project Setup

1. Create your own empty repo on GitHub
2. Clone this repository (do not fork)
  - Suggestion: When cloning, specify a different folder name that is relevant to your project
3. Remove the git remote: `git remote rm origin`
4. Add a remote for your origin: `git remote add origin <your github repo URL>`
5. Push to the new origin: `git push -u origin master`
6. Verify that the skeleton code now shows up in your repo on GitHub

## Getting Started

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Run migrations: `npm run knex migrate:latest`
  - Check the migrations folder to see what gets created in the DB
6. Run the seed: `npm run knex seed:run`
  - Check the seeds file to see what gets seeded in the DB
7. Run the server: `npm run local`
8. Visit `http://localhost:8080/`

## Dependencies

- Node 5.10.x or above
- NPM 3.8.x or above

# Pages 

- Landing page 
  - form for creating the poll displayed
  - has a submit button that creates a new poll
  - index.html

- Voting page 
  - votes.html/ ejs
  - displays a form for ranking options provided by the poll creator

- Results page - 
 - results.ejs
 - displays results page for voters

- Admin page -
 - admin.ejs
 - Admin view for the poll creater  that shows the results and voters' names


#  Routes
## GET /
- landing page for the app. (index.html)
- submit button links to POST /polls
- Res -  renders index.html 

## POST /polls
 - Writes poll data to polls db when a user creates a poll
 - Res - Redirect to  /mail/:pollid

## POST /mail/:pollid
 - send email using mailgun API to the admin with the poll link and admin page link for the poll
 Res -> Redirect to /polls/:v_url 

 ## GET /polls/:v_url
 - display all the options to vote
 RES -> Render votes.html 

 ## POST /polls/:v_url
 - Calculates the points for each candidate using borda count
 - updates DB points for candidates
 - updates voter DB with name of voter
  Res - > Redirect /polls/:v_url/result

 ## GET /polls/:v_url/result
 - displays the results of the votes so far
  Res - > render results.ejs

## GET /polls/:admin_url
 - Admin page with results, voters' name
 - admin.ejs
 - res Render /polls/:admin_url


# Wouldn't it be cool if?

- Polling expired after a time set by admin
- Auto delete polls after a year maybe?
-  Date of the event
- Ability t0  delete the poll from the admin page
- cookies to ensure a user votes only once
