import "./ResourcesScreen.css";

import { useState } from "react";
import Modal from 'react-modal';

import ResourceForm from "../../components/forms/ResourceForm/ResourceForm";
import HttpPetition from "../../helpers/HttpPetition";
import TableModal from "../../components/TableModal/TableModal";

const base_url = process.env.REACT_APP_NODE_API_BASE;

export default function ResourcesScreen() {
  const tableColumns = [
    {field: 'name', text: 'Nombre'},
    {field: 'acciones', text: 'Acciones'}
  ];

  const cancelForm = () => {
    setResourceId(0);
    setName("");
    setMensaje('')
    setResourceList([])
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
          url = base_url + '/api/v1/recurso/'+resourceId
      } else {
          method = 'POST';
          url = base_url + '/api/v1/recurso'
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
          recursonombre: name ? name.trim() : null,
        },
        validateStatus: () => true,
      });

      if (response.status == 200) {
        cancelForm();
        setMensaje("Exito al guardar el recurso");
      } else {
        setMensaje(
          `No se pudo guardar el recurso, codigo: ${response.status}${
            response.data.message ? " " + response.data.message : ""
          }`
        );
      }
    } catch (error) {
      setMensaje("Error al guardar el recurso: " + error.message);
    }
  };

  const deleteItem = async (resourceId, param, setMessageParam) => {
    try {
      const response = await HttpPetition({
        url: base_url + '/api/v1/recurso/' + resourceId,
        method: 'DELETE',
        validateStatus: () => true
      });

      if (response.status == 200) {
        cancelForm();
        setMessageParam('Exito al eliminar');
        await getData(param, setMessageParam);
      } else {
        setMessageParam(`Error al eliminar el recurso, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
      }
    } catch (error) {
      setMessageParam('Error al eliminar el recurso: ' + error.message);
    }
  };

  const getData = async (param, setMessageParam) => {
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
            id: resource.recurso_id,
            name: resource.re_nombre,
            acciones: <div className='ActionContainer'>
                <i 
                  onClick={()=>{
                    setResourceId(resource.re_recurso_id);
                    setName(resource.re_nombre);
                    setIsTableModalOpen(false);
                  }} 
                  class="bi bi-pencil-square ActionItem"
                ></i>
                <i
                  onClick={()=>deleteItem(resource.re_recurso_id, param, setMessageParam)} 
                  style={{color:"red"}} 
                  class="bi bi-trash ActionItem"
                ></i>
            </div>
          });
        }

        setResourceList(data);
      } else {
        setMessageParam(`Error al obtener los datos de recursos, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
      }
    } catch (error) {
      setMessageParam('Error al obtener los datos de la tabla: ' + error.message);
    }
  };

  const [resourceId, setResourceId] = useState(0);
  const [name, setName] = useState("");
  const [resourceList, setResourceList] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

  return (
    <div className="ResourceScreen">
      <div className="TitleContainer">
        <h1>Recursos</h1>
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

          setTableData={setResourceList}
          buscarData={getData}

          placeHolder='Nombre'
          tableColumns={tableColumns}
          tableData={resourceList}
        />
      </Modal>
      <ResourceForm
        cancelarFn={cancelForm}
        guardarFn={saveForm}
        setName={setName}
        name={name}
        mensaje={mensaje}
      />
    </div>
  );
}
