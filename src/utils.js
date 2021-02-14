//return an array with the start and end number in minutes
const dateToMinutes = (date) => {
    const [day, startHours, startMinutes, endHours, endMinutes] = date.split(/ |:|-/)
    let daysNumber = 1440 * day //1440 is the number of minutes in a day

    //add days hours and minutes to get a number of minutes
    let startDateMinutes = daysNumber + (startHours * 60) + Number(startMinutes)
    let endDateMinutes = daysNumber + (endHours * 60) + Number(endMinutes)
    return [startDateMinutes, endDateMinutes]
}

//take an array of minutes in entry and return a date (string)
const minutesToDate = (minutes) => {
    let dayNumber = Math.floor(minutes[0] / 1440)

    let startHours = Math.floor((minutes[0] - 1440 * dayNumber) / 60)
    let startMinutes = minutes[0] - 1440 * dayNumber - startHours * 60

    let endHours = Math.floor((minutes[1] - 1440 * dayNumber) / 60)
    let endMinutes = minutes[1] - 1440 * dayNumber - endHours * 60

    let isOneNumber = (number) => number < 10 ? `0${number}` : number

    return `${dayNumber} ${isOneNumber(startHours)}:${isOneNumber(startMinutes)}-${isOneNumber(endHours)}:${isOneNumber(endMinutes)}`
}

module.exports = {
    minutesToDate,
    dateToMinutes,
}