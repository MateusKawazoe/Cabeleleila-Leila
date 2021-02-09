import React from 'react'
import '../style/main.css'
import Header from '../components/header'
import Content from '../components/content'

export default function Main() {
    return (
        <div className="body">
            <Header/>
            <Content/>
        </div>
    )
}