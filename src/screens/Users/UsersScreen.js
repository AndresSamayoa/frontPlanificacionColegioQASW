import "./UsersScreen.css";

import { useState } from "react";
import Modal from 'react-modal';

import UsersForm from "../../components/forms/UserForm/UserForm";
import HttpPetition from "../../helpers/HttpPetition";
import TableModal from "../../components/TableModal/TableModal";

const base_url = process.env.REACT_APP_NODE_API_BASE;

export default function UsersScreen() {
  const tableColumns = [
    {field: 'name', text: 'Nombres'},
    {field: 'user', text: 'Usuario'},
    {field: 'phone', text: 'Telefono'},
    {field: 'activeText', text: 'Activo'},
    {field: 'acciones', text: 'Acciones'}
  ];

  const cancelForm = () => {
    console.log("Limpio");
    setUserId(0);
    setNames("");
    setPhone("");
    setUser("");
    setPassword("");
    setActive(false);
    setAdmin(false);
    setUserList([]);
    setMensaje("");
  };

  const cerrarModalTabla = () => {
    setUserList([]);
    setIsTableModalOpen(false);
  }

  const saveForm = async () => {
    try {
      const errores = [];
      let method ;
      let url ;

      if (userId > 0) {
          method = 'PUT';
          url = base_url + '/api/v1/users/'+userId
      } else {
          method = 'POST';
          url = base_url + '/api/v1/users'
      }

      if (userId == 0 && (!user || user.trim().length < 1)) {
        errores.push("El usuario es un campo obligatorio.");
      }
      if (userId == 0 && (!names || names.trim().length < 1)) {
        errores.push("El nombre es un campo obligatorio.");
      }
      if (userId == 0 && (!password || password.length < 1)) {
        errores.push("La clave es un campo obligatorio.");
      }
      if (userId == 0 && (!phone || phone.length < 1)) {
        errores.push("El telefono es un campo obligatorio.");
      } else if (userId == 0 && (phone.length > 8)) {
        errores.push("El telefono solo debe tener 8 caracteres.");
      }
      if (userId == 0 &&(active == null)) {
        errores.push("Debe seleccionar si el usuario esta activo o no.");
      }
      if (userId == 0 && (admin == null)) {
        errores.push("Debe seleccionar si el usuario es administrador o no.");
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
          names: names ? names.trim() : null,
          phone: phone ? phone.trim() : null,
          user: user ? user.trim() : null,
          password: password || null,
          active,
          admin
        },
        validateStatus: () => true,
      });

      if (response.status == 200) {
        cancelForm();
        setMensaje("Exito al guardar el usuario");
      } else {
        setMensaje(
          `No se pudo iniciar sesión, codigo: ${response.status}${
            response.data.message ? " " + response.data.message : ""
          }`
        );
      }
    } catch (error) {
      setMensaje("Error al iniciar sesión: " + error.message);
    }
  };

  const deleteItem = async (userId, param, setMessageParam) => {
    try {
      const response = await HttpPetition({
        url: base_url + '/api/v1/users/' + userId,
        method: 'DELETE',
        validateStatus: () => true
      });

      if (response.status == 200) {
        cancelForm();
        setMessageParam('Exito al eliminar');
        await getData(param, setMessageParam);
      } else {
        setMessageParam(`Error al eliminar el usuario, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
      }
    } catch (error) {
      setMessageParam('Error al eliminar el usuario: ' + error.message);
    }
  };

  const getData = async (param, setMessageParam) => {
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
            id: user.usuario_id,
            name: user.nombres,
            user: user.usuario,
            phone: user.telefono,
            activeText: user.activo ? 'Activo' : 'Inactivo',
            acciones: <div className='ActionContainer'>
                <i 
                  onClick={()=>{
                    setUserId(user.usuario_id);
                    setNames(user.nombres);
                    setPhone(user.telefono);
                    setUser(user.usuario);
                    setPassword('');
                    setActive(user.activo);
                    setAdmin(user.admin);
                    setIsTableModalOpen(false);
                  }} 
                  class="bi bi-pencil-square ActionItem"
                ></i>
                <i
                  onClick={()=>deleteItem(user.usuario_id, param, setMessageParam)} 
                  style={{color:"red"}} 
                  class="bi bi-trash ActionItem"
                ></i>
            </div>
          });
        }

        setUserList(data);
      } else {
        setMessageParam(`Error al obtener los datos de usuarios, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
      }
    } catch (error) {
      setMessageParam('Error al obtener los datos de la tabla: ' + error.message);
    }
  };

  const [userId, setUserId] = useState(0);
  const [names, setNames] = useState("");
  const [phone, setPhone] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [active, setActive] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [userList, setUserList] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

  return (
    <div className="UserScreen">
      <div className="TitleContainer">
        <h1>Usuarios</h1>
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

          setTableData={setUserList}
          buscarData={getData}

          placeHolder='Nombre o usuario'
          tableColumns={tableColumns}
          tableData={userList}
        />
      </Modal>
      <UsersForm
        cancelarFn={cancelForm}
        guardarFn={saveForm}
        setNames={setNames}
        setPhone={setPhone}
        setUser={setUser}
        setPassword={setPassword}
        setActive={setActive}
        setAdmin={setAdmin}
        names={names}
        phone={phone}
        user={user}
        password={password}
        active={active}
        admin={admin}
        mensaje={mensaje}
      />
    </div>
  );
}
