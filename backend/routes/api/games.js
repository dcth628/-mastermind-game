const express = require('express')
const axios = require('axios');
const { Op } = require('sequelize')
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth')
const { Spot, User, Image, Review, Booking, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const e = require('express');
const router = express.Router();

// const validateCreatebooking = [
//     check('endDate')
//         .exists()
//         .isBefore('startDate')
//         .withMessage('endDate cannot be on or before startDate'),
//     check('endDate')
//         .exists()
//         .isAfter('startDate')
//         .withMessage('startDate cannot be on or after endDate'),
//     handleValidationErrors
// ]


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
    let remainingSecret = [];

    // First pass: Check for correct numbers in the correct positions
    for (let i = 0; i < guess.length; i++) {
        if (guess[i] === gameNumbers[i]) {
            correct++;
        } else {
            remainingGuess.push(guess[i]);
            remainingSecret.push(gameNumbers[i]);
        }
    }

    // Second pass: Check for correct numbers in the wrong positions
    for (let digit of remainingGuess) {
        const index = remainingSecret.indexOf(digit);
        if (index !== -1) {
            misplaced++;
            remainingSecret.splice(index, 1); // Remove the matched element to prevent reuse
        }
    }

    // console.log(remainingGuess)
    // console.log(remainingSecret)
    return { correct, misplaced };
}


// Get Random Numbers
router.post(
    '/random-Number',
    async (req, res) => {
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
        res.json(gameNumbers);
    }
)


// Check the results
router.post(
    '/result',
    async (req, res) => {
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
        rounds--;

        console.log(difficulty)
        if (Object.values(result)[0] === 4) {
            let score = rounds * difficulty * 100
            return res.json(`congrats! You won. The number is ${gameNumbers.join('')}. Your scor is ${score}!`)
        }

        return res.json({ result, rounds });
    }
)

// Get guess history
router.get(
    '/history',
    async (req, res) => {
        res.json({ history: guessHistory });
    }
)

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
)
// Get all spots
router.get(
    '/',
    async (req, res) => {
        let { page, size } = req.query;

        page = Number(page);
        size = Number(size);

        if (Number.isNaN(page)) page = 1;
        if (Number.isNaN(size)) size = 20

        if (page <= 0) {
            return res.status(400).json({
                "message": "Validation Error",
                "statusCode": 400,
                "errors": {
                    "page": "Page must be greater than or equal to 1"
                }
            })
        }
        if (size <= 0) {

            return res.status(400).json({
                "message": "Validation Error",
                "statusCode": 400,
                "errors": {
                    "size": "Size must be greater than or equal to 1"
                }
            })
        }

        const spots = await Spot.findAll({
            limit: size,
            offset: size * (page - 1)
        })

        for await (let spot of spots) {
            const previewImage = await Image.findOne({
                where: {
                    imageId: spot.id,
                    preview: true,
                    imageType: "Spot"
                }
            });
            if (previewImage && !spot.previewImage) {
                spot.previewImage = previewImage.url
            } else if (!previewImage && !spot.previewImage) {
                spot.previewImage = "None"
            } else {
                spot.previewImage = spot.previewImage
            }

            const rating = await Review.findAll({
                where: { spotId: spot.id }
            })

            let sum = 0;

            if (rating.length) {
                rating.forEach(rating => {
                    sum += rating.stars
                });
                let avg = sum / rating.length;

                spot.avgRating = avg
            } else {
                spot.avgRating = 0
            }
        }

        res.json({
            Spots: spots, page, size
        })
    }
)

// Get all spots owned by the current user
router.get(
    '/current',
    requireAuth,
    async (req, res) => {
        const { user } = req;
        const spots = await Spot.findAll({
            where: {
                ownerId: user.id
            },
            attributes: {
                include: [
                    // [
                    //     sequelize.fn('AVG', sequelize.col("Reviews.stars")),
                    //     "avgRating"
                    // ],
                    // [
                    //     sequelize.fn('COALESCE', sequelize.col("Images.url")),
                    //     "previewImage"
                    // ]
                ],
            },
            include: [
                // { model: Review, attributes: [] },
                // { model: Image, as: "ReviewImages"}
            ]
        })
        for await (let spot of spots) {
            const previewImage = await Image.findOne({
                where: {
                    imageId: spot.id,
                    preview: true,
                    imageType: "Spot"
                }
            });
            if (previewImage && !spot.previewImage) {
                spot.previewImage = previewImage.url
            } else if (!previewImage && !spot.previewImage) {
                spot.previewImage = "None"
            } else {
                spot.previewImage = spot.previewImage
            }

            const rating = await Review.findAll({
                where: { spotId: spot.id }
            })

            let sum = 0;

            if (rating.length) {
                rating.forEach(rating => {
                    sum += rating.stars
                });
                let avg = sum / rating.length;

                spot.avgRating = avg
            } else {
                spot.avgRating = 0
            }
        }
        if (!spots.length) {
            res.status(404);
            return res.json({
                message: "Spot couldn't be found",
                stateCode: 404
            })
        }
        res.json({ Spots: spots })
    }
)

// Get details of a spot from an id
router.get(
    '/:spotId',
    async (req, res) => {

        const spot = await Spot.findByPk(req.params.spotId, {
            attributes: {
                include: [
                    // [
                    //     sequelize.fn('AVG', sequelize.col("Reviews.stars")),
                    //     "avgRating"
                    // ],
                    [
                        sequelize.fn('COUNT', sequelize.col("Reviews.id")),
                        "numReviews"
                    ]
                ],
                exclude: ['ReviewImages']
            },
            include: [
                // { model: Image, as: "ReviewImages" },
                { model: User, as: "Owner" },
                { model: Review }
            ]
        });

        if (spot) {
            const previewImage = await Image.findOne({
                where: {
                    imageId: req.params.spotId,
                    preview: true,
                    imageType: "Spot"
                }
            });


            spot.dataValues.SpotImages = []
            const allImages = await Image.findAll({
                where: {
                    imageId: req.params.spotId,
                    imageType: "Spot"
                }
            })
            spot.dataValues.SpotImages = [...allImages]


            if (previewImage && !spot.previewImage) {
                spot.previewImage = previewImage.url
                // spot.dataValues.SpotImages.push(previewImage.url)
            } else if (!previewImage && !spot.previewImage) {
                spot.previewImage = "None"
            } else {
                spot.previewImage = spot.previewImage
            }

            const rating = await Review.findAll({
                where: { spotId: req.params.spotId }
            })

            let sum = 0;

            if (rating.length) {
                rating.forEach(rating => {
                    sum += rating.stars
                });
                let avg = sum / rating.length;

                spot.avgRating = avg
            } else {
                spot.avgRating = 0
            }
        }

        if (spot.id === null) {

            res.status(404);
            return res.json({
                message: "Spot couldn't be found",
                stateCode: 404
            })
        }
        res.json(spot);
    }
);

// Create a spot
router.post(
    '/',
    async (req, res) => {
        const userId = req.user.id
        const {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
            ownerId = userId,
            previewImage
        } = req.body;
        const spot = await Spot.createspot({
            ownerId, address, city, state, country, lat, lng, name, description, price, previewImage
        });

        spot.dataValues.previewImage = previewImage

        return res.status(201).json(spot)
    }
)

// Delete a spot by spotId
router.delete(
    '/:spotId',
    requireAuth,
    async (req, res) => {
        const spot = await Spot.findByPk(req.params.spotId);
        if (!spot) {
            res.status(404);
            return res.json({ message: 'Spot not found' })
        }
        if (req.user.id !== spot.ownerId) {
            const err = new Error('Forbidden')
            res.status(403);
            res.json({
                message: err.message,
                statusCode: 403
            })
        }

        await spot.destroy();
        return res.status(200).json(spot)
    }

)

// Edit a spot
router.put(
    '/:spotId',
    async (req, res) => {
        const { address, city, state, country, lat, lng, name, description, price, previewImage } = req.body;
        const spot = await Spot.scope("currentSpot").findByPk(req.params.spotId);
        if (!spot) res.status(404).json({ message: "Spot couldn't be found" });
        spot.address = address;
        spot.city = city;
        spot.state = state;
        spot.country = country;
        spot.lat = lat;
        spot.lng = lng;
        spot.name = name;
        spot.description = description;
        spot.price = price;
        spot.previewImage = previewImage;
        spot.dataValues.previewImage = previewImage;
        await spot.save();
        res.json(spot)
    }
)

// Add a image to a spot by spotId
router.post(
    '/:spotId/images',
    async (req, res) => {
        const spot = await Spot.findByPk(req.params.spotId);
        if (!spot) {
            res.status(404);
            return res.json({
                message: "Spot couldn't be found",
                stateCode: 404
            })
        }
        const {
            url,
            preview,
        } = req.body;
        const image = await Image.create({
            url, preview,
            imageId: req.params.spotId,
            imageType: "Spot"
        })
        const resObject = {
            id: image.id,
            url: image.url,
            preview: image.preview
        }
        return res.status(201).json(resObject)
    }
)

// Get all reviews by a spotId
router.get(
    '/:spotId/reviews',
    async (req, res) => {
        const spotReview = await Review.findAll({
            where: {
                spotId: req.params.spotId
            },
            include: [{
                model: User,
                attributes: { exclude: ['username', 'email', 'hashedPassword', 'createdAt', 'updatedAt'] }
            }, {
                model: Image, as: "ReviewImages",
                attributes: { exclude: ['imageType', 'imageId', 'preview', 'createdAt', 'updatedAt'] }
            }]
        });
        if (!spotReview.length) {
            res.status(404);
            return res.json({
                message: "Spot couldn't be found",
                statusCode: 404
            })
        }
        res.json({ Reviews: spotReview })
    }
)

// Create a review for a spot by spotId
router.post(
    '/:spotId/reviews',
    async (req, res) => {
        const spot = await Spot.findByPk(req.params.spotId);
        if (!spot) {
            res.status(404);
            return res.json({
                message: "Spot couldn't be found",
                statusCode: 404
            })
        }
        const userId = await Review.findOne({
            where: { userId: req.user.id },
            include: [{
                model: Spot,
                where: { id: req.params.spotId }
            }]
        })
        if (userId) {
            const err = new Error('User already has a review for this spot')
            res.status(403).json({
                message: err.message,
                statusCode: 403,
            })
        }

        const { review, stars } = req.body;
        const newReview = await Review.create({
            userId: req.user.id,
            spotId: req.params.spotId,
            review, stars
        })
        return res.status(201).json(newReview)
    }
)


//Get all bookings by spotId
router.get(
    '/:spotId/bookings',
    async (req, res) => {

        const spot = await Spot.findByPk(req.params.spotId)
        if (!spot) {
            res.status(404).json({
                message: "Spot couldn't be found",
                statusCode: 404
            })
        }
        if (spot.ownerId === req.user.id) {
            const bookings = await Booking.findAll({
                where: {
                    spotId: req.params.spotId,
                    userId: req.user.id
                },
                include: {
                    model: User,
                    attributes: { exclude: ['username', 'email', 'hashedPassword', 'createdAt', 'updatedAt'] }
                },
            })
            return res.status(200).json({ Bookings: bookings })
        } else {
            const bookings = await Booking.findAll({
                where: {
                    spotId: req.params.spotId,
                },
                attributes: {
                    exclude: ['id', 'userId', 'createdAt', 'updatedAt']
                }
            })
            return res.status(200).json({ Bookings: bookings })
        }
    }
)

//Create a bookings by spotId
router.post(
    '/:spotId/bookings',
    // validateCreatebooking,
    async (req, res) => {
        const { startDate, endDate } = req.body;

        const start = new Date(startDate);
        const end = new Date(endDate);

        const spot = await Spot.findByPk(req.params.spotId);


        if (!spot) {
            return res.status(404).json({
                message: "Spot couldn't be found",
                statusCode: 404
            })
        };
        if (start >= end) {
            return res.status(400).json({
                message: "Validation error",
                statusCode: 400,
                error: ["endDate cannot be on or before startDate"]
            })
        }

        const bookings = await Booking.findAll({
            include: {
                model: Spot,
                where: {
                    id: req.params.spotId
                }
            }
        })

        // const flag = true;

        // bookings.forEach(booking => {
        //     if (start.getTime() <= booking.startDate.getTime() && booking.endDate.getTime() <= end.getTime()) {
        //         flag = false;
        //     } else if (booking.startDate.getTime() <= start.getTime() && booking.endDate.getTime() <= end.getTime()) {
        //         flag = false;
        //     } else if (booking.startDate.getTime() <= end.getTime() && end.getTime() <= booking.endDate.getTime()) {
        //         flag = false;
        //     } else if (booking.startDate.getTime() <= start.getTime() && start.getTime() <= booking.endDate.getTime()) {
        //         flag = false;
        //     }
        // })
        const checkDate = bookings.some(booking =>
            start.getTime() <= booking.startDate.getTime() && booking.startDate.getTime() <= end.getTime() ||
            booking.startDate.getTime() <= start.getTime() && end.getTime() <= booking.endDate.getTime() ||
            start.getTime() <= booking.endDate.getTime() && booking.endDate.getTime() <= end.getTime() ||
            start.getTime() <= booking.startDate.getTime() && booking.endDate.getTime() <= end.getTime()
        )

        if (!checkDate) {
            const booking = await Booking.create({
                spotId: req.params.spotId,
                userId: req.user.id,
                startDate, endDate,
            })
            return res.status(201).json(booking)
        } else {
            return res.status(403).json({
                message: 'Sorry, this spot is already booked for the specified dates',
                statusCode: 403,
                errors: [
                    "Start date conflicts with an existing booking",
                    "End date conflicts with an existing booking"
                ]
            })
        }
        // } else if (start.getTime() === booking.startDate.getTime() || end.getTime() === booking.endDate.getTime()) {
        //     return res.status(403).json({
        //         message: 'Sorry, this spot is already booked for the specified dates',
        //         statusCode: 403,
        //         errors: [
        //             "Start date conflicts with an existing booking",
        //             "End date conflicts with an existing booking"
        //         ]
        //     })
        // }
        // else {
        //     const booking = await Booking.create({
        //         spotId: req.params.spotId,
        //         userId: req.user.id,
        //         startDate, endDate
        //     })

        //     return res.status(201).json(booking)
        // }
    }
)

// Delete a spot image
// router.delete(
//     '/spot-images/:spotImageId',
//     async (req, res) => {
//         const image = await Image.findOne({
//             where: {
//                 imageId: req.params.spotImageId,
//                 imageType: "Spot"
//             },
//             include: {
//                 model: Spot, where: { id: req.params.spotImageId }
//             }
//         });
//         if (!image) {
//             return res.status(404).json({
//                 message: "Spot Image couldn't be found",
//                 statusCode: 404
//             })
//         } else {
//             await image.destroy();
//             return res.status(200).json({
//                 message: "Successfully deleted",
//                 statusCode: 200
//             })
//         }
//     }
// )



module.exports = router;
