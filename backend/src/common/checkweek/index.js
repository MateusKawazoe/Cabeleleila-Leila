module.exports = function check(date, date2) {
    daySubtraction = date.getDate() - new Date(date2).getDate()
    weekDaySubtraction = date.getDay() - new Date(date2).getDay()

    if (date.getMonth() != new Date(date2).getMonth()  || date.getYear() != new Date(date2).getYear()) 
        return false
    else if (daySubtraction < 7 || daySubtraction > -7) {
        if(daySubtraction == weekDaySubtraction) {
            return true
        }
    }
    return false
}