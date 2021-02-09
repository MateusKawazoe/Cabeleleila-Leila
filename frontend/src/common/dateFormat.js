exports.formatarData = function (data) {
    var date = new Date(data)
    var fullDate = {
        year: date.getFullYear(),
        day: date.getDate(),
        month: date.getMonth(),
        hour: date.getHours(),
        minute: date.getMinutes()
    }

    if (fullDate.day < 10) {
        fullDate.day = '0' + fullDate.day
    }

    if (fullDate.month< 10) {
        fullDate.month = '0' + (fullDate.month + 1)
    }

    return {
        date: fullDate.day + '/' + fullDate.month + '/' + fullDate.year,
        hour: fullDate.hour + ':' + fullDate.minute
    }
}

exports.formatarDia = function (dia) {
    if(dia < 10) 
        return '0' + dia
    
        return dia
}

exports.formatarMes = function (mes) {
    if(mes < 10) 
        return '0' + mes
    
        return mes
}