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
            <Link to='/cicle/crud' className='headerLink'><b>Bloques</b></Link>
            <Link to='/course/crud' className='headerLink'><b>Cursos</b></Link>
            <Link to='/assignation/crud' className='headerLink'><b>Asignaciones</b></Link>
            <Link to='/rol/crud' className='headerLink'><b>Roles</b></Link>
        </div>
    </div>
}