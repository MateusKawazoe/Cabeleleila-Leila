import React, {
    useState,
    useEffect
} from 'react'
import '../style/graphic.css'
import api from '../service/api'
import { PieChart } from 'react-minimal-pie-chart'
import { set } from 'mongoose'

export default function Graphic() {
    const [data, setData] = useState('')
    const [confirmado, setConfirmado] = useState(0)
    const [agendado, setAgendado] = useState(0)
    useEffect(() => {
        dataGen()
    }, [])

    async function dataGen() {
        const schedules = await api.post('/schedule/showAll')
        var confirmado = 0
        var agendado = 0

        schedules.data.map(element => {
            if(element.status == 1) {
                agendado++
            } else if(element.status == 2) {
                confirmado++
            }
        })
        setAgendado(agendado)
        setConfirmado(confirmado)

        setData([
            { title: 'Agendado', value: agendado, color: 'rgb(231, 255, 164)', label: 'Agendado' },
            { title: 'Confirmado', value: confirmado, color: 'rgb(127, 196, 127)', label: 'Confirmado' },
          ])
    }

    return ( 
        <div className="graphic">
            <div className="legenda">
                <form>
                    <h1 className="title">Legenda</h1>
                    <p className="first">Agendamentos</p>
                    <p>Solicidatos: {agendado}</p>
                    <p>Confirmados: {confirmado}</p>
                </form>
            </div>
            {data !== '' && (
                <PieChart
                    data={data}
                />
            )}
        </div>
    )
}