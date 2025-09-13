import "./AssignationsScreen.css";

import { useState } from "react";
import Modal from 'react-modal';

import AssignationForm from "../../components/forms/AssignationForm/AssignationForm";
import HttpPetition from "../../helpers/HttpPetition";
import TableModal from "../../components/TableModal/TableModal";

const base_url = process.env.REACT_APP_NODE_API_BASE;

export default function AssignationsScreen() {
  const tableColumns = [
    {field: 'user', text: 'Usuario'},
    {field: 'schoolYear', text: 'Grado'},
    {field: 'acciones', text: 'Acciones'}
  ];

  const cancelForm = () => {
    setAssignationId(0);
    setUser(null)
    setSchoolYear(null)
    setMensaje('');
    setAssignationList([]);
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

      if (assignationId > 0) {
          method = 'PUT';
          url = base_url + '/api/v1/asignacion/'+assignationId
      } else {
          method = 'POST';
          url = base_url + '/api/v1/asignacion'
      }

      if (assignationId == 0 && (!schoolYear)) {
        errores.push("El grado es un campo obligatorio.");
      }
      if (assignationId == 0 && (!user)) {
        errores.push("El usuario es un campo obligatorio.");
      }

      if (errores.length > 0) {
        let mensajeError = errores.join(" ");
        setMensaje(mensajeError);
        return;
      }

      console.log(schoolYear)

      const response = await HttpPetition({
        url: url,
        method: method,
        data: {
          gradoid: schoolYear ? schoolYear.value : null,
          usuarioid: user ? user.value : null,
        },
        validateStatus: () => true,
      });

      if (response.status == 200) {
        cancelForm();
        setMensaje("Exito al guardar");
      } else {
        setMensaje(
          `No se pudo guardar la asignacion, codigo: ${response.status}${
            response.data.message ? " " + response.data.message : ""
          }`
        );
      }
    } catch (error) {
      setMensaje("Error al guardar la asignacion: " + error.message);
    }
  };

  const deleteItem = async (assignationId, param, setMessageParam) => {
    try {
      const response = await HttpPetition({
        url: base_url + '/api/v1/asignacion/' + assignationId,
        method: 'DELETE',
        validateStatus: () => true
      });

      if (response.status == 200) {
        cancelForm();
        setMessageParam('Exito al eliminar');
        await getData(param, setMessageParam);
      } else {
        setMessageParam(`Error al eliminar la asignacion, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
      }
    } catch (error) {
      setMessageParam('Error al eliminar la asignacion: ' + error.message);
    }
  };

  const getData = async (param, setMessageParam) => {
    try {
      const response = await HttpPetition({
        url: base_url+'/api/v1/asignacion/search/'+param,
        method: 'GET',
        validateStatus: () => true,
        timeout: 30000
      });

      if (response.status == 200) {
        const data = [];
        for (const assignation of response.data) {
          data.push({
            id: assignation.as_asignacion_id,
            schoolYear: assignation.gr_nombre,
            user: assignation.us_nombres,
            acciones: <div className='ActionContainer'>
                <i 
                  onClick={()=>{
                    setAssignationId(assignation.as_asignacion_id);
                    setSchoolYear({value: assignation.as_grado_id, label: assignation.gr_nombre});
                    setUser({value: assignation.as_usuario_id, label: assignation.us_nombres});
                    setIsTableModalOpen(false);
                  }} 
                  class="bi bi-pencil-square ActionItem"
                ></i>
                <i
                  onClick={()=>deleteItem(assignation.as_asignacion_id, param, setMessageParam)} 
                  style={{color:"red"}} 
                  class="bi bi-trash ActionItem"
                ></i>
            </div>
          });
        }

        setAssignationList(data);
      } else {
        setMessageParam(`Error al obtener los datos de cursos, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
      }
    } catch (error) {
      setMessageParam('Error al obtener los datos de la tabla: ' + error.message);
    }
  };

  const getSchoolYears = async (param) => {
    try {
      const response = await HttpPetition({
        url: base_url+'/api/v1/grado/search/'+param,
        method: 'GET',
        validateStatus: () => true,
        timeout: 30000
      });

      if (response.status == 200) {
        const data = [];
        for (const assignation of response.data) {
          data.push({
            value: assignation.gr_grado_id,
            label: assignation.gr_nombre,
          });
        }

        return data;
      } else {
        setMensaje(`Error al obtener los datos de cursos, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
      }
    } catch (error) {
      setMensaje('Error al obtener los datos de la busqueda: ' + error.message);
    }
  };

  const getUser = async (param) => {
    try {
      const response = await HttpPetition({
        url: base_url+'/api/v1/users/search/'+param,
        method: 'GET',
        validateStatus: () => true,
        timeout: 30000
      });

      if (response.status == 200) {
        const data = [];
        for (const user of response.data) {
          data.push({
            value: user.usuario_id,
            label: user.nombres,
          });
        }

        return data;
      } else {
        setMensaje(`Error al obtener los datos de cursos, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
      }
    } catch (error) {
      setMensaje('Error al obtener los datos de la busqueda: ' + error.message);
    }
  };

  const [assignationId, setAssignationId] = useState(0);
  const [schoolYear, setSchoolYear] = useState(null);
  const [user, setUser] = useState(null);
  const [assignationList, setAssignationList] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

  return (
    <div className="AssignationScreen">
      <div className="TitleContainer">
        <h1>Asignaciones</h1>
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

          setTableData={setAssignationList}
          buscarData={getData}

          placeHolder='Nombre'
          tableColumns={tableColumns}
          tableData={assignationList}
        />
      </Modal>
      <AssignationForm
        cancelarFn={cancelForm}
        guardarFn={saveForm}
        setSchoolYear={setSchoolYear}
        getSchoolYear={getSchoolYears}
        setUser={setUser}
        getUser={getUser}
        schoolYear={schoolYear}
        user={user}
        mensaje={mensaje}
      />
    </div>
  );
}
