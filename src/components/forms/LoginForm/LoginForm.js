import './LoginForm.css'

export default function loginForm(props) {

    const setUser = (e) => {
        props.setUser(e.target.value)
    };
    const setPassword = (e) => {
        props.setPassword(e.target.value)
    };

    return <div className='loginForm'>
        <div className="loginInputs">
            <div className="controlContainer">
                <span className="controlLabel">Usuario</span>
                <div className="inputSecundaryContainer">
                    <input className="textInput" value={props.user} onChange={setUser}/>
                </div>
            </div>
            <div className="controlContainer">
                <span className="controlLabel">Contraseña</span>
                <div className="inputSecundaryContainer">
                    <input type='password' className="textInput" value={props.password} onChange={setPassword}/>
                </div>
            </div>
        </div>
        <div className='messageContainer'>
                <p>{props.mensaje}</p>
        </div>
        <div className="loginFormControls">
            <button className="guardarBtn" onClick={props.guardarFn}><i class="bi bi-box-arrow-in-right"></i></button>
            <button className="cancelarBtn" onClick={props.cancelarFn}><i class="bi bi-x-lg"></i></button>
        </div>
    </div>
};
