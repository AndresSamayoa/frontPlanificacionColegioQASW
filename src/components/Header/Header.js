import HttpPetition from '../../helpers/HttpPetition';
import './Header.css';

import { Link } from 'react-router-dom';

const base_url = process.env.REACT_APP_NODE_API_BASE;

export default function Header () {

    const logout = () => {
        HttpPetition({
            url: base_url + '/api/v1/logout',
            method: 'DELETE',
            validateStatus: () => true,
        });

        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.assign('/')
    }

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
            <Link to='/schedual/crud' className='headerLink'><b>Horarios</b></Link>
            <Link to='/planification/crud' className='headerLink'><b>Planificaciónes</b></Link>
        </div>
        <div className='headerLogoContainer'>
            <h1 className='headerLogout' onClick={logout}>Cerrar sesión</h1>
        </div>
    </div>
}