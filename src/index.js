const fs = require('fs')
const config = require('../config.js') 
const {getSchedule} = require('./scheduleFunctions')

const RetrieveData = () => {
    try {
        let file = fs.readFileSync(`data/input${config.inputFileNumber || '1'}.txt`, 'utf-8')
        return file
    } catch (err) {
        throw new Error("can't retrieve data from file")
    }
}

let file = RetrieveData()
let schedule = getSchedule(file)
console.log(typeof schedule)