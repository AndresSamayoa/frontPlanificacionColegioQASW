import "./PlanificationScreen.css";

import { useState } from "react";
import Modal from 'react-modal';
import moment from 'moment';

import PlanificationForm from "../../components/forms/PlanificationForm/PlanificationForm";
import HttpPetition from "../../helpers/HttpPetition";
import TableModal from "../../components/TableModal/TableModal";

const base_url = process.env.REACT_APP_NODE_API_BASE;

export default function PlanificationScreen() {
  const tableColumns = [
    {field: 'schedual', text: 'Horario'},
    {field: 'date', text: 'Fecha'},
    {field: 'acciones', text: 'Acciones'}
  ];

  const schedualColumns = [
    {field: 'name', text: 'Opciones'},
    {field: 'acciones', text: 'Acciones'}
  ];

  const evaluationHeaders = [{field: 'name', text: 'Nombre'}, {field: 'description', text: 'Comentario'}];

  const resourceHeaders = [{field: 'name', text: 'Nombre'}, {field: 'description', text: 'Comentario'}];

  const archivementHeaders = [{field: 'value', text: 'Nombre'}];

  const competenceHeaders = [{field: 'value', text: 'Nombre'}];

  const contentHeaders = [{field: 'value', text: 'Nombre'}, {field: 'type', text: 'Tipo'}];

  const cancelForm = () => {
    setSchedual(null);
    setDate('');
    setContentType('declarativo');
    setResourceComment('');
    setEvaluationComment('');
    setEvaluationList([]);
    setResourceList([]);
    setArchivementList([]);
    setCompetenceList([]);
    setContentList([]);
    setMensaje('');
    console.log("Limpio");
  };

  const addDetail = async (data, type, clearForm) => {
    let body = {};
    switch (type) {
      case 'contenidos':
        body = {descripcion: data.description, tipo: data.type};
        break;
      case 'competencias':
        body = {descripcion: data.description};
        break;
      case 'indicadores':
        body = {descripcion: data.description};
        break;
      case 'evaluaciones':
        body = {evaluacion_id: data.id, descripcion: data.description};
        break;
      case 'recursos':
        body = {recurso_id: data.id, descripcion: data.description};
        break;
      default:
        break;
    };
    try {
      const response = await HttpPetition({
        url: base_url + '/api/v1/planificacion/' + planificationId + '/detalle',
        method: 'POST',
        data: {...body, tipo: type},
        validateStatus: () => true,
      });

      if (response.status == 200) {
        clearForm();
        getPlanification();
        setMensaje("Exito al guardar");
      } else {
        setMensaje(
          `No se pudo guardar el dato, codigo: ${response.status}${
            response.data.message ? " " + response.data.message : ""
          }`
        );
      }
    } catch (error) {
      setMensaje("Error al guardar el dato: " + error.message);
    }
  }

  const removeDetail = async (id, type, clearForm) => {
    try {
      const response = await HttpPetition({
        url: base_url + '/api/v1/planificacion/' + planificationId + '/detalle',
        method: 'DELETE',
        data: {id: id, tipo: type},
        validateStatus: () => true,
      });

      if (response.status == 200) {
        clearForm();
        getPlanification();
        setMensaje("Exito al guardar");
      } else {
        setMensaje(
          `No se pudo guardar el dato, codigo: ${response.status}${
            response.data.message ? " " + response.data.message : ""
          }`
        );
      }
    } catch (error) {
      setMensaje("Error al guardar el dato: " + error.message);
    }
  }

  const addEvaluation = () => {
    if (!evaluation || !evaluationComment) return;
    if (planificationId > 0) return addDetail({evaluacion_id: evaluation.value, descripcion: evaluationComment}, 'evaluaciones', () => {setEvaluation(null); setEvaluationComment('');});
    evaluationList.push({value: evaluation.value, label: evaluation.label + ' - ' + evaluationComment, name: evaluation.label, description: evaluationComment})
    setEvaluationList(evaluationList)
    setEvaluation(null)
    setEvaluationComment('')
  };

  const addResource = () => {
    if (!resource || !resourceComment) return;
    if (planificationId > 0) return addDetail({recurso_id: evaluation.value, descripcion: evaluationComment}, 'recursos', () => {setResource(null); setResourceComment('');});
    resourceList.push({value: resource.value, label: resource.label + ' - ' + resourceComment, name: resource.label,  description: resourceComment})
    setResourceList(resourceList)
    setResource(null)
    setResourceComment('')
  };

  const addArchivement = () => {
    if (!archivement) return;
    if (planificationId > 0) return addDetail({descripcion: archivement}, 'indicadores', () => {setArchivement('');});
    archivementList.push({value: archivement, label: archivement})
    setArchivementList(archivementList)
    setArchivement('')
  }

  const addCompetence = () => {
    if (!compentence) return;
    if (planificationId > 0) return addDetail({descripcion: compentence}, 'competencias', () => {setCompetence('')});
    competenceList.push({value: compentence, label: compentence})
    setCompetenceList(competenceList)
    setCompetence('')
  }

  const addContent = () => {
    if (!content || !contentType) return;
    if (planificationId > 0) return addDetail({tipo: contentType, descripcion: content}, 'contenidos', () => {setContent(''); setContentType('declarativo');});
    contentList.push({value: content, label: contentType + ' - ' + content, type: contentType})
    setContentList(contentList)
    setContent('')
    setContentType('declarativo')
  }

  const removeEvaluation = () => {
    if (!evaluationDel) return;
    if (planificationId > 0) return removeDetail(evaluationDel.value, 'evaluaciones', () => {setEvaluationDel(null)});
    const data = [];
    for (const evaluationItm of evaluationList) {
      if (evaluationItm.value !== evaluationDel.value) data.push(evaluationItm);
    }
    setEvaluationList(data)
    setEvaluationDel(null)
  };

  const removeResource = () => {
    if (!resourceDel) return;
    if (planificationId > 0) return removeDetail(evaluationDel.value, 'recursos', () => {setResourceDel(null)});
    const data = [];
    for (const itm of resourceList) {
      if (itm.value !== resourceDel.value) data.push(itm);
    }
    setResourceList(data)
    setResourceDel(null)
  };

  const removeArchivement = () => {
    if (!archivementDel) return;
    if (planificationId > 0) return removeDetail(evaluationDel.value, 'indicadores', () => {setArchivementDel(null)});
    const data = [];
    for (const itm of archivementList) {
      if (itm.value !== archivementDel.value) data.push(itm);
    }
    setArchivementList(data)
    setArchivementDel(null)
  }

  const removeCompetence = () => {
    if (!compentenceDel) return;
    if (planificationId > 0) return removeDetail(evaluationDel.value, 'competencias', () => {setCompetenceDel(null)});
    const data = [];
    for (const itm of competenceList) {
      if (itm.value !== compentenceDel.value) data.push(itm);
    }
    setCompetenceList(data)
    setCompetenceDel(null)
  }

  const removeContent = () => {
    if (!contentDel) return;
    if (planificationId > 0) return removeDetail(evaluationDel.value, 'contenidos', () => {setContentList(data)});
    const data = [];
    for (const itm of contentList) {
      if (itm.value !== contentDel.value) data.push(itm);
    }
    setContentList(data)
    setContentDel(null)
  }

  const cerrarModalTabla = () => {
    setIsTableModalOpen(false);
  }

  const saveForm = async () => {
    try {
      const errores = [];
      let method ;
      let url ;

      if (planificationId > 0) {
          method = 'PUT';
          url = base_url + '/api/v1/planificacion/'+planificationId
      } else {
          method = 'POST';
          url = base_url + '/api/v1/planificacion'
      }

      if (!date) {
        errores.push("La fecha es un campo obligatorio.");
      }
      if (!schedual) {
        errores.push("El horario es necesario.");
      }

      if (errores.length > 0) {
        let mensajeError = errores.join(" ");
        setMensaje(mensajeError);
        return;
      }

      const response = await HttpPetition({
        url: url,
        method: method,
        data: {
          horario: schedual.value,
          fecha: moment(date).format('YYYY-MM-DD'),
          evaluaciones: evaluationList.map(e => {return {evaluacion_id: e.value, descripcion: e.description}}),
          recursos: resourceList.map(e => {return {recurso_id_id: e.value, nombre: e.name, descripcion: e.description}}),
          logros: archivementList.map(e => e.value),
          compentence: competenceList.map(e => e.value),
          contentList: contentList.map(e => {return {tipo_contenido: e.type, descripcion: e.value}}),
        },
        validateStatus: () => true,
      });

      if (response.status == 200) {
        cancelForm();
        setMensaje("Exito al guardar");
      } else {
        setMensaje(
          `No se pudo guardar la planificacion, codigo: ${response.status}${
            response.data.message ? " " + response.data.message : ""
          }`
        );
      }
    } catch (error) {
      setMensaje("Error al guardar la planificacion: " + error.message);
    }
  };

  const deleteItem = async (planificationId, date, setMessageParam) => {
    try {
      const response = await HttpPetition({
        url: base_url + '/api/v1/planificaciones/' + planificationId,
        method: 'DELETE',
        validateStatus: () => true
      });

      if (response.status == 200) {
        cancelForm();
        setMessageParam('Exito al eliminar');
        await getData(date, setMessageParam);
      } else {
        setMessageParam(`Error al eliminar la planificación, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
      }
    } catch (error) {
      setMessageParam('Error al eliminar la planificación: ' + error.message);
    }
  };

  const getData = async (date, setMessageParam) => {
    try {
      const response = await HttpPetition({
        url: base_url+'/api/v1/planificaciones/search/'+date,
        method: 'GET',
        validateStatus: () => true,
        timeout: 30000
      });

      if (response.status == 200) {
        const data = [];
        for (const planification of response.data) {
          const evaluations = [];
          const resources = [];
          const archivements = [];
          const competences = [];
          const contents = [];

          for (const evalu of planification.evaluaciones) {
            evaluations.push({
              value: evalu.id,
              label: evalu.recurso + ' - ' + evalu.descripcion,
              name: evalu.recurso,
              description: evalu.descripcion
            });
          }

          for (const reso of planification.recursos) {
            resources.push({
              value: reso.id,
              label: reso.recurso + ' - ' + reso.descripcion,
              name: reso.recurso,
              description: reso.descripcion,
              aviable: reso.disponible
            });
          }

          for (const archi of planification.indicadores_logros) {
            archivements.push({
              value: archi.id,
              label: archi.descripcion,
              description: archi.descripcion,
            });
          }

          for (const comp of planification.competencias) {
            competences.push({
              value: comp.id,
              label: comp.descripcion,
              description: comp.descripcion,
            });
          }

          for (const conte of planification.contenidos) {
            contents.push({
              value: conte.id,
              label: conte.descripcion + ' ' + conte.tipo,
              description: conte.descripcion,
            });
          }

          data.push({
            schedual: {value: planification.ha_usuario_id, label: planification.us_nombres},
            date: planification.ha_dia,
            acciones: <div className='ActionContainer'>
                <i 
                  onClick={()=>{
                    setSchedual({label: `${planification.nombre} Sec. ${planification.ha_seccion}, ${planification.dia} ${planification.hora_inicio}-${planification.hora_fin}`})
                    setDate(planification.fecha);
                    setEvaluationList(evaluations);
                    setResourceList(resources);
                    setArchivementList(archivements);
                    setCompetenceList(competences);
                    setContentList(contents);
                    setIsTableModalOpen(false);
                  }} 
                  class="bi bi-pencil-square ActionItem"
                ></i>
                <i
                  onClick={()=>deleteItem(planification.rol_id, date, setMessageParam)} 
                  style={{color:"red"}} 
                  class="bi bi-trash ActionItem"
                ></i>
            </div>
          });
        }

        setSchedualList(data);
      } else {
        setMessageParam(`Error al obtener los datos de la tabla, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
      }
    } catch (error) {
      setMessageParam('Error al obtener los datos de la tabla: ' + error.message);
    }
  };

  const getPlanification = async () => {
    try {
      const response = await HttpPetition({
        url: base_url+'/api/v1/planificaciones/'+planificationId,
        method: 'GET',
        validateStatus: () => true,
        timeout: 30000
      });

      if (response.status == 200) {
        const planification = response.data;

        const evaluations = [];
        const resources = [];
        const archivements = [];
        const competences = [];
        const contents = [];

        for (const evalu of planification.evaluaciones) {
          evaluations.push({
            value: evalu.id,
            label: evalu.recurso + ' - ' + evalu.descripcion,
            name: evalu.recurso,
            description: evalu.descripcion
          });
        }

        for (const reso of planification.recursos) {
          resources.push({
            value: reso.id,
            label: reso.recurso + ' - ' + reso.descripcion,
            name: reso.recurso,
            description: reso.descripcion,
            aviable: reso.disponible
          });
        }

        for (const archi of planification.indicadores_logros) {
          archivements.push({
            value: archi.id,
            label: archi.descripcion,
            description: archi.descripcion,
          });
        }

        for (const comp of planification.competencias) {
          competences.push({
            value: comp.id,
            label: comp.descripcion,
            description: comp.descripcion,
          });
        }

        for (const conte of planification.contenidos) {
          contents.push({
            value: conte.id,
            label: conte.descripcion + ' ' + conte.tipo,
            description: conte.descripcion,
          });
        }

        setEvaluationList(evaluations);
        setResourceList(resources);
        setArchivementList(archivements);
        setCompetenceList(competences);
        setContentList(contents);
      } else {
        setMensaje(`Error al obtener los datos de la planificacion, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
      }
    } catch (error) {
      setMensaje('Error al obtener los datos de la planificacion: ' + error.message);
    }
  };

  const getScheduals = async (start_date, end_date) => {
    try {
      const response = await HttpPetition({
        url: base_url+'/api/v1/asignacion/usuario/'+localStorage.getItem('userId'),
        method: 'GET',
        param: {
          fechainicio: moment(start_date).format('YYYY-MM-DD'),
          fechafin: moment(end_date).format('YYYY-MM-DD'),
        },
        validateStatus: () => true,
        timeout: 30000
      });

      if (response.status == 200) {
        const data = [];
        for (const schedual of response.data) {
          data.push({
            name:  `${schedual.cu_nombre} Sec. ${schedual.ha_seccion}, ${schedual.ha_dia} ${schedual.ha_hora_inicio}-${schedual.ha_hora_fin}`,
            acciones: <div className='ActionContainer'>
                <i 
                  onClick={()=>{
                    setSchedualList([])
                    setSchedual({value: schedual.ha_horario_asignacion_id, label:  `${schedual.cu_nombre} Sec. ${schedual.ha_seccion}, ${schedual.ha_dia} ${schedual.ha_hora_inicio}-${schedual.ha_hora_fin}`});
                  }} 
                  class="bi bi-pencil-square ActionItem"
                ></i>
            </div>
          });
        }

        return data;
      } else {
        setMensaje(`Error al obtener los datos de los horarios, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
      }
    } catch (error) {
      setMensaje('Error al obtener los datos de los horarios: ' + error.message);
    }
  };

  const getResources =  async (param) => {
    try {
      const response = await HttpPetition({
        url: base_url+'/api/v1/recurso/search/'+param,
        method: 'GET',
        validateStatus: () => true,
        timeout: 30000
      });

      if (response.status == 200) {
        console.log(response)
        const data = [];
        for (const resource of response.data) {
          data.push({
            value: resource.recurso_id,
            label: resource.re_nombre,
          });
        }

        return data;
      } else {
        setMensaje(`Error al obtener los datos de recursos, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
      }
    } catch (error) {
      setMensaje('Error al obtener los datos de recursos: ' + error.message);
    }
  };

  const getEvaluations =  async (param) => {
    try {
      const response = await HttpPetition({
        url: base_url+'/api/v1/evaluacion/search/'+param,
        method: 'GET',
        validateStatus: () => true,
        timeout: 30000
      });

      if (response.status == 200) {
        console.log(response)
        const data = [];
        for (const evaluation of response.data) {
          data.push({
            value: evaluation.ev_evaluacion_id,
            label: evaluation.ev_nombre,
          });
        }

        return data;
      } else {
        setMensaje(`Error al obtener los datos de evaluaciones, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
      }
    } catch (error) {
      setMensaje('Error al obtener los datos de evaluaciones: ' + error.message);
    }
  };

  // general fields
  const [planificationId, setPlanificationId] = useState(0);
  const [date, setDate] = useState(null);
  const [schedual, setSchedual] = useState(null);
  const [schedualList, setSchedualList] = useState([]);
  // array fields to add
  const [contentType, setContentType] = useState('declarativo');
  const [evaluationComment, setEvaluationComment] = useState('');
  const [resourceComment, setResourceComment] = useState('');
  const [content, setContent] = useState('');
  const [compentence, setCompetence] = useState('');
  const [archivement, setArchivement] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [resource, setResource] = useState(null);
  // array fields to delete
  const [contentDel, setContentDel] = useState(null);
  const [compentenceDel, setCompetenceDel] = useState(null);
  const [archivementDel, setArchivementDel] = useState(null);
  const [evaluationDel, setEvaluationDel] = useState(null);
  const [resourceDel, setResourceDel] = useState(null);
  // array fields added
  const [contentList, setContentList] = useState([]);
  const [competenceList, setCompetenceList] = useState([]);
  const [archivementList, setArchivementList] = useState([]);
  const [evaluationList, setEvaluationList] = useState([]);
  const [resourceList, setResourceList] = useState([]);
  // array fields added
  const [contentSelect, setContentSelect] = useState([]);
  const [compentenceSelect, setCompetenceSelect] = useState([]);
  const [archivementSelect, setArchivementSelect] = useState([]);
  const [evaluationSelect, setEvaluationSelect] = useState([]);
  const [resourceSelect, setResourceSelect] = useState([]);
  const [planificationSelect, setPlanificationSelect] = useState([]);
  // screen data
  const [planificationList, setPlanificationList] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

  return (
    <div className="PlanificationScreen">
      <div className="TitleContainer">
        <h1>Planificaciónes</h1>
        <i class="bi bi-search openModal" onClick={()=> setIsTableModalOpen(true)}/>
      </div>
      <Modal 
        isOpen={isTableModalOpen}
        onRequestClose={cerrarModalTabla}
        shouldCloseOnEsc={true}
        shouldCloseOnOverlayClick={true}
      >
        <TableModal 
          closeModal={() => setIsTableModalOpen(false)}

          useDate={true}

          setTableData={setSchedualList}
          buscarData={getData}

          placeHolder='Nombre'
          tableColumns={tableColumns}
          tableData={planificationList}
        />
      </Modal>
      <PlanificationForm
        cancelarFn={cancelForm}
        guardarFn={saveForm}

        setSchedual={setSchedual}
        setSchedualList={setSchedualList}
        getSchedualData={getScheduals}
        setDate={setDate}
        setContentType={setContentType}
        setEvaluationComment={setEvaluationComment}
        setResourceComment={setResourceComment}
        getEvaluations={getEvaluations}
        setEvaluation={setEvaluation}
        addEvaluation={addEvaluation}
        removeEvaluation={removeEvaluation}
        setEvaluationDel={setEvaluationDel}
        getResources={getResources}
        setResource={setResource}
        addResource={addResource}
        removeResource={removeResource}
        setResourceDel={setResourceDel}
        setArchivement={setArchivement}
        setArchivementDel={setArchivementDel}
        removeArchivement={removeArchivement}
        addArchivement={addArchivement}
        setCompetence={setCompetence}
        setCompetenceDel={setCompetenceDel}
        removeCompetence={removeCompetence}
        addCompetence={addCompetence}
        setContent={setContent}
        setContentDel={setContentDel}
        removeContent={removeContent}
        addContent={addContent}

        schedualList={schedualList}
        schedualColumns={schedualColumns}
        schedual={schedual}
        date={date}
        contentType={contentType}
        evaluationComment={evaluationComment}
        resourceComment={resourceComment}
        evaluation={evaluation}
        evaluationDel={evaluationDel}
        evaluationHeaders={evaluationHeaders}
        evaluationList={evaluationList}
        resource={resource}
        resourceHeaders={resourceHeaders}
        resourceDel={resourceDel}
        resourceList={resourceList}
        archivement={archivement}
        archivementHeaders={archivementHeaders}
        archivementDel={archivementDel}
        archivementList={archivementList}
        competence={compentence}
        competenceHeaders={competenceHeaders}
        compentenceDel={compentenceDel}
        competenceList={competenceList}
        content={content}
        contentHeaders={contentHeaders}
        contentDel={contentDel}
        contentList={contentList}

        mensaje={mensaje}
      />
    </div>
  );
}
