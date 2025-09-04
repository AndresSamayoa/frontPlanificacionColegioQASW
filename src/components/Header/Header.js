import './Header.css';

import { Link } from 'react-router-dom';

export default function Header () {
    return <div className='headerContainer'>
        <div className='headerLogoContainer'>
            <h1 className='headerTitle'>Planificaciónes</h1>
        </div>
        <div className='headerLinks'>
            <Link to='/user/crud' className='headerLink'><b>Usuarios</b></Link>
            <Link to='/resource/crud' className='headerLink'><b>Recursos</b></Link>
            <Link to='/schoolYear/crud' className='headerLink'><b>Grados</b></Link>
            <Link to='/evaluation/crud' className='headerLink'><b>Evaluaciónes</b></Link>
        </div>
    </div>
}