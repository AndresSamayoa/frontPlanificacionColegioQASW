import AsyncSelect from 'react-select/async';
import './AssignationForm.css'

export default function AssignationForm(props) {

    return <div className='assignationForm'>
        <div className="assignationInputs">
            <div className="controlContainer">
                <span className="controlLabel">Grado</span>
                <div className="inputSecundaryContainer">
                    <AsyncSelect loadOptions={props.getSchoolYear} value={props.schoolYear} onChange={props.setSchoolYear} />
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
        <div className="assignationFormControls">
            <button className="guardarBtn" onClick={props.guardarFn}><i class="bi bi-floppy"></i></button>
            <button className="cancelarBtn" onClick={props.cancelarFn}><i class="bi bi-x-lg"></i></button>
        </div>
    </div>
};
