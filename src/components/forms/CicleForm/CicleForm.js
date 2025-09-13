import './CicleForm.css'

export default function CicleForm(props) {

    const setStartDate = (e) => {
        props.setStartDate(e.target.value)
    };

    const setEndDate = (e) => {
        props.setEndDate(e.target.value)
    };

    return <div className='cicleForm'>
        <div className="cicleInputs">
            <div className="controlContainer">
                <span className="controlLabel">Fecha de inicio</span>
                <div className="inputSecundaryContainer">
                    <input className="textInput" type='date' value={props.startDate} onChange={setStartDate}/>
                </div>
            </div>
            <div className="controlContainer">
                <span className="controlLabel">Fecha de fin</span>
                <div className="inputSecundaryContainer">
                    <input className="textInput" type='date' value={props.endDate} onChange={setEndDate}/>
                </div>
            </div>
        </div>
        <div className='messageContainer'>
                <p style={{width: '75%'}}>{props.mensaje}</p>
        </div>
        <div className="cicleFormControls">
            <button className="guardarBtn" onClick={props.guardarFn}><i class="bi bi-floppy"></i></button>
            <button className="cancelarBtn" onClick={props.cancelarFn}><i class="bi bi-x-lg"></i></button>
        </div>
    </div>
};