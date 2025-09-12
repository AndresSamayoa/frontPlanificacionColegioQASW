import "./SchoolYearsScreen.css";

import { useState } from "react";
import Modal from 'react-modal';

import SchoolYearForm from "../../components/forms/SchoolYearForm/SchoolYearForm";
import HttpPetition from "../../helpers/HttpPetition";
import TableModal from "../../components/TableModal/TableModal";

const base_url = process.env.REACT_APP_NODE_API_BASE;

export default function SchoolYearsScreen() {
  const tableColumns = [
    {field: 'name', text: 'Nombre'},
    {field: 'acciones', text: 'Acciones'}
  ];

  const cancelForm = () => {
    setSchoolYearId(0);
    setName('');
    setMensaje('');
    setSchoolYearList([]);
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

      if (schoolYearId > 0) {
          method = 'PUT';
          url = base_url + '/api/v1/grado/'+schoolYearId
      } else {
          method = 'POST';
          url = base_url + '/api/v1/grado'
      }

      if (schoolYearId == 0 && (!name || name.trim().length < 1)) {
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
          gradonombre: name ? name.trim() : null,
        },
        validateStatus: () => true,
      });

      if (response.status == 200) {
        cancelForm();
        setMensaje("Exito al guardar");
      } else {
        setMensaje(
          `No se pudo guardar el grado, codigo: ${response.status}${
            response.data.message ? " " + response.data.message : ""
          }`
        );
      }
    } catch (error) {
      setMensaje("Error al guardar el grado: " + error.message);
    }
  };

  const deleteItem = async (schoolYearId, param, setMessageParam) => {
    try {
      const response = await HttpPetition({
        url: base_url + '/api/v1/grado/' + schoolYearId,
        method: 'DELETE',
        validateStatus: () => true
      });

      if (response.status == 200) {
        cancelForm();
        setMessageParam('Exito al eliminar');
        await getData(param, setMessageParam);
      } else {
        setMessageParam(`Error al eliminar el grado, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
      }
    } catch (error) {
      setMessageParam('Error al eliminar el grado: ' + error.message);
    }
  };

  const getData = async (param, setMessageParam) => {
    try {
      const response = await HttpPetition({
        url: base_url+'/api/v1/grado/search/'+param,
        method: 'GET',
        validateStatus: () => true,
        timeout: 30000
      });

      if (response.status == 200) {
        const data = [];
        for (const schoolYear of response.data) {
          console.log(response.data)
          data.push({
            id: schoolYear.gr_grado_id,
            name: schoolYear.gr_nombre,
            acciones: <div className='ActionContainer'>
                <i 
                  onClick={()=>{
                    setSchoolYearId(schoolYear.gr_grado_id);
                    setName(schoolYear.gr_nombre);
                    setIsTableModalOpen(false);
                  }} 
                  class="bi bi-pencil-square ActionItem"
                ></i>
                <i
                  onClick={()=>deleteItem(schoolYear.gr_grado_id, param, setMessageParam)} 
                  style={{color:"red"}} 
                  class="bi bi-trash ActionItem"
                ></i>
            </div>
          });
        }

        setSchoolYearList(data);
      } else {
        setMessageParam(`Error al obtener los datos de grados, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
      }
    } catch (error) {
      setMessageParam('Error al obtener los datos de la tabla: ' + error.message);
    }
  };

  const [schoolYearId, setSchoolYearId] = useState(0);
  const [name, setName] = useState("");
  const [schoolYearList, setSchoolYearList] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

  return (
    <div className="SchoolYearScreen">
      <div className="TitleContainer">
        <h1>Grados</h1>
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

          setTableData={setSchoolYearList}
          buscarData={getData}

          placeHolder='Nombre'
          tableColumns={tableColumns}
          tableData={schoolYearList}
        />
      </Modal>
      <SchoolYearForm
        cancelarFn={cancelForm}
        guardarFn={saveForm}
        setName={setName}
        name={name}
        mensaje={mensaje}
      />
    </div>
  );
}
