import React from 'react'
import '../style/home.css'
import logo from '../images/logo.svg'

export default function Home() {
    return (
        <ul className="home">
            <img src={logo} alt="logo" className="home_img"/>
            <ul>
                <h1>Cabeleleila Leila</h1>
                <p>Salão de beleza e barbearia</p>
            </ul>
        </ul>
    )
}