# Decision Maker

## Introduction
A full stack web app that helps groups of friends to vote on a preferred choice (using ranked voting), for example: "What movie should we see next Friday?" 

### The Problem

As a social person I want my group of friends to make a democratic choice on a group activity because it can be difficult to make a unified decision.

### User Stories & Scenarios

* Admin
  - Given that I have several activities
  - when I create a new poll and click enter my email and description and click submit
  - then two links are generated and emailed to me (admin and vote). I then am redirected to the vote page so that I can cast my vote.

* Voter
  - Given that the vote link is clicked in the email the voting page opens in the browser
  - when I enter my name, rank the choices and click submit
  - then the vote is calculated and the results page loads.

### Scenarios

- What movie should we see?
- What restaurant should we go to for Bill's birthday?
- What activity should we do as Saturday is going to be a beautiful sunny day?

### Features

- Easy poll creation:  The user does not need to sign up on the app and can easily create a poll on the landing page
- Security without authentication: Hashed URL links are sent to the user to access results and voting pages. 
- Democratic ranking system: Voters can rank their preferences from most preferred to least preferred with a simple drag and drop form
- Results algorithm: The app uses Borda Count [link](https://en.wikipedia.org/wiki/Borda_count) to rank voter preferences.
- Poll transparency: Both the admin and the voter can see the results immediately after voting.
- Admin page features: The admin user can view the calculated results, the number of votes and the preferences of each voter so far.

### Screenshots

## Project Stack

- Client: HTML, JS, Jquery, Ajax and ejs for rendering pages
- Server: Node.js
- PostgreSQL for DB
- Knex.js for querying and migrations
- git for version control

## Getting Started

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information - you will need to sign up for mailgun api to send email notifications
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Run migrations: `npm run knex migrate:latest`
  - Check the migrations folder to see what gets created in the DB
6. Run the seed: `npm run knex seed:run`
  - Check the seeds file to see what gets seeded in the DB
7. Run the server: `npm run local`
8. Visit `http://localhost:8080/`

## Dependencies

- Node 
- NPM 
- Body Parser 
- Chart.js 
- dotenv
- EJS
- Express
- Jquery UI
- Knex
- Mailgun-js
- pg

# Authors
- Clive [@silentscribe](https://github.com/silentscribe)
- Peter [@pnolan89](https://github.com/pnolan89)
- Sumedha [@sumedhan](https://github.com/sumedhan)
