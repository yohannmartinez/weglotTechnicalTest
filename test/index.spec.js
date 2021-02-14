const fs = require('fs')
const path = require('path');
const {getSchedule} = require('../src/scheduleFunctions')
const {inputsLength} = require('../config')

describe('check if input equals output', () => {
    //before running test be sure to put the right number of inputs files in config
    let inputs
    let outputs
    beforeAll(async () => {
        try {
            const directoryPath = path.join(__dirname, '../data');
            const filesList = await fs.readdirSync(directoryPath, (err, files) => err ? console.log("can't found data",err) : files)
            const files = await Promise.all(filesList.map(path => fs.readFileSync(`data/${path}`, { encoding: 'utf8' })))
            inputs = [...files]
            outputs = inputs.splice(filesList.length / 2, filesList.length / 2)
        } catch(err) {
            console.error(err)
        }
    });


    for (let i = 0; i < inputsLength; i++) {
        test(`file ${i + 1}`, () => {
            const result = getSchedule(inputs[i])
            expect([result].toString()).toEqual(outputs[i]);
        });
    }
})