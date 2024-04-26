# Quad Cipher

<div align="center">
    <a href="https://quad-cipher.onrender.com/">
        <img src="https://res.cloudinary.com/ddxewbhmy/image/upload/v1714160683/quad.cipher_dpf5lw.png" crossorigin style="width: 400px; height: auto;">
    </a>
</div>

 > `Quad Cipher is a game in which you need to guess a number combination. You can choose from different difficulty levels and save your score. Your score and time might even show up on the leaderboard! You can also review your game history to improve your skills for the next game. Enjoy playing the game!!`

 > `The source code is open so that you can download the source code and set it up with ease if you would like to play this game locally`+
## 📋 Table of Contents

1. 🐺 [App Gif Demo](#app-gif)
2. 🃏 [App Screenshot](#app-screenshot)
3. 🔨 [Folder Structure](#folder-structure)
4. 🚀 [developing](#developing)
5. 🐳 [Docker](#docker)
6. 💯 [Tests](#tests)
7. 🌿 [Env variables](#env-variables)
8. ☑️ [Code analysis and consistency](#code-analysis-and-consistency)
9. 📈 [Releases & Changelog](#versions)
10. 🐙 [GitHub Actions](#github-actions)
11. ✨ [Misc commands](#misc-commands)
12. ©️ [License](#license)
13. ❤️ [Contributors](#contributors)

## <a name='app-gif'> App Gif Demo</a>
![game demonstrate]( git )

## <a name='app-screenshot'>App Screenshots</a>

|                                                                                    Game Login                                                                                     |                                                                                   Start a new game                                                                                   |                                                                                Check game history                                                                                |                                                                             Leaderboard                                                                              |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| <img src="placeholder 1" title="Game Login " width="100%" crossorigin> | <img src="placerholder 2" title="start a new game" width="100%" crossorigin> | <img src="placerholder 3" title="check game history" width="100%" crossorigin> | <img src="placeholder 4" title="leaderboard" width="100%" crossorigin> |

## <a name='folder-structure'>Folder Structure</a>

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
    │    ├── public
    │    └── src
    │         ├── components           # React components folder
    │         │     └── ...
    │         ├── conext               # React Modal compnent
    │         └── store                # Redux store/Reducer folder
    ├── package.json
    ├── package-lock.json
    ├── .gitignore
    └── README.md

[![Quad cipher prototype](gif for prototype)](https://www.figma.com/proto/x8fBopteu4Z7zmK4xoMoCW/Mastermind-Game?node-id=1-2&mode=design&t=nT6FbUJyeMgYahrJ-1)

## <a name='developing'>Developing</a>

#### Built With

- [Node JS](https://nodejs.org/en/)
- [Sequelize](https://sequelize.org/)
- [Express JS](https://expressjs.com/)
- [Redux.JS](https://redux.js.org/)
- [React.JS](https://react.dev/)
- [Random.org](https://www.random.org/clients/http/api/)

## Getting Started

## Database Schema Design

`<insert database schema design here>`

## API Documentation

## USER AUTHENTICATION/AUTHORIZATION

### All endpoints that require authentication


# -mastermind-game
