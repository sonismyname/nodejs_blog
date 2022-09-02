const fs = require('fs')
const { request } = require('http')

const APIFeatures = require('./../utils/apiFeature')
// const tours_ = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))
const Tour = require('./../models/tourModel')
const { mainModule } = require('process')
const { response } = require('express')

// Make middleware
// exports.checkId = (req, res, next, val) => {
//     const id = req.params.id
// if(id > tours.length -1)
// {
//     return res.status(404).json({
//         status: "fail",     
//         message: "Invalid id value",
//     })
// }
//     next()
// }

// exports.checkBody = (req, res, next) => {
//     console.log("ERRRRRRRR BODY");
//     if(Object.keys(req.body).length == 0)
//     {
//         return res.status(400).json({
//             status: "fail",
//             message: "Body is empty",
//         })
//     }
//     next()
// }



exports.getAllTours = async (req, res) => {
    // console.log(req.query);
    // console.log(req.query.ratingsAverage);
    //1A. Filtering
    // let queryObject = {...req.query}
    // const excludeField = ["page", "fields", "limit", "sort", ]
    // excludeField.forEach(field => {
    //     delete queryObject[field]
    // })

    try {
        // Cách 1
        // const tours = await Tour.find({
        //     ratingsAverage: {$lte: req.query.ratingsAverage},
        //     difficulty: req.query.difficulty,
        // })
        // Cách 2
        // const tours = await Tour.find()
        //     .where("ratingsAverage")
        //     .lte(4.7)
        //     .where("difficulty")
        //     .equals('easy')

        //1B. Advanced Filtering
        // let queryStr = JSON.stringify(queryObject)
        // queryStr = queryStr.replace(/\b(gte|lte|lt|gt)\b/g, match => `$${match}`)
        // queryObject = JSON.parse(queryStr)
        // {difficulty: 'easy', duration: { $gte: 5}}
        // {difficulty: 'easy', duration: { gte: '5'}}
        // console.log(queryObject);
        // Return query
        // let query = Tour.find(queryObject)
        // Execute query

        //2. Sorting:
        // if (req.query.sort) {
        //     const orderBy = req.query.sort.split(',').join(' ')
        //     query = query.sort(orderBy)
        // } else {
        //     // By default sorting
        //     query = query.sort('-createdAt')
        // }
        //3. Filtering Limit
        // if (req.query.fields) {
        //     query = query.select(req.query.fields.split(',').join(' '))

        // } else {
        //     query = query.select('-__v')
        // }
        //4. Pagination
        // const page = req.query.page * 1 || 1
        // const limit = req.query.limit * 1 || 100
        // const skip = limit * (page - 1)
        // // Skip 10 items => page 1: 1-10 items, 2: 11-20
        // query = query.skip(skip).limit(limit)
        // if (req.query.page) {
        //     const numTours = await Tour.countDocuments()
        //     if (skip >= numTours) {
        //         throw new Error('This page is not exits')
        //     }
        // }
        console.log(1);
        const feature = await new APIFeatures(Tour.find(), req.query).filter().filterLimit().paginate()
        const tours = await feature.query;

        res.status(200).json({
            requestAt: req.timeRequest,
            status: 'success',
            data: {
                tours
            },
            results: tours.length,
        })
    } catch (err) {
        console.log(err.message)
        res.status(400).json({
            status: "fail",
            message: err.message,
        })
    }
}
// Create a new tour
exports.createNewTour = async (req, res) => {
    // console.log(req.body)
    // const newId = tours.length
    // const newTour = Object.assign({id: newId}, req.body)
    // tours.push(newTour) 
    // fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    //     res.status(201).json({
    //         status: "Success",
    //         data: newTour
    //     })
    // })

    // Otherway
    //C1:
    // const newTour = new Tour({})
    // newTour.save().then().catch()
    //C2:
    try {
        const newTour = await Tour.create(req.body)
        res.status(201).json({
            status: "Success",
            data: newTour
        })
    }
    catch (e) {
        console.log('ERRRRRRRR HandleWrapper');
        console.log(e.message);
        res.status(404).json({
            status: "failed",
            message: e
        })
    }
}
// Update tour information
exports.updateTour = async (req, res) => {
    const id = req.params.id

    // const tour = tours.find(t => t.id==id)
    //We need to send real data here 
    // tour.addKey = "I try to patch here"
    // // ----------------------------------------------------------------
    // fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    //     res.status(201).json({
    //         status: "success to update",
    //         data: tour,
    //     })
    // })
    // New way
    try {
        const tour = await Tour.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        })
        res.status(200).json({
            status: 'success',
            tour: tour,
        })
    } catch (err) {
        res.status(404).json({
            status: "failed",
            message: err.message
        })
    }
}
// Get one tour
exports.getTour = async (req, res) => {
    //parameters with be in req.params

    // const id = req.params.id

    // const tour = tours.find(t => t.id==id)
    // res.status(200).json({
    // status: "Success",
    // data: tour,
    // })
    // New way

    try {
        const tour = await Tour.findById(req.params.id)
        res.status(200).json({
            status: "Success",
            data: tour,
        })
    } catch (e) {
        res.status(404).json({
            status: "failed",
            message: exports.message
        })
    }
}
// Delete one tour
exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id, {

        })
        res.status(204).json({
            status: "delete success",
            data: null

        })
    } catch (e) {
        res.status(404).json({
            status: "failed",
            message: e.message,
        })
    }
}
// add doccuments to tours
// exports.addAllTours = async (req, res) => {
//     const token = '1234'
//     if (req.params.token === token){
//         // add tours
//         console.log(tours_)
//         Tour.
//         res.status(200).json({
//             status: "success",
//             message: "Not"
//         })
//     }
// }
// Cách 1: get top 5
exports.getTop5 = async (req, res) => {
    // const filter = req.query.sort.split(',').join(' ')


    // const query = await Tour.find()
    try {
        let query = Tour.find()
        query = query.sort('-ratingsAverage price')
        query = query.limit(5)
        const tours = await query

        res.status(200).json({
            status: "success ",
            results: tours.length,
            data: {
                tours: tours,
            }
        })
    } catch (err) {
        console.log(err.message);
        res.status(404).json({
            status: "failed",
            message: err.message,
        })
    }
}
// Cách 2 get top 5:
exports.getTop5Middleware = (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage,price'
    next()
}

exports.getTourStats = async (req, res) => {
    try{
        const stats = await Tour.aggregate([
            {$match: {ratingsAverage: {$gte: 4.5}}},  
            {
                $group: {
                    _id: '$difficulty',
                    num: {$sum: 1},
                    avgRating: { $avg: '$ratingsAverage'},
                    avgPrice: { $avg: '$price'},
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price'},
                }
            },
            {
                $sort: {
                    avgPrice: 1
                },
                // $match: {
                //     _id: { _id: {$ne: 'easy'}}
                // }
            }
        ])
        res.status(200).json({
            status: 'OK',
            data: {
                stats
            }
        })
    } catch (err) {
        console.log(err.message);
        res.status(404).json({
            status: "failed",
            message: err.message,
        })
    }
}

exports.getMonthlyPlan = async (req, res) => {
    try{
        const year = req.params.year * 1 || 2021
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates',
            },
            {
                $match: {
                    startDates: { 
                        $gt: new Date(`${year}-01-01`),
                         $lt: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates'},
                    numTourStarts: { $sum: 1},
                    tours: { $push: '$name'}
                }
            },
            {
                $sort: {
                    _id: 1
                }
            },
            {
                $addFields: { month: '$_id'}
            },
            {
                $project: {
                    _id: 0, // id is not show up
                }
            }
        ])

        res.status(200).json({
            status: 'OK',
            result: plan.length,
            data: {
                plan
            }
        })
    } catch (err) {
        console.log(err.message);
        res.status(404).json({
            status: "failed",
            message: err.message,
        })
    }
}