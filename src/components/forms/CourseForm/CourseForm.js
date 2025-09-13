import AsyncSelect from 'react-select/async';
import './CourseForm.css'

export default function CourseForm(props) {

    const setName = (e) => {
        props.setName(e.target.value)
    };
    return <div className='courseForm'>
        <div className="courseInputs">
            <div className="controlContainer">
                <span className="controlLabel">Nombre</span>
                <div className="inputSecundaryContainer">
                    <input className="textInput" value={props.name} onChange={setName}/>
                </div>
            </div>
            <div className="controlContainer">
                <span className="controlLabel">Grado</span>
                <div className="inputSecundaryContainer">
                    <AsyncSelect loadOptions={props.getSchoolYear} value={props.schoolYear} onChange={props.setSchoolYear} />
                </div>
            </div>
        </div>
        <div className='messageContainer'>
                <p style={{width: '75%'}}>{props.mensaje}</p>
        </div>
        <div className="courseFormControls">
            <button className="guardarBtn" onClick={props.guardarFn}><i class="bi bi-floppy"></i></button>
            <button className="cancelarBtn" onClick={props.cancelarFn}><i class="bi bi-x-lg"></i></button>
        </div>
    </div>
};
