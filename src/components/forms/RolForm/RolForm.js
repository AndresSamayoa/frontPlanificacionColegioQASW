import AsyncSelect from 'react-select/async';
import './RolForm.css'

export default function RolForm(props) {

    const setRol = (e) => {
      props.setRol(e.target.value);
    }

    return <div className='rolForm'>
        <div className="rolInputs">
            <div className="controlContainer">
                <span className="controlLabel">Grado</span>
                <div className="inputSecundaryContainer">
                    <select className="textInput" onChange={setRol} value={props.rol}>
                      <option value="director" >director</option>
                      <option value="coordinador" >coordinador</option>
                      <option value="maestro" >maestro</option>
                    </select>
                </div>
            </div>
            <div className="controlContainer">
                <span className="controlLabel">Usuario</span>
                <div className="inputSecundaryContainer">
                    <AsyncSelect loadOptions={props.getUser} value={props.user} onChange={props.setUser} />
                </div>
            </div>
        </div>
        <div className='messageContainer'>
                <p style={{width: '75%'}}>{props.mensaje}</p>
        </div>
        <div className="rolFormControls">
            <button className="guardarBtn" onClick={props.guardarFn}><i class="bi bi-floppy"></i></button>
            <button className="cancelarBtn" onClick={props.cancelarFn}><i class="bi bi-x-lg"></i></button>
        </div>
    </div>
};
