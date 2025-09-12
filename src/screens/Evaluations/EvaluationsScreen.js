import "./EvaluationsScreen.css";

import { useState } from "react";
import Modal from 'react-modal';

import EvaluationForm from "../../components/forms/EvaluationForm/EvaluationForm";
import HttpPetition from "../../helpers/HttpPetition";
import TableModal from "../../components/TableModal/TableModal";

const base_url = process.env.REACT_APP_NODE_API_BASE;

export default function EvaluationsScreen() {
  const tableColumns = [
    {field: 'name', text: 'Nombre'},
    {field: 'acciones', text: 'Acciones'}
  ];

  const cancelForm = () => {
    setEvaluationId(0);
    setName('');
    setMensaje('');
    setEvaluationList([])
    console.log("Limpio");
  };

  const cerrarModalTabla = () => {
    setIsTableModalOpen(false);
  }

  const saveForm = async () => {
    try {
      const errores = [];
      let method ;
      let url ;

      if (resourceId > 0) {
          method = 'PUT';
          url = base_url + '/api/v1/evaluacion/'+resourceId
      } else {
          method = 'POST';
          url = base_url + '/api/v1/evaluacion'
      }

      if (resourceId == 0 && (!name || name.trim().length < 1)) {
        errores.push("El nombre es un campo obligatorio.");
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
          nombreevaluacion: name ? name.trim() : null,
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
      setMensaje("Error al guardar la evaluación: " + error.message);
    }
  };

  const deleteItem = async (resourceId, param, setMessageParam) => {
    try {
      const response = await HttpPetition({
        url: base_url + '/api/v1/evaluacion/' + resourceId,
        method: 'DELETE',
        validateStatus: () => true
      });

      if (response.status == 200) {
        cancelForm();
        setMessageParam('Exito al eliminar');
        await getData(param, setMessageParam);
      } else {
        setMessageParam(`Error al eliminar la evaluación, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
      }
    } catch (error) {
      setMessageParam('Error al eliminar la evaluación: ' + error.message);
    }
  };

  const getData = async (param, setMessageParam) => {
    try {
      const response = await HttpPetition({
        url: base_url+'/api/v1/evaluacion/search/'+param,
        method: 'GET',
        validateStatus: () => true,
        timeout: 30000
      });

      if (response.status == 200) {
        const data = [];
        for (const resource of response.data) {
          console.log(response.data)
          data.push({
            id: resource.ev_evaluacion_id,
            name: resource.ev_nombre,
            acciones: <div className='ActionContainer'>
                <i 
                  onClick={()=>{
                    setEvaluationId(resource.ev_evaluacion_id);
                    setName(resource.ev_nombre);
                    setIsTableModalOpen(false);
                  }} 
                  class="bi bi-pencil-square ActionItem"
                ></i>
                <i
                  onClick={()=>deleteItem(resource.ev_evaluacion_id, param, setMessageParam)} 
                  style={{color:"red"}} 
                  class="bi bi-trash ActionItem"
                ></i>
            </div>
          });
        }

        setEvaluationList(data);
      } else {
        setMessageParam(`Error al obtener los datos de evaluaciónes, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
      }
    } catch (error) {
      setMessageParam('Error al obtener los datos de la tabla: ' + error.message);
    }
  };

  const [resourceId, setEvaluationId] = useState(0);
  const [name, setName] = useState("");
  const [resourceList, setEvaluationList] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

  return (
    <div className="EvaluationScreen">
      <div className="TitleContainer">
        <h1>Evaluaciónes</h1>
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

          setTableData={setEvaluationList}
          buscarData={getData}

          placeHolder='Nombre'
          tableColumns={tableColumns}
          tableData={resourceList}
        />
      </Modal>
      <EvaluationForm
        cancelarFn={cancelForm}
        guardarFn={saveForm}
        setName={setName}
        name={name}
        mensaje={mensaje}
      />
    </div>
  );
}
