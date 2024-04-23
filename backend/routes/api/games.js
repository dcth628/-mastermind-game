const express = require('express')
const axios = require('axios');
const session = require('express-session');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth')
const { Game, User, Guess, Score, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
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
let rounds = 10;
// Store the guess history
let guessHistory = [];
// Set hint usage
let hint = false;
// Set Difficulty
let difficulty = 1;

function checkGuess(guess, gameNumbers) {
    let correct = 0;
    let misplaced = 0;

    // Use arrays to keep track of numbers that have been successfully matched,
    // to ensure they aren't reused in the misplaced count.
    let remainingGuess = [];
    let remainingNumbers = [];

    // First pass: Check for correct numbers in the correct positions
    for (let i = 0; i < guess.length; i++) {
        if (guess[i] === gameNumbers[i]) {
            correct++;
        } else {
            remainingGuess.push(guess[i]);
            remainingNumbers.push(gameNumbers[i]);
        }
    }

    // Second pass: Check for correct numbers in the wrong positions
    for (let digit of remainingGuess) {
        const index = remainingNumbers.indexOf(digit);
        if (index !== -1) {
            misplaced++;
            remainingNumbers.splice(index, 1); // Remove the matched element to prevent reuse
        }
    }

    return { correct, misplaced };
};


// Get Random Numbers
router.post(
    '/random-Number',
    async (req, res) => {
        const userId = req.user.id;
        const max = req.body.max ? parseInt(req.body.max, 10) : 7;
        const url = `https://www.random.org/integers/?num=4&min=0&max=${max}&col=1&base=10&format=plain&rnd=new`;
        // Check the difficulty of game and update the number for scores
        if (max === 8) {
            difficulty = 2;
        } else if (max === 9) {
            difficulty = 3;
        }

        let numbers = [];
        try {
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
        rounds = 10;
        guessHistory = [];
        hint = false;

        // Add new game to game database
        const game = await Game.creategame({
            userId, difficulty, number: numbers.join('')
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

        if (rounds <= 0) {
            return res.status(400).json({ error: "No attempts left, start a new game." });
        }
        const userGuessObject = req.body;
        const userGuess = Object.values(userGuessObject).map(Number)
        if (!userGuess || userGuess.length !== 4) {
            return res.status(400).json({ "error": "Invalid Guess" });
        }
        let times = guessHistory.length + 1;
        const result = checkGuess(userGuess, gameNumbers);
        guessHistory.push({ [times]: userGuess, result, rounds })

        // Add guesses from current game to database
        const guess = await Guess.createguess({
            gameId,
            number: userGuess.join(''),
            correct: result.correct,
            misplaced: result.misplaced,
            round: rounds
        });

        rounds--;

        if (Object.values(result)[0] === 4) {
            let score = rounds * difficulty * 100
            const scores = await Score.create({
                userId, numbers: score
            })
            return res.json(`congrats! You won. The number is ${gameNumbers.join('')}. Your scor is ${score}!`)
        };

        return res.json(guess);
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
        console.log(guesses)
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
        //
        const number = Math.floor(Math.random() * 4);
        hint = true;  // Set this to true so no further hints can be used

        console.log(Math.random())
        res.json({ hint: `The place of ${number + 1} number is ${gameNumbers[number]}.` });
    }
);

// Get all scores from multiple games
router.get(
    '/total-score',
    async (req, res) => {
        const userId = req.user.id;

        const scores = await Score.findAll({
            where: {userId: userId}
        });

        const totalScore = scores.reduce((acc, cur) => acc + cur.numbers, 0);
        const userName = req.user.username

        return res.json({[userName]: totalScore})
    }
)

// Get all scores from multiple players
router.get(
    '/all-score',
    async (req, res) => {

        const score = await Score.findAll({
            attributes: [ 'userId', 'numbers'],
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

        const scoreList = allScores.reduce((acc, {userId, numbers, Player}) => {
            if (acc[userId]) {
                acc[userId].numbers += numbers;  // Add to existing userId's numbers
              } else {
                acc[userId] = { userId, numbers, Player };  // Initialize new userId entry
              }
              return acc;
        }, {});

        const scoreRanking = Object.values(scoreList).sort((a, b) => b.numbers - a.numbers)

        return res.json(scoreRanking)
    }
)

module.exports = router;
