const moment = require('moment')

module.exports.getDates = (startDate, startTime, endTime, interval) => {
    let dateMap = {};
    let currentDate = moment(startDate);
    let stopDate = moment(currentDate).add(3, 'days');
    let timeSlots = getTimeSlots(startTime, endTime, interval)
    while (currentDate <= stopDate) {
        let date_key = moment(currentDate).format('YYYY-MM-DD')
        dateMap[date_key] = timeSlots
        currentDate = moment(currentDate).add(1, 'days');
    }
    console.log(dateMap)
    return dateMap;
}

getTimeSlots = (startTime, endTime, interval) => {
    let timeSlots = []
    startTime = startTime.split(':')
    endTime = endTime.split(':')
    
    let startTimeHrs = parseInt(startTime[0])
    let startTimeMin = parseInt(startTime[1])

    let endTimeHrs = parseInt(endTime[0])
    let endTimeMin = parseInt(endTime[1])

    if(endTimeHrs < startTimeHrs){
        console.log(error)
    }

    while((startTimeHrs*100 + startTimeMin) < (endTimeHrs*100 + endTimeMin)){
        let timeSlotEndMin = startTimeMin + interval % 60
        let timeSlotEndHrs = startTimeHrs + parseInt(interval/60)
        if(timeSlotEndMin >= 60){
            timeSlotEndHrs = timeSlotEndHrs + 1
            timeSlotEndMin = timeSlotEndMin % 60
        }

        let startSlotTimeHrs = startTimeHrs == 0 ? `${startTimeHrs}0` : `${startTimeHrs}`
        let startSlotTimeMin = startTimeMin == 0 ? `${startTimeMin}0` : `${startTimeMin}`
        
        let endSlotTimeHrs = timeSlotEndHrs == 0 ? `${timeSlotEndHrs}0` : `${timeSlotEndHrs}`
        let endSlotTimeMin = timeSlotEndMin == 0 ? `${timeSlotEndMin}0` : `${timeSlotEndMin}`

        timeSlots.push(`${startSlotTimeHrs}:${startSlotTimeMin} - ${endSlotTimeHrs}:${endSlotTimeMin}`) 
        startTimeHrs = timeSlotEndHrs
        startTimeMin = timeSlotEndMin
    }
    return timeSlots
}