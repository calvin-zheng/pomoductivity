import React from 'react'
import {Link} from 'react-router-dom'

function nav(){
    return (
        <ul>
            <li><Link to="/"> Home </Link></li>
            <li><Link to="/stats/"> Statistics </Link></li>
        </ul>
    )
}
export default nav;