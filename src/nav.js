import React from 'react'
import {Link} from 'react-router-dom'

function nav(){
    return (
        <ul>
            <li><Link to="/"> Home </Link></li>
            <li><Link to="/kanban/"> Kanban </Link></li>
            <li><Link to="/timer/"> Timer </Link></li>
            <li><Link to="/stats/"> Statistics </Link></li>
            <li><Link to="/groups/"> Groups </Link></li>
        </ul>
    )
}
export default nav;