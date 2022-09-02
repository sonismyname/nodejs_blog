const Tour = require('./../models/tourModel')
class APIFeatures {
    constructor(query, queryStr) {
        this.query = query
        this.queryStr = queryStr
    }


    filter() {
        let queryObject = { ...this.queryStr }
        const excludeField = ["page", "fields", "limit", "sort",]
        excludeField.forEach(field => {
            delete queryObject[field]
        })
        let queryStr = JSON.stringify(queryObject)
        queryStr = queryStr.replace(/\b(gte|lte|lt|gt)\b/g, match => `$${match}`)
        queryObject = JSON.parse(queryStr)
        this.query = Tour.find(queryObject)
        return this
    }

    sort() {
        if (this.queryStr.sort) {
            const orderBy = this.queryStr.sort.split(',').join(' ')
            this.query = this.query.sort(orderBy)
        } else {
            // By default sorting
            this.query = this.query.sort('-createdAt')
        }
        return this
    }
    filterLimit() {
        if (this.queryStr.fields) {
            this.query = this.query.select(this.queryStr.fields.split(',').join(' '))

        } else {
            this.query = this.query.select('-__v')
        }
        return this
    }
    async paginate() {
        const page = this.queryStr.page * 1 || 1
        const limit = this.queryStr.limit * 1 || 100
        const skip = limit * (page - 1)
        // Skip 10 items => page 1: 1-10 items, 2: 11-20
        this.query = this.query.skip(skip).limit(limit)
        if (this.queryStr.page) {
            const numTours = await Tour.countDocuments()
            if (skip >= numTours) {
                // console.log('This page is not exits');
                throw new Error('This page is not exits')
            }
        }
        return this
    }

}

module.exports = APIFeatures