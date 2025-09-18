import "./ApprovePlanificationScreen.css";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import HttpPetition from "../../helpers/HttpPetition";
import DataTable from "../../components/DataTable/DataTable";

const base_url = process.env.REACT_APP_NODE_API_BASE;

export default function ApprovePlanificationScreen() {
  const {planificationId} = useParams();

  const tableColumns = [
    {field: 'evaluations', text: 'Evaluaciones'},
    {field: 'resources', text: 'Recursos'},
    {field: 'archivements', text: 'Indicadores de logro'},
    {field: 'competences', text: 'Competencias'},
    {field: 'content', text: 'Contenido'}
  ];

  const cancelForm = () => {
    setComment('');
    setMensaje('');
  }

  const approve = async (action) => {
    try {
      const errores = [];

      if (!comment || comment.trim().length < 1) {
        errores.push("El comentario es un campo obligatorio.");
      }

      if (errores.length > 0) {
        let mensajeError = errores.join(" ");
        setMensaje(mensajeError);
        return;
      }

      const response = await HttpPetition({
        url: base_url + '/api/v1/planificacion/'+action+'/'+planificationId,
        method: 'POST',
        data: {
          pcomentario: comment.trim(),
          pusuario_id: localStorage.getItem('userId'),
        },
        validateStatus: () => true,
      });
      if (response.status == 200) {
        cancelForm();
        getDetails();
        setMensaje("Exito al guardar");
      } else {
        setMensaje(
          `No se pudo actualizar la planificacion, codigo: ${response.status}${
            response.data.message ? " " + response.data.message : ""
          }`
        );
      }
    } catch (error) {
      setMensaje("Error al actualizar la planificacion: " + error.message);
    }
  }

  const getDetails = async () => {
    try {
      const response = await HttpPetition({
        url: base_url+'/api/v1/planificacion/'+planificationId,
        method: 'GET',
        validateStatus: () => true,
        timeout: 30000
      });

      if (response.status == 200) {
        let maxLength = 0;
        const planification = response.data;
        const data = [];

        const evaluations = [];
        const resources = [];
        const archivements = [];
        const competences = [];
        const contents = [];

        for (const evalu of planification.evaluaciones) {
          evaluations.push(evalu.evaluacion + ' - ' + evalu.descripcion);
        }

        for (const reso of planification.recursos) {
          resources.push(reso.recurso + ' - ' + reso.descripcion);
        }

        for (const archi of planification.indicadores_logros) {
          archivements.push(archi.descripcion);
        }

        for (const comp of planification.competencias) {
          competences.push(comp.descripcion);
        }

        for (const conte of planification.contenidos) {
          contents.push(conte.descripcion + ', tipo: ' + conte.tipo);
        }

        const generalDetails = [evaluations, resources, archivements, competences, contents];

        for (const deta of generalDetails) {
          if (deta.length > maxLength) maxLength = deta.length
        }

        for (let i = 0; i < maxLength; i++) {
          data.push({
            evaluations: evaluations[i] || '-',
            resources: resources[i] || '-',
            archivements: archivements[i] || '-',
            competences: competences[i] || '-',
            content: contents[i] || '-'
          });
        }

        setPlanificationData({
          title: `${planification.nombre} ${planification.hora_inicio}-${planification.hora_fin}: ${planification.fecha}`,
          approved: planification.aprobado,
          approvedBy: planification.usuario_aprobacion,
          comment: planification.comentario || null
        })
        setDetails(data);
      } else {
        setMensaje(`Error al obtener los datos de la planificacion, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
      }
    } catch (error) {
      setMensaje('Error al obtener los datos de la planificacion: ' + error.message);
    }
  };

  const [planificationData, setPlanificationData] = useState({});
  const [details, setDetails] = useState([]);
  const [comment, setComment] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {getDetails()}, []);

  return (
    <div className="ApprovePlanificationScreen">
      <div className="TitleContainer">
        <h1>{planificationData.title}</h1>
      </div>
      <div className="planificationForm">
        <DataTable 
          headers={tableColumns}
          rows={details}
        />
        <h3>Estado: {planificationData.approved ? 'Aprobada' : planificationData.approved === null ? 'Pendiente': 'Rechazada'}</h3>
        {planificationData.approved !== null && <h3>Aprobacion por {planificationData.approvedBy}</h3>}
        {planificationData.comment && <><div className="TitleContainer">
          <h1>Commentario</h1>
        </div>
        <div className='messageContainer'>
            <p style={{"max-width": '75%'}}>{planificationData.comment}</p>
        </div></>}
        <div className="controlContainer">
          <div className="inputSecundaryContainer">
              <label>Comentario</label>
              <input className="textInput" value={comment} onChange={(e)=> {setComment(e.target.value)}}/>
          </div>
          
        </div>
        <div className='messageContainer'>
            <p style={{"max-width": '75%'}}>{mensaje}</p>
        </div>
        <div className="planificationFormControls">
            <button className="guardarBtn" onClick={() => approve('aprobar')}>Aprobar</button>
            <button className="cancelarBtn" onClick={() => approve('rechazar')}>Rechazar</button>
        </div>
      </div>
    </div>
  );
}
