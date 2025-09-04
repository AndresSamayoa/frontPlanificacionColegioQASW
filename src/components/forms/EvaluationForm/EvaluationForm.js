import './EvaluationForm.css'

export default function evaluationForm(props) {

    const setName = (e) => {
        props.setName(e.target.value)
    };
    return <div className='evaluationForm'>
        <div className="evaluationInputs">
            <div className="controlContainer">
                <span className="controlLabel">Nombre</span>
                <div className="inputSecundaryContainer">
                    <input className="textInput" value={props.name} onChange={setName}/>
                </div>
            </div>
        </div>
        <div className='messageContainer'>
                <p style={{width: '75%'}}>{props.mensaje}</p>
        </div>
        <div className="evaluationFormControls">
            <button className="guardarBtn" onClick={props.guardarFn}><i class="bi bi-floppy"></i></button>
            <button className="cancelarBtn" onClick={props.cancelarFn}><i class="bi bi-x-lg"></i></button>
        </div>
    </div>
};