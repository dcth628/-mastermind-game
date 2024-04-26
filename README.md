# Quad Cipher

<div align="center">
    <a href="https://quad-cipher.onrender.com/">
        <img src="https://res.cloudinary.com/ddxewbhmy/image/upload/v1714160683/quad.cipher_dpf5lw.png" crossorigin style="width: 400px; height: auto;">
    </a>
</div>

 > `Quad Cipher is a game in which you need to guess a number combination. You can choose from different difficulty levels and save your score. Your score and time might even show up on the leaderboard! You can also review your game history to improve your skills for the next game. Enjoy playing the game!!`

 > `The source code is open so that you can download the source code and set it up with ease if you would like to play this game locally`
<br/>

## 📋 Table of Contents

01. ⭐ [App Gif Demo](#app-gif)
02. 🃏 [App Screenshot](#app-screenshot)
03. 🔨 [Folder Structure](#folder-structure)
04. 🌿 [Figma Prototype](#figma-prototype)
05. 🚀 [developing](#developing)
06. 🐳 [Getting Start](#getting-started)
07. 📈 [API Documentation](#api-documentation)
08. 📈 [API Documentation](#api-documentation)
09. 🐙 [Database Schema](#database-schema)
10. ✨ [Feature List](#feature-list)

<br/>

## ⭐ <a name='app-gif'> App Gif Demo</a>
![game demonstrate]( git )

## 🃏 <a name='app-screenshot'>App Screenshots</a>

|                                                                                    Game Login                                                                                     |                                                                                   Start a new game                                                                                   |                                                                                Check game history                                                                                |                                                                             Leaderboard                                                                              |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| <img src="placeholder 1" title="Game Login " width="100%" crossorigin> | <img src="placerholder 2" title="start a new game" width="100%" crossorigin> | <img src="placerholder 3" title="check game history" width="100%" crossorigin> | <img src="placeholder 4" title="leaderboard" width="100%" crossorigin> |

<br/>

## 🔨 <a name='folder-structure'>Folder Structure</a>

    .
    ├── backend
    │    │── db
    │    │    ├── migrations           # Sequelize migration - control database schema
    │    │    │    └── ...
    │    │    ├── models               # Sequelize models - tables for database
    │    │    │    └── ...
    │    │    └── seeders              # Seeders for smaple data
    │    │         └── ...
    │    ├── routes
    │    │    └── api                  # Express API framework
    │    │── utils
    │    └── config
    ├── frontend
    │    ├── public                    # A directory to contain static images
    │    └── src
    │         ├── components           # React components folder
    │         │     └── ...
    │         ├── conext               # React Modal compnent
    │         └── store                # Redux store/Reducer folder
    ├── package.json
    ├── package-lock.json
    ├── .gitignore
    └── README.md

<br/>

## 🌿 <a name='figma-prototype'>Figma Prototype</a>
[![Quad cipher prototype](gif for prototype)](https://www.figma.com/proto/x8fBopteu4Z7zmK4xoMoCW/Mastermind-Game?node-id=1-2&mode=design&t=nT6FbUJyeMgYahrJ-1)

## 🚀 <a name='developing'>Developing</a>

#### Built With

- [Node JS](https://nodejs.org/en/)
- [Sequelize](https://sequelize.org/)
- [Express JS](https://expressjs.com/)
- [Redux.JS](https://redux.js.org/)
- [React.JS](https://react.dev/)
- [Random.org](https://www.random.org/clients/http/api/)

<br/>

## 🐳 <a name='getting-started'>Getting Started</a>


#### Clone Project

```shell
    git clone https://github.com/dcth628/mastermind-game.git
```
This Command will copy a full project to your local environment

## Backend

#### Setting up Node.js Backend

```shell
    cd backend
    npm i
```
`cd backend` Move into backend Folder
`npm i` install all dependency.


#### Setting up Sequelize Migrations and Models

```shell
    npx dotenv sequelize db:migrate
```
Install sequelize migrations and models for database schema


#### Seed all Sequelize seeders

```shell
    npx dotenv sequelize db:seed:all
```
Seed sequelize seeders for example data


#### Run Node Serve

```shell
    npm start
```
Run `backend serve` for a dev server. Navigate to `http://localhost:8000/`. The app will automatically reload if you change any of the source files.


### Frontend

#### Setting up React Project

```shell
    cd frontend
    npm i
```
`cd frontend` Move into frontend Folder
`npm i` install all dependency.

#### Run React Serve

```shell
    npm start
```
Run `React frontend serve` for a dev server. Navigate to `http://localhost:3000/`. The app will automatically reload if you change any of the source files.

<br/>

## 📈 <a name='api-documentation'> API Documentation </a>

### Web API

| Web API                      | URL                                        | Description |
| ---------------------------- | ------------------------------------------ | ----------- |
| User Register                | /api/users/                                | -           |
| User Info                    | /api/users/:userID                         | -           |
| User Login                   | /api/session/                              | -           |
| User Logout                  | /api/session/                              | -           |
| Get Random Numbers           | /api/games/random-number                   | -           |
| Check the Result             | /api/games/result                          | -           |
| Get Guess History            | /api/games/history                         | -           |
| Get Hint                     | /api/games/hint                            | -           |
| Get Sum Scores               | /api/games/total-score                     | -           |
| Get all Scores from Players  | /api/games/all-scores                      | -           |
| Get all Game History         | /api/games/all-game                        | -           |
| Get Fastest Time to Win      | /api/games/fast-time                       | -           |
| Get Less Apptempts           | /api/games/less-round                      | -           |
| Get Guess History from Game  | /api/games/:gameId/guess                   | -           |
| Update Game when Win         | /api/games/win                             | -           |
| Update Guess when Win        | /api/games/win-guess                       | -           |

Please see more details in API routes document.
### [API routes document](https://github.com/dcth628/API-Project/wiki/API-Routes)

<br/>

## 🐙 <a name='database-schema'>Database Schema Design</a>

<img src="https://res.cloudinary.com/ddxewbhmy/image/upload/v1714169584/Quad_Cipher_tfqv96.png" width="600" height="auto">

Design 4 tables for database to store `user`, `scores`, `game` and `guess` date. <br/>
<br/>
User table has attributes `username`, `email`, `lastname`, `firstname`, and `password` to able sign up, login and associate with score and game table. <br/>
<br/>
Game table has attributes `UserId` associate with user table, `difficulty` indicate 3 levels of game, `number` 4 digit random numbers to start the game, `solve` boolean to indicate if user win the game.<br/>
<br/>
Score table has attribute `userId` associate with user table, `numbers` to store the user score for leaderboard.<br/>
<br/>
Guess table has attribute `gameId` associate with game table, `number` to store a number from player guess, `digit` and `location` indicate correct number and location, `round` to store the numbers of player attempt, `time` to store the time player solve the game. <br/>

<br/>

## ✨ <a name='feature-list'>Feature List</a>

### MVP List

#### 1. New account creation, log in, log out, and guest/demo login

* Player can sign up, log in, and log out.
* Player can use a demo log in to try the site.
* Player can't start the game without logging in.
* Logged in Player are directed to the new game page.
* Logged out Player are directed to the landing page require Player to log in.

#### 2. Game Page

* Player can choose three different difficulty levels.
* Player can start a new game from fetch random number API.
* Player can enter 4 digit numbers and receive check result.
* Player can a hint.
* The number of guesses remaining is displayed.
* Player able to see the feedback after submit the guesses.
* Player need to restart the game after 10 attempts.
* Player able to see the score, time and game number after win the game.

#### Game History

* Player can review their game history.
* Player can view the history of guesses and feedback from each game.
* Player can view the details of each game.

#### Leaderboard

* Player can see their own scores.
* Score ranking list shows from highest scores to lowest.
* Time ranking list shows the fastest time to win the game. Up to 10 players
* Round ranking list shows the fewer round to win the game. Up to 10 players.


#### Quad Cipher - mastermind game - Dean Hsieh
