import React from 'react'
import {Link} from 'react-router-dom'

function nav(){
    return (
        <div className="space-x-4">
            <li className="inline-block"><Link to="/"> Home </Link></li>
            <li className="inline-block"><Link to="/kanban/"> Kanban </Link></li>
            <li className="inline-block"><Link to="/timer/"> Timer </Link></li>
            <li className="inline-block"><Link to="/stats/"> Statistics </Link></li>
            <li className="inline-block"><Link to="/groups/"> Groups </Link></li>
        </div>
    )
}
export default nav;