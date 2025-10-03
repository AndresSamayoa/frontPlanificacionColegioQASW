import './PlanificationForm.css'

import TableModal from '../../TableModal/TableModal';
import DataTable from '../../DataTable/DataTable';

import AsyncSelect from 'react-select/async';
import Select from 'react-select';

export default function PlanificationForm(props) {

    const setDate = (e) => {
      props.setDate(e.target.value);
    }

    const setArchivement = (e) => {
      props.setArchivement(e.target.value);
    }

    const setContent = (e) => {
      props.setContent(e.target.value);
    }

    const setCompetence = (e) => {
      props.setCompetence(e.target.value);
    }

    const setEvaluationComment = (e) => {
      props.setEvaluationComment(e.target.value);
    }

    const setContentType = (e) => {
      props.setContentType(e.target.value);
    }

    const setResourceComment = (e) => {
      props.setResourceComment(e.target.value);
    }

    return <div className='planificationForm'>
        <div className="planificationInputs">
            {props.schedual && <h1>Horario: {props.schedual.label}</h1>}
            <TableModal 
                notModal={true}
                dates={true}

                setTableData={props.setSchedualList}
                buscarData={props.getSchedualData}

                tableColumns={props.schedualColumns}
                tableData={props.schedualList}
            />
            <div className="controlContainer">
                <span className="controlLabel">Fecha</span>
                <div className="inputSecundaryContainer">
                    <input className="textInput" type='date' value={props.date} onChange={setDate}/>
                </div>
            </div>
            <div className="controlContainer">
                <span className="controlLabel">Evaluaciones</span>
                <div className="inputSecundaryContainer">
                    <input className="textInput" value={props.evaluationComment} onChange={setEvaluationComment}/>
                </div>
                <div className="inputSecundaryContainer">
                    <AsyncSelect loadOptions={props.getEvaluations} value={props.evaluation} onChange={props.setEvaluation} />
                    <button className="guardarBtn" onClick={props.addEvaluation}><i class="bi bi-plus-circle"></i></button>
                </div>
                <div className="inputSecundaryContainer">
                    <Select options={props.evaluationList} value={props.evaluationDel} onChange={props.setEvaluationDel} />
                    <button className="cancelarBtn" onClick={props.removeEvaluation}><i class="bi bi-x-lg"></i></button>
                </div>
            </div>
            <DataTable 
              headers={props.evaluationHeaders}
              rows={props.evaluationList}
            />
            <div className="controlContainer">
                <span className="controlLabel">Recursos</span>
                <div className="inputSecundaryContainer">
                    <input className="textInput" value={props.resourceComment} onChange={setResourceComment}/>
                </div>
                <div className="inputSecundaryContainer">
                    <AsyncSelect loadOptions={props.getResources} value={props.resource} onChange={props.setResource} />
                    <button className="guardarBtn" onClick={props.addResource}><i class="bi bi-plus-circle"></i></button>
                </div>
                <div className="inputSecundaryContainer">
                    <Select options={props.resourceList} value={props.resourceDel} onChange={props.setResourceDel} />
                    <button className="cancelarBtn" onClick={props.removeResource}><i class="bi bi-x-lg"></i></button>
                </div>
            </div>
            <DataTable 
              headers={props.resourceHeaders}
              rows={props.resourceList}
            />
            <div className="controlContainer">
                <span className="controlLabel">Indicadores de logros</span>
                <div className="inputSecundaryContainer">
                    <input className="textInput" value={props.archivement} onChange={setArchivement}/>
                    <button className="guardarBtn" onClick={props.addArchivement}><i class="bi bi-plus-circle"></i></button>
                </div>
                <div className="inputSecundaryContainer">
                    <Select options={props.archivementList} value={props.archivementDel} onChange={props.setArchivementDel} />
                    <button className="cancelarBtn" onClick={props.removeArchivement}><i class="bi bi-x-lg"></i></button>
                </div>
            </div>
            <DataTable 
              headers={props.archivementHeaders}
              rows={props.archivementList}
            />
            <div className="controlContainer">
                <span className="controlLabel">Competencias</span>
                <div className="inputSecundaryContainer">
                    <input className="textInput" value={props.competence} onChange={setCompetence}/>
                    <button className="guardarBtn" onClick={props.addCompetence}><i class="bi bi-plus-circle"></i></button>
                </div>
                <div className="inputSecundaryContainer">
                    <Select options={props.competenceList} value={props.competenceDel} onChange={props.setCompetenceDel} />
                    <button className="cancelarBtn" onClick={props.removeCompetence}><i class="bi bi-x-lg"></i></button>
                </div>
            </div>
            <DataTable 
              headers={props.competenceHeaders}
              rows={props.competenceList}
            />
            <div className="controlContainer">
                <span className="controlLabel">Contenidos</span>
                <div className="inputSecundaryContainer">
                <span className="controlLabel">Tipo</span>
                    <select className="textInput" onChange={setContentType} value={props.contentType}>
                      <option value="declarativo" >declarativo</option>
                      <option value="procedimental" >procedimental</option>
                      <option value="actitudinal" >actitudinal</option>
                    </select>
                </div>
                <div className="inputSecundaryContainer">
                    <input className="textInput" value={props.content} onChange={setContent}/>
                    <button className="guardarBtn" onClick={props.addContent}><i class="bi bi-plus-circle"></i></button>
                </div>
                <div className="inputSecundaryContainer">
                    <Select options={props.contentList} value={props.contentDel} onChange={props.setContentDel} />
                    <button className="cancelarBtn" onClick={props.removeContent}><i class="bi bi-x-lg"></i></button>
                </div>
            </div>
            <DataTable 
              headers={props.contentHeaders}
              rows={props.contentList}
            />
        </div>
        <div className='messageContainer'>
                <p style={{width: '75%'}}>{props.mensaje}</p>
        </div>
        <div className="planificationFormControls">
            {props.planificationId < 1 && <button className="guardarBtn" onClick={props.guardarFn}><i class="bi bi-floppy"></i></button>}
            <button className="cancelarBtn" onClick={props.cancelarFn}><i class="bi bi-x-lg"></i></button>
        </div>
    </div>
};
