import "./RolsScreen.css";

import { useState } from "react";
import Modal from 'react-modal';

import RolForm from "../../components/forms/RolForm/RolForm";
import HttpPetition from "../../helpers/HttpPetition";
import TableModal from "../../components/TableModal/TableModal";

const base_url = process.env.REACT_APP_NODE_API_BASE;

export default function RolsScreen() {
  const tableColumns = [
    {field: 'user', text: 'Usuario'},
    {field: 'rol', text: 'Rol'},
    {field: 'acciones', text: 'Acciones'}
  ];

  const cancelForm = () => {
    setRolId(0);
    setRolType('');
    setUser(null)
    setMensaje('');
    setRolList([]);
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

      if (rolId > 0) {
          method = 'PUT';
          url = base_url + '/api/v1/asignacion/'+rolId
      } else {
          method = 'POST';
          url = base_url + '/api/v1/asignacion'
      }

      if (rolId == 0 && (!rolType || rolType.length < 1)) {
        errores.push("El tipo es un campo obligatorio.");
      }
      if (rolId == 0 && (!user)) {
        errores.push("El usuario es un campo obligatorio.");
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
          rol: rolType,
          usuarioid: user ? user.value : null,
        },
        validateStatus: () => true,
      });

      if (response.status == 200) {
        cancelForm();
        setMensaje("Exito al guardar");
      } else {
        setMensaje(
          `No se pudo guardar el rol, codigo: ${response.status}${
            response.data.message ? " " + response.data.message : ""
          }`
        );
      }
    } catch (error) {
      setMensaje("Error al guardar el rol: " + error.message);
    }
  };

  const deleteItem = async (rolId, param, setMessageParam) => {
    try {
      const response = await HttpPetition({
        url: base_url + '/api/v1/asignacion/' + rolId,
        method: 'DELETE',
        validateStatus: () => true
      });

      if (response.status == 200) {
        cancelForm();
        setMessageParam('Exito al eliminar');
        await getData(param, setMessageParam);
      } else {
        setMessageParam(`Error al eliminar el rol, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
      }
    } catch (error) {
      setMessageParam('Error al eliminar el rol: ' + error.message);
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
        for (const rol of response.data) {
          data.push({
            id: rol.rol_id,
            rol: rol.tipo,
            user: rol.nombres,
            acciones: <div className='ActionContainer'>
                <i 
                  onClick={()=>{
                    setRolId(rol.rol_id);
                    setRolType(rol.tipo);
                    setUser({value: rol.usuario_id, label: rol.nombres});
                    setIsTableModalOpen(false);
                  }} 
                  class="bi bi-pencil-square ActionItem"
                ></i>
                <i
                  onClick={()=>deleteItem(rol.rol_id, param, setMessageParam)} 
                  style={{color:"red"}} 
                  class="bi bi-trash ActionItem"
                ></i>
            </div>
          });
        }

        setRolList(data);
      } else {
        setMessageParam(`Error al obtener los datos de roles, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
      }
    } catch (error) {
      setMessageParam('Error al obtener los datos de la tabla: ' + error.message);
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

  const [rolId, setRolId] = useState(0);
  const [rolType, setRolType] = useState('');
  const [user, setUser] = useState(null);
  const [rolList, setRolList] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

  return (
    <div className="RolScreen">
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

          setTableData={setRolList}
          buscarData={getData}

          placeHolder='Nombre'
          tableColumns={tableColumns}
          tableData={rolList}
        />
      </Modal>
      <RolForm
        cancelarFn={cancelForm}
        guardarFn={saveForm}
        setRol={setRolType}
        setUser={setUser}
        getUser={getUser}
        rol={rolType}
        user={user}
        mensaje={mensaje}
      />
    </div>
  );
}
