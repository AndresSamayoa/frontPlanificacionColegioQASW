import './UserForm.css'

export default function userForm(props) {

    const setUser = (e) => {
        props.setUser(e.target.value)
    };
    const setNames = (e) => {
        props.setNames(e.target.value)
    };
    const setPhone = (e) => {
        const value = e.target.value ? e.target.value.replace(/[^0-9]/gm,'') : e.target.value;
        if (value.length <= 8) {
            props.setPhone(e.target.value ? e.target.value.replace(/[^0-9]/gm,'') : e.target.value);
        }
    };
    const setPassword = (e) => {
        props.setPassword(e.target.value)
    };
    const setActive = (e) => {
        props.setActive(e.target.checked)
    };
    const setAdmin = (e) => {
        props.setAdmin(e.target.checked)
    };

    return <div className='userForm'>
        <div className="userInputs">
            <div className="controlContainer">
                <span className="controlLabel">Nombres</span>
                <div className="inputSecundaryContainer">
                    <input className="textInput" value={props.names} onChange={setNames}/>
                </div>
            </div>
            <div className="controlContainer">
                <span className="controlLabel">Telefono</span>
                <div className="inputSecundaryContainer">
                    <input className="textInput" value={props.phone} onChange={setPhone}/>
                </div>
            </div>
            <div className="controlContainer">
                <span className="controlLabel">Usuario</span>
                <div className="inputSecundaryContainer">
                    <input className="textInput" value={props.user} onChange={setUser}/>
                </div>
            </div>
            <div className="controlContainer">
                <span className="controlLabel">Contraseña</span>
                <div className="inputSecundaryContainer">
                    <input className="textInput" value={props.password} onChange={setPassword}/>
                </div>
            </div>
            <div className="controlContainer">
                <span className="controlLabel">Activo</span>
                <div className="inputSecundaryContainer">
                    <input type="checkbox" className="checkBoxInput" checked={props.active} onChange={setActive}/>
                </div>
            </div>
            <div className="controlContainer">
                <span className="controlLabel">Admin</span>
                <div className="inputSecundaryContainer">
                    <input type="checkbox" className="checkBoxInput" checked={props.admin} onChange={setAdmin}/>
                </div>
            </div>
        </div>
        <div className='messageContainer'>
                <p style={{width: '75%'}}>{props.mensaje}</p>
        </div>
        <div className="userFormControls">
            <button className="guardarBtn" onClick={props.guardarFn}><i class="bi bi-floppy"></i></button>
            <button className="cancelarBtn" onClick={props.cancelarFn}><i class="bi bi-x-lg"></i></button>
        </div>
    </div>
};
