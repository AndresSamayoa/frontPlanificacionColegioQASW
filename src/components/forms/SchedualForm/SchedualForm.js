import './SchedualForm.css'

import TableModal from '../../TableModal/TableModal';

import AsyncSelect from 'react-select/async';
import moment from 'moment';

export default function SchedualForm(props) {

    const setSection = (e) => {
      props.setSection(e.target.value);
    }

    const setDay = (e) => {
      props.setDay(e.target.value);
    }

    const setStartHour = (e) => {
      props.setStartHour(e.target.value);
    }

    const setEndHour = (e) => {
      props.setEndHour(e.target.value);
    }

    return <div className='schedualForm'>
        <div className="schedualInputs">
            <div className="controlContainer">
                <span className="controlLabel">Usuario</span>
                <div className="inputSecundaryContainer">
                    <AsyncSelect loadOptions={props.getUser} value={props.user} onChange={props.setUser} />
                </div>
            </div>
            <div className="controlContainer">
                <span className="controlLabel">Curso</span>
                <div className="inputSecundaryContainer">
                    <AsyncSelect loadOptions={props.getCourses} value={props.course} onChange={props.setCourse} />
                </div>
            </div>
            {props.cicle && <h1>Ciclo: {moment(props.cicle.start_date).format('DD-MM-YYYY')} - {moment(props.cicle.end_date).format('DD-MM-YYYY')}</h1>}
            <TableModal 
                notModal={true}
                dates={true}

                setTableData={props.setCicleList}
                buscarData={props.getCicleData}

                tableColumns={props.tableCiclesColumns}
                tableData={props.cicleList}
            />
            <div className="controlContainer">
                <span className="controlLabel">Seccion</span>
                <div className="inputSecundaryContainer">
                    <input className="textInput" value={props.section} onChange={setSection}/>
                </div>
            </div>
            <div className="controlContainer">
                <span className="controlLabel">Dias</span>
                <div className="inputSecundaryContainer">
                    <select className="textInput" onChange={setDay} value={props.day}>
                      <option value="lunes" >lunes</option>
                      <option value="martes" >martes</option>
                      <option value="miercoles" >miercoles</option>
                      <option value="jueves" >jueves</option>
                      <option value="viernes" >viernes</option>
                      <option value="sabado" >sabado</option>
                      <option value="domingo" >domingo</option>
                    </select>
                </div>
            </div>
            <div className="controlContainer">
                <span className="controlLabel">Hora de inicio</span>
                <div className="inputSecundaryContainer">
                    <input className="textInput" type='time' value={props.startHour} onChange={setStartHour}/>
                </div>
            </div>
            <div className="controlContainer">
                <span className="controlLabel">Hora de fin</span>
                <div className="inputSecundaryContainer">
                    <input className="textInput" type='time' value={props.endHour} onChange={setEndHour}/>
                </div>
            </div>
        </div>
        <div className='messageContainer'>
                <p style={{width: '75%'}}>{props.mensaje}</p>
        </div>
        <div className="schedualFormControls">
            <button className="guardarBtn" onClick={props.guardarFn}><i class="bi bi-floppy"></i></button>
            <button className="cancelarBtn" onClick={props.cancelarFn}><i class="bi bi-x-lg"></i></button>
        </div>
    </div>
};
