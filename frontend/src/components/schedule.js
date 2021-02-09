import React, {
    useState,
    useEffect
} from 'react'
import {
    useSelector
} from 'react-redux'
import '../style/schedule.css'
import logo from '../images/logo.svg'
import api from '../service/api'
import Swal from 'sweetalert2'
import { Table } from 'react-bootstrap'
import $ from 'jquery'
import 'bootstrap/dist/css/bootstrap.min.css'
import {
    formatarDia,
    formatarMes
} from '../common/dateFormat'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import DateTimePicker from 'react-datetime-picker'
import "react-datepicker/dist/react-datepicker.css"

export default function Schedule() {
    const [columns, setColumns] = useState([])
    const [day, setDay] = useState([])
    const [index, setIndex] = useState((Array.from({length: 8},()=> Array.from({length: 7}, () => ''))))
    const [indexLoad, setIndexLoad] = useState([])
    const lines = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00']
    const [data, setData] = useState((Array.from({length: 8},()=> Array.from({length: 7}, () => ''))))
    const [dataLoad, setDataLoad] = useState([])
    const [scheduleData, setSchedule] = useState('')
    const [service, setService] = useState([])
    const [clerk, setClerk] = useState([])
    const [defaultService, setDefaultService] = useState('')
    const [defaultClerk, setDefaultClerk] = useState('')
    const [date, setDate] = useState(new Date())
    const [updateDate, setUpdate] = useState(new Date())
    const [user, setUser] = useState('')
    const [userData, setUserData] = useState('')
    const username = localStorage.getItem('username')
    const admin = localStorage.getItem('admin')

    async function userGen() {
        const auxSchedule = await api.post('/user/showOne', {
            username: username
        })
        if(auxSchedule.data != 400) {
            const userData = {
                username: auxSchedule.data.username,
                fullname: auxSchedule.data.fullname,
                CPF: auxSchedule.data.CPF,
                phone: auxSchedule.data.phone,
                admin: auxSchedule.data.admin
            }
            setUserData(userData)
        }
    }
    
    async function infrastructureGen() {
        const infrastructure = await api.get('/infrastructure/showOne')
        const service = [], clerk = []

        if(infrastructure) {
            infrastructure.data.service.map(element => {
                const aux = element.type
                service.push(aux)
            })
            setService(service)

            infrastructure.data.clerk.map(element => {
                clerk.push(element)
            })
            setClerk(clerk)
        }
    }

    async function dataGen() {
        const year = new Date().getFullYear()

        const data = await api.post('/schedule/showAll',{
            filter: {
                date: {
                    $gte: new Date(),
                    $lt: new Date(new Date().setDate(new Date().getDate() + 7))
                }
            }
        })
        if(data) {
            let cell = ''
            let status = 0
            let color = 'white'
            let rowCell = [], columnCell
            let rowindex = [], columnIndex

            for(let i = 0; i < 8; i++) {
                columnCell = []
                columnIndex = []
                for(let j = 1; j < 7; j++) {
                    let auxDate = day[j] + '/' + year + ' ' + lines[i]

                    data.data.map(element => {
                        let aux = new Date(element.date)
                        let month = formatarMes(aux.getMonth()+1)
                        let day = formatarDia(aux.getDate())
                        let compare = day + '/' + month + '/' + aux.getFullYear() + ' ' + aux.getHours() + ':' + '00'

                        if(compare === auxDate) {
                            cell = element.client.username
                            status = element.status
                            return
                        }
                    })

                    switch(status) {
                        case 1: 
                            color = 'rgb(231, 255, 164)'
                            break

                        case 2:
                            color = 'rgb(127, 196, 127)'
                            break

                        default:
                            color = 'white'
                            break
                    }

                    if(cell) {
                        columnCell.push(cell)
                        cell = ''
                        columnIndex.push({
                            row: j,
                            column: i,
                            status: status,
                            color: color
                        })
                    } else {
                        columnCell.push('')
                        columnIndex.push({
                            row: j,
                            column: i,
                            status: 0,
                            color: color
                        })
                    }
                    
                }
                rowCell.push(columnCell)
                rowindex.push(columnIndex)
            }
            setDataLoad(rowCell)
            setIndexLoad(rowindex)
        }
    }

    async function handleClick(e) {
        let aux = (e.target.id).split(' ')
        var auxSchedule
        let auxDate = day[aux[0]].split('/')
        auxDate = auxDate[1] + '/' + auxDate[0] + '/' + new Date().getFullYear() + ' ' + lines[aux[1]]
        setDate(new Date(auxDate))
        setUpdate(new Date(auxDate))

        $('.background_schedule').css('display', 'flex')
        $('.model_schedule').css('display', 'flex')

        if(aux[2]) {
            auxSchedule = await api.post('/user/showOne', {
                username: aux[2]
            })
            if(auxSchedule.data != 400) {
                const userData = {
                    username: auxSchedule.data.username,
                    fullname: auxSchedule.data.fullname,
                    CPF: auxSchedule.data.CPF,
                    phone: auxSchedule.data.phone,
                    admin: auxSchedule.data.admin
                }
                setUser(userData)
                const scheduleExists = await api.post('/schedule/showOne', {
                    client: userData,
                    date: new Date(auxDate)
                })
                setSchedule(scheduleExists.data)
                setDefaultClerk(scheduleExists.data.clerk)
                setDefaultService(scheduleExists.data.service)
            } 
        } else {
            setSchedule('')
            setDefaultClerk('')
            setDefaultService('')
            setUser(userData)
        }
    }

    async function handleAgendar(e) {
        e.preventDefault()
        
        if(defaultClerk && defaultService && date) {
            if(scheduleData) {
                const exists = await api.post('/schedule/showOne', {
                    client: user,
                    date: new Date(date)
                })

                if(exists.data != 400 && (exists.data.client.username == username || admin == 1)) {
                    let auxDate = ''

                    if(updateDate != date) {
                        auxDate = {
                            date: new Date(updateDate)
                        }
                    }

                    const response = await api.put('/schedule/update', {
                        client: user,
                        date: new Date(date),
                        service: defaultService,
                        clerk: defaultClerk,
                        status: 1,
                        newData: auxDate,
                        admin: admin
                    })
                    console.log(response.data)
                    switch(response.data) {
                        case 400:
                            Swal.fire({
                                icon: 'error',
                                title: 'Dados não foram atualizados!',
                            })
                            return
                        case 401:
                            Swal.fire({
                                icon: 'error',
                                title: 'Você não possui permissão para alterar este agendamento, favor solicitar pro telefone!',
                            })
                            return
                        default:
                            Swal.fire({
                                icon: 'success',
                                title: 'Alterações realizadas com sucesso!',
                            })
                            dataGen()
                            handleClose()
                            return
                    }
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Você não possui permissão para alterar este agendamento, favor solicitar pro telefone!',
                    })
                    return
                }
            }

            const update = await api.post('/schedule/sameWeek', {
                client: user,
                date: new Date(date)
            })
            
            if(update.data == 200) {
                Swal.fire({
                    title: 'Você já tem um horário nesta semana, deseja marcar os horários juntos?',
                    icon: 'warning',
                    showConfirmButton: true,
                    showDenyButton: true,
                    confirmButtonColor: 'green',
                    confirmButtonText: `Confirmar`,
                    denyButtonText: `Cancelar`,
                    denyButtonColor: 'red'
                }).then(async (result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isDenied) {
                        const response = await api.post('/schedule/store', {
                            client: user,
                            date: new Date(date),
                            service: defaultService,
                            clerk: defaultClerk
                        })

                        if(response == 400) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Horário já agendado!',
                            })
                        } else {
                            Swal.fire({
                                icon: 'success',
                                title: 'Horário solicitado com sucesso!',
                            })
                            handleClose()
                        }
                    } else {
                        Swal.fire({
                            icon: 'success',
                            title: 'Horário solicitado com sucesso!',
                        })
                        handleClose()
                    }
                })
            } else {
                const response = await api.post('/schedule/store', {
                    client: user,
                    date: new Date(date),
                    service: defaultService,
                    clerk: defaultClerk
                })

                if(response == 400) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Horário já agendado!',
                    })
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: 'Horário solicitado com sucesso!',
                    })
                    handleClose()
                }
            }
        }
    }

    async function handleConfirmar(e) {
        e.preventDefault()
        
        const exists = await api.post('/schedule/showOne', {
            client: user,
            date: new Date(date)
        })

        if(exists.data != 400 && exists.data.status != 2) {
            const response = await api.put('/schedule/update', {
                client: user,
                date: new Date(date),
                service: defaultService,
                clerk: defaultClerk,
                status: 2,
                newData: '',
                admin: admin
            }) 

            if(response.data != 400 && response.data != 401) {
                Swal.fire({
                    icon: 'success',
                    title: 'Agendamento confirmado!',
                })
                handleClose()
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Agendamento já confirmado!',
                })
            }
        }
    }

    function handleClose() {
        $('.background_schedule').css('display', 'none')
        $('.model_schedule').css('display', 'none')
    }

    function weekGen() {
        const week = ['Domingo', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado']
        var weekDay = new Date().getDay()
        const auxWeek = [], auxDay = []
        let monday = 0, day, month

        auxWeek.push('')
        auxDay.push('')

        if(month < 10)
            month = '0' + month

        if(weekDay == 1)
            monday = 1
        else if(weekDay > 1) 
            weekDay--

        for(let i = 0; i < 6; i++) {
            let date = new Date(new Date().setDate(new Date().getDate() + monday + i))
            month = date.getMonth()+1
            day = date.getDate()

            if(month < 10) 
                month = '0' + month
            if(day < 10)
                day = '0' + day
            if(weekDay == 6) 
                weekDay = 0

            auxDay.push(day + '/' + month)
            auxWeek.push(week[weekDay])
            weekDay++
        }
        setDay(auxDay)
        setColumns(auxWeek)
    }

    const filterPassedTime = time => {
        const currentDate = new Date();
        const selectedDate = new Date(time);

        return currentDate.getTime() < selectedDate.getTime();
    }

    useEffect(() => {
        weekGen()
        infrastructureGen()
        userGen()
    }, [])

    useEffect(() => {
        dataGen()
        setData(dataLoad)
        setIndex(indexLoad)
    },[dataLoad])

    return (
        <div className="schedule">
            <div>
                <div className="background_schedule" onClick={handleClose}/>
                <form className="model_schedule">
                    <h1>Agendar</h1>
                    <div className="divisor">
                        <div className="infrastructure">
                            <Dropdown
                                options={service}
                                value={defaultService}
                                onChange={(e) => {
                                    setDefaultService(e.value)
                                }}
                                placeholder="Selecione um serviço"
                                className="dropdown"
                            />
                            <Dropdown
                                options={clerk}
                                value={defaultClerk}
                                onChange={(e) => {
                                    setDefaultClerk(e.value)
                                }}
                                placeholder="Selecione um(a) atendente"
                            />
                        </div>
                        <div>
                            <DateTimePicker 
                                value={date}
                                onChange={data => {
                                    setUpdate(data)
                                }}
                                dateFormat='dd-MM-yyyy hh:mm'
                                showTimeSelect
                                filterTime={filterPassedTime}
                            />
                        </div>
                    </div>
                    <div className="schedule_buttons">
                        {username && (
                            <button onClick={handleAgendar}>Agendar</button>
                        )}
                        {admin == 1 && defaultService != '' && defaultClerk != '' ? (
                            <button onClick={handleConfirmar}>Confirmar</button>
                        ) : (
                            <></>
                        )}
                    </div>
                </form>
                {data[0] !== undefined && (
                    <Table 
                        striped 
                        bordered
                    >
                        <thead>
                            <tr className="coluna">
                                {columns.map(coluna => {
                                    return (
                                        <th key={coluna} className="day">
                                            <p>{coluna}</p>
                                            <p>{day[columns.indexOf(coluna)]}</p>
                                        </th>
                                    )
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {lines.map(line => {
                                let i = 0
                                return (
                                    <tr key={line} className="data">
                                        <td>{line}</td>
                                        {index[0] !== undefined && data[lines.indexOf(line)].map(cell => {
                                            i++
                                        
                                            return (
                                                <td 
                                                    key={i}
                                                    onClick={handleClick} 
                                                    id={
                                                        i + ' ' +
                                                        index[lines.indexOf(line)][data[lines.indexOf(line)]
                                                        .indexOf(cell)].column + ' ' +
                                                        cell
                                                    }
                                                    style={{
                                                        backgroundColor: cell ? index[lines.indexOf(line)][data[lines.indexOf(line)]
                                                        .indexOf(cell)].color : 'none'
                                                    }}
                                                >
                                                    {cell}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                )}
            </div>
        </div>
    )
}