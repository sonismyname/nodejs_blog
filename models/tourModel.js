const mongoose = require('mongoose')

// Make schema
const tourSchema = new mongoose.Schema({ 
    name: { type: String,
            required: [true, 'tour must have a name'],
            unique: true,
        },
    maxGroupSize: { 
        type: String,
        required: [true, 'max group size must be existing'],
    },
    secretTour: {
        type: Boolean,
        default: false,
    },
    duration: { 
        type: Number,
        required: [true, 'duration must be a duration'],
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficulty'],
            message: 'need to choose in those values ...'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 0,
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: [true, 'message when it\'s empty'],
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function(val){
                return val < this.price 
                // if priceDiscount > price 
            },
            message: 'Discount price ({VALUE}) should be ...'
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'summary when it\'s empty'],
    },
    description: {  type: String, trim: true},
    imageCover: {
        type: String,
        required: [true, 'A tour must have a imageCover']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false,
    },
    startDates:[Date],
}, {
    toJSON: { virtuals: true},
    toObject: { virtuals: false}, 
})

tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7
})
// Middleware doccuments; run before save command and create
tourSchema.pre('save', function(next){
    // console.log(this)
    // Can config property here
    next()
})
tourSchema.post('save', function(doc, next){
    // doc is doccument has just saved
    next()
})

tourSchema.pre(/^find/, function(next){
    this.find({secretTour: {$ne: true}})
    next()
})
// Middlewave aggregate
tourSchema.pre('aggregate', function(next){
    //this.pipeline.unshift({})
    // Add to aggregate pipeline
    // console.log(this.pipeline());
    next()
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour