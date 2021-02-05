exports.formatarData = function (data) {
    var date = new Date(data)
    var fullDate = {
        year: date.getFullYear(),
        day: date.getDate(),
        mounth = date.getMonth(),
        hour = date.getHours(),
        minute = date.getMinutes()
    }

    if (fullDate.day < 10) {
        fullDate.day = '0' + fullDate.day
    }

    if (fullDatemounth < 10) {
        fullDatemounth = '0' + (fullDatemounth + 1)
    }

    return {
        date: fullDate.day + '/' + fullDate.mounth + '/' + fullDate.year,
        hour: fullDate.hour + ':' + fullDate.minute
    }
}