const express = require('express')
const axios = require('axios');
const session = require('express-session');
//a middleware for Express.js, which is used to manage sessions in web applications.
const { Game, User, Guess, Score, Sequelize } = require('../../db/models');
const router = express.Router();

// Create a session middleware with the given
router.use(session({
    secret: 'bacon_pancake_bacon_pancake',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));


// Store the secret number
let gameNumbers = [];
// Store the remaining attempt
let rounds = 1;
// Set hint usage
let hint = false;
// Set Difficulty
let difficulty = 1;

function checkGuess(guess, gameNumbers) {
    const result = { digit: 0, location: 0 }
    // First: Check the digit is on the correct index
    guess.forEach((num, index) => {
        if (num === gameNumbers[index]) {
            result['location'] += 1;
        }
    });

    // Second: Check for correct digits in the wrong index
    let correctDigits = 0;
    const numCounts = {};

    // Create a count map for game numbers
    gameNumbers.forEach(num => {
        numCounts[num] = (numCounts[num] || 0) + 1;
    });

    // Check for correct digits anywhere in the game numbers
    guess.forEach(num => {
        if (numCounts[num] && numCounts[num] > 0) {
            correctDigits++;
            numCounts[num]--;
        }
    });

    result['digit'] = correctDigits;

    return result;
};


// Get Random Numbers
router.post(
    '/random-Number',
    async (req, res) => {
        const userId = req.user.id;
        const max = req.body.max;
        // const url = `https://www.random.org/integers/?num=4&min=0&max=${max}&col=1&base=10&format=plain&rnd=new`;
        const url = `https://www.random.org/integers/?num=1&min=0&max=${max}&col=1&base=10&format=plain&rnd=new`; // get only 1 number each time

        // Check the difficulty of game and update the number for scores
        if (max === 8) {
            difficulty = 2;
        } else if (max === 9) {
            difficulty = 3;
        } else {
            difficulty = 1
        }

        let numbers = [];
        try {
            // get reponse
            while (gameNumbers.length < 4) {
                const number = await axios.get(url); // only one number this time
                if (!gameNumbers.includes(number)) {
                    gameNumbers.push(number)
                }
            }
            // Use axios to get the response from Random.org
            const response = await axios.get(url);
            numbers = response.data.trim().split('\n').map(Number);
        } catch (error) {
            // If an error occurs (like no internet), generate numbers locally
            console.error('Failed to fetch random numbers from Random.org, generating locally:', error);
            while (numbers.length < 4) {
                const number = Math.floor(Math.random() * (max + 1)); // max + 1 because the max number is exclusive
                numbers.push(number);
            }
        }


        // Game settings reset
        gameNumbers = numbers;
        rounds = 1;
        hint = false;

        // Add new game to game database
        const game = await Game.creategame({
            userId, difficulty, number: numbers.join(''),
        });

        req.session.gameId = game.id
        res.json(game);
    }
);

// Check the results
router.post(
    '/result',
    async (req, res) => {
        const userId = req.user.id;
        const gameId = req.session.gameId;

        if (rounds > 10) {
            return res.status(400).json({ error: "No attempts left, start a new game." });
        }
        const userGuessObject = Object.values(req.body);
        const userGuess = Object.values(userGuessObject).map(Number)
        if (!userGuess || userGuess.length !== 4) {
            return res.status(400).json({ "error": "Invalid Guess" });
        }
        const result = checkGuess(userGuess, gameNumbers);

        if (result.location === 4 && result.digit === 4) {
            let score = (11 - rounds) * difficulty * 100
            // Add score to database
           await Score.create({
                userId,
                numbers: score
            })
            // Add guess from current game to database
            const guess = await Guess.createguess({
                gameId,
                number: userGuess.join(''),
                location: result.location,
                digit: result.digit,
                round: rounds,
            });
            return res.json({
                id: guess.id,
                location: result.location,
                digit: result.digit,
                gameNumber: gameNumbers.join(''),
                score: score,
                time: guess.time
            })
        } else {
            // Add guesses from current game to database
            const guess = await Guess.createguess({
                gameId,
                number: userGuess.join(''),
                location: result.location,
                digit: result.digit,
                round: rounds
            });
            rounds++;
            return res.json(guess);
        };
    }
);

// Get guess history
router.get(
    '/history',
    async (req, res) => {
        const gameId = req.session.gameId
        const guesses = await Guess.findAll({
            where: {
                gameId: gameId
            }
        })
        res.json(guesses);
    }
);

// Get hint
router.get(
    '/hint',
    async (req, res) => {
        if (hint) {
            return res.status(400).json({ error: "Hint already used." })
        }

        const number = Math.floor(Math.random() * 4);
        hint = true;  // Set this to true so no further hints can be used
        res.json({ index: number, number: gameNumbers[number] });
    }
);

// Get all scores from multiple games
router.get(
    '/total-score',
    async (req, res) => {
        const userId = req.user.id;

        const scores = await Score.findAll({
            where: { userId: userId }
        });

        const totalScore = scores.reduce((acc, cur) => acc + cur.numbers, 0);
        const userName = req.user.username

        return res.json({ [userName]: totalScore })
    }
);

// Get all scores from multiple players
router.get(
    '/all-score',
    async (req, res) => {

        const score = await Score.findAll({
            attributes: ['userId', 'numbers'],
            include: [{
                model: User,
                as: 'Player',
                attributes: ['username']
            }]
        });

        const scores = Object.values(score).map(entry => entry.dataValues);

        const allScores = scores.map(score => {
            return {
                userId: score.userId,
                numbers: score.numbers,
                Player: score.Player.username  // Flattening the object {player: {username: abcde}} => {player: abcde}
            };
        });

        const scoreList = allScores.reduce((acc, { userId, numbers, Player }) => {
            if (acc[userId]) {
                acc[userId].numbers += numbers;  // Add to existing userId's numbers
            } else {
                acc[userId] = { userId, numbers, Player };  // Initialize new userId entry
            }
            return acc;
        }, {});

        const scoreRanking = Object.values(scoreList).sort((a, b) => b.numbers - a.numbers)

        scoreRanking.forEach((score, index) => {
            score.id = index + 1;  // Assign ID starting from 1
        });
        return res.json(scoreRanking)
    }
);

// Get all games from current user
router.get(
    '/all-game',
    async (req, res) => {
        const userId = req.user.id;

        const games = await Game.findAll({
            where: { userId: userId },
            attributes: ['id', 'userId', 'number', 'difficulty', 'solve', 'createdAt'],
        });

        return res.json(games)
    }
);

// Get the fastest game
router.get(
    '/fast-time',
    async (req, res) => {

        const time = await Guess.findAll({
            where: {
                time: {
                    [Sequelize.Op.ne]: null
                },
                location: 4,
                digit: 4
            },
            limit: 10,
            order: [['time', 'ASC']],
            attributes: ['gameId', 'location', 'digit', 'time'],
            include: [{
                model: Game,
                as: 'Games',
                attributes: ['number'],
                include: [{
                    model: User,
                    as: 'Player',
                    attributes: ['username'],
                }]
            }]
        });


        const times = Object.values(time).map(entry => entry.dataValues);

        const allTimes = times.map(time => {
            return {
                userId: time.userId,
                time: time.time,
                location: time.location,
                digit: time.digit,
                Player: time.Games.Player.username,  // Flattening the object {player: {username: abcde}} => {player: abcde}
            };
        });
        allTimes.forEach((score, index) => {
            score.id = index + 1;  // Assign ID starting from 1
        });

        return res.json(allTimes)
    }
);

// Get fewest guess attempts
router.get(
    '/less-round',
    async (req, res) => {

        const round = await Guess.findAll({
            where: { location: 4, digit: 4 },
            order: [['round', 'ASC'],
            ['time', 'DESC']
            ],
            limit: 10,
            include: [{
                model: Game,
                as: 'Games',
                include: [{
                    model: User,
                    as: 'Player',
                    attributes: ['username'] // Only fetch the 'username' attribute
                }]
            }],
        })

        const rounds = Object.values(round).map(entry => entry.dataValues);

        const lessRound = rounds.map(round => {
            return {
                gameId: round.gameId,
                round: round.round,
                time: round.time,
                player: round.Games.Player.username // Flattening the object {player: {username: abcde}} => {player: abcde}
            }
        })

        lessRound.forEach((score, index) => {
            score.id = index + 1;  // Assign ID starting from 1
        });

        return res.json(lessRound)
    }
);

router.get(
    '/:gameId/guess',
    async (req, res) => {

        const gameGuess = await Guess.findAll({
            where: {
                gameId: req.params.gameId
            },
            attributes: ['gameId', 'number', 'location', 'digit', 'round', 'time']
        })
        return res.json(gameGuess)
    }
);

router.put(
    '/win',
    async (req, res) => {
        const gameId = req.session.gameId;
        const solve = req.body.game
        const game = await Game.findByPk(gameId);
        game.solve = solve;
        await game.save();
        res.json(game)
    }
)

router.put(
    '/win-guess',
    async (req, res) => {
        const {id, time}= req.body;
        const guess = await Guess.findByPk(id);
        guess.time = time;
        await guess.save();
        res.json(guess);
    }
)

module.exports = router;
