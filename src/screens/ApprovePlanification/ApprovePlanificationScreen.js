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
        url: base_url + '/api/v1/planificacion/'+resourceId+'/'+action,
        method: 'PUT',
        data: {
          comentario: comment.trim(),
        },
        validateStatus: () => true,
      });
      if (response.status == 200) {
        cancelForm();
        setMensaje("Exito al guardar");
      } else {
        setMensaje(
          `No se pudo guardar la evaluación, codigo: ${response.status}${
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
        url: base_url+'/api/v1/planificaciones/'+planificationId,
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
          evaluations.push(evalu.recurso + ' - ' + evalu.descripcion);
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
          contents.push(conte.descripcion + ' ' + conte.tipo);
        }

        const generalDetails = [evaluations, resources, archivements, competences, contents];

        for (const deta of generalDetails) {
          if (deta.length > maxLength) maxLength = deta.length
        }

        for (let i = 0; i < maxLength; i++) {
          data.push({
            evaluations: evaluations[i] || '',
            resources: resources[i] || '',
            archivements: archivements[i] || '',
            competences: competences[i] || '',
            content: content[i] || ''
          });
        }

        setPlanificationData({
          title: `${planification.nombre} ${planification.fecha_inicio}-${planification.fecha_fin}: ${planification.fecha}`,
          approved
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
  const [details, setDetails] = useState([])
  const [comment, setComment] = useState([])
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {getDetails}, []);

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
        <div className="controlContainer">
          <div className="inputSecundaryContainer">
              <input className="textInput" value={comment} onChange={(e)=> {setComment(e.target.value)}}/>
          </div>
          
        </div>
        <div className='messageContainer'>
            <p style={{width: '75%'}}>{mensaje}</p>
        </div>
        <div className="planificationFormControls">
            <button className="guardarBtn" onClick={() => approve('aprobar')}>Aprobar</button>
            <button className="cancelarBtn" onClick={() => approve('rechazar')}>Rechazar</button>
        </div>
      </div>
    </div>
  );
}
