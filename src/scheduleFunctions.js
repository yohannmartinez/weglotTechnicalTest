const { minutesToDate, dateToMinutes } = require('./utils')

const getSchedule = (peoplesMeetings) => {
    let jobHours = "1 08:00-17:59\n2 08:00-17:59\n3 08:00-17:59\n4 08:00-17:59\n5 08:00-17:59"
    let splitMeetings = peoplesMeetings.split(/\n/)
    let splitJobHours = jobHours.split(/\n/)

    let meetingsInMinutes = splitMeetings.map((meeting) => dateToMinutes(meeting))
    let jobHoursInMinutes = splitJobHours.map((jobHour) => dateToMinutes(jobHour))
    let schedule = findDisponibility(meetingsInMinutes, jobHoursInMinutes)
    return schedule
}

const findDisponibility = (poepleMeetingsInMinutes, jobHoursInMinutes) => {
    let sortedMeetings = poepleMeetingsInMinutes.sort((a, b) => a[0] - b[0])
    let meetingsByDay = getMeetingsByDay(sortedMeetings, jobHoursInMinutes)
    let mergedMeetings = mergeMeetings(meetingsByDay)
    let earliestSchedule = getEarliestSchedule(mergedMeetings, jobHoursInMinutes)
    return earliestSchedule
}

//return an array of days with corresponding meetings in
const getMeetingsByDay = (meetings, jobHours) => {
    let daysIntervals = [[], [], [], [], []]

    for (let i = 0; i < daysIntervals.length;) {
        for (let j = 0; j < meetings.length;) {
            if (meetings[j][0] >= jobHours[i][0] && meetings[j][0] <= jobHours[i][1]) {
                daysIntervals[i].push(meetings[j])
            }
            j++
        }
        i++
    }
    return daysIntervals
}

//remove the meetings who finish before an other meeting
const mergeMeetings = (meetingsByDay) => {
    return meetingsByDay.map((dayMeetings) =>
        dayMeetings.reduce((mergedMeetings, meeting) => {
            if (mergedMeetings.findIndex((item) => item[1] > meeting[1]) === -1) {
                mergedMeetings.push(meeting)
            }
            return mergedMeetings
        }, [])
    )
}

const getEarliestSchedule = (meetingsByDay, jobDaysHours) => {
    let possibilities = []

    meetingsByDay.map((dayMeetings, dayIndex) => {
        let meetingsOfDay = dayMeetings
        //add the working hours to each day
        meetingsOfDay.unshift([0, jobDaysHours[dayIndex][0]])
        meetingsOfDay.push([jobDaysHours[dayIndex][1], jobDaysHours[dayIndex][1] + 1 ])
        
        meetingsOfDay.map((meeting, meetingIndex)=>{
            //if there is 60 minutes after the start of the working time, put a meet just after it
            if(meetingIndex === 0 && meeting[1] + 60 <= meetingsOfDay[meetingIndex + 1][0]) { possibilities.push([meeting[1] , meeting[1] + 59]) }
            //if there is 60 minutes between the current meeting and the previous, schedule a meet after the end of the previous meeting
            if(meetingIndex !== meetingsOfDay.length - 1 && meetingIndex !== 0 && meeting[0] - 60 >= meetingsOfDay[meetingIndex - 1][1]){ possibilities.push([meetingsOfDay[meetingIndex - 1][1] + 1, meetingsOfDay[meetingIndex - 1][1] + 60]) }
            //if there is 60 minutes between the current meeting and the next, schedule a meet after the end of the current meeting
            if(meetingIndex !== meetingsOfDay.length - 1 && meetingIndex !== 0 && meeting[1] + 60 <= meetingsOfDay[meetingIndex + 1][0]){ possibilities.push([meeting[1] + 1, meeting[1] + 60]) }
            //if there is 60 minutes before the end of the working time, put a meet after the last meeting of the day
            if(meetingIndex === meetingsOfDay.length - 1 && meeting[0] - 60 >= meetingsOfDay[meetingIndex - 1][1]){possibilities.push([meetingsOfDay[meetingIndex - 1][1] + 1, meetingsOfDay[meetingIndex - 1][1] + 60]) }
        })
    })

    return possibilities.length === 0 ? "there is no possibility to schedule a meet" : minutesToDate(possibilities[0])
}

module.exports = { getSchedule }