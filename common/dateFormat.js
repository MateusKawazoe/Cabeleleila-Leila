exports.formatarData = function (data) {
    var date = new Date(data)
    var year = date.getFullYear()
    var day = date.getDate()
    var mounth = date.getMonth()

    if (day < 10) {
        day = '0' + day
    }

    if (mounth < 10) {
        mounth = '0' + (mounth + 1)
    }

    return day + '/' + mounth + '/' + year
}