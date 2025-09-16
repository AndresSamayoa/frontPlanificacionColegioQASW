import "./SchedualsScreen.css";

import { useState } from "react";
import Modal from 'react-modal';
import moment from 'moment';

import SchedualForm from "../../components/forms/SchedualForm/SchedualForm";
import HttpPetition from "../../helpers/HttpPetition";
import TableModal from "../../components/TableModal/TableModal";

const base_url = process.env.REACT_APP_NODE_API_BASE;

export default function SchedualsScreen() {
  const tableColumns = [
    {field: 'user', text: 'Usuario'},
    {field: 'day', text: 'Dia'},
    {field: 'start_hour', text: 'Hora de inicio'},
    {field: 'end_hour', text: 'Hora de fin'},
    {field: 'course', text: 'Curso'},
    {field: 'cicle', text: 'Bloque'},
    {field: 'acciones', text: 'Acciones'}
  ];

  const cicleColumns = [
    {field: 'start_date', text: 'Fecha de inicio'},
    {field: 'end_date', text: 'Fecha de fin'},
    {field: 'acciones', text: 'Acciones'}
  ];

  const cancelForm = () => {
    setSchedualId();
    setCourse(null);
    setUser(null);
    setCicle(null);
    setSection('');
    setDay('lunes');
    setStartHour('');
    setEndHour('');
    setSchedualList([]);
    setCicleList([]);
    setMensaje('');
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

      if (schedualId > 0) {
          method = 'PUT';
          url = base_url + '/api/v1/horario/'+schedualId
      } else {
          method = 'POST';
          url = base_url + '/api/v1/horario'
      }

      if (schedualId == 0 && (!day || day.length < 1)) {
        errores.push("El dia es un campo obligatorio.");
      }
      if (schedualId == 0 && (!startHour || startHour.length < 1)) {
        errores.push("La hora de inicio es un campo obligatorio obligatorio.");
      }
      if (schedualId == 0 && (!endHour || endHour.length < 1)) {
        errores.push("La hora de fin es un campo obligatorio obligatorio.");
      }
      if (schedualId == 0 && (!user)) {
        errores.push("El usuario es un campo obligatorio.");
      }
      if (schedualId == 0 && (!course)) {
        errores.push("El curso es un campo obligatorio.");
      }
      if (schedualId == 0 && (!cicle)) {
        errores.push("El ciclo es un campo obligatorio.");
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
          hora_inicio: startHour,
          hora_fin: endHour,
          dia: day,
          seccion: section.trim(),
          usuario_id: user ? user.value : null,
          curso_id: course ? course.value : null,
          bloque_id: cicle ? cicle.value : null,
        },
        validateStatus: () => true,
      });

      if (response.status == 200) {
        cancelForm();
        setMensaje("Exito al guardar");
      } else {
        setMensaje(
          `No se pudo guardar el horario, codigo: ${response.status}${
            response.data.message ? " " + response.data.message : ""
          }`
        );
      }
    } catch (error) {
      setMensaje("Error al guardar el horario: " + error.message);
    }
  };

  const deleteItem = async (schedualId, param, start_date, end_date, setMessageParam) => {
    try {
      const response = await HttpPetition({
        url: base_url + '/api/v1/horario/' + schedualId,
        method: 'DELETE',
        validateStatus: () => true
      });

      if (response.status == 200) {
        cancelForm();
        setMessageParam('Exito al eliminar');
        await getData(param, start_date, end_date, setMessageParam);
      } else {
        setMessageParam(`Error al eliminar el horario, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
      }
    } catch (error) {
      setMessageParam('Error al eliminar el horario: ' + error.message);
    }
  };

  const getData = async (param, start_date, end_date, setMessageParam) => {
    try {
      const response = await HttpPetition({
        url: base_url+'/api/v1/horario/search/'+param,
        params: {
          fecha_inicio: start_date,
          fecha_fin: end_date
        },
        method: 'GET',
        validateStatus: () => true,
        timeout: 30000
      });

      if (response.status == 200) {
        const data = [];
        for (const schedual of response.data) {
          data.push({
            user: schedual.us_nombres,
            day: schedual.ha_dia,
            start_hour: schedual.ha_hora_inicio,
            end_hour: schedual.ha_hora_fin,
            course: schedual.cu_nombre,
            cicle: moment(schedual.bl_fecha_inicio).format('DD-MM-YYYY') + '/' + moment(schedual.bl_fecha_fin).format('DD-MM-YYYY'),
            acciones: <div className='ActionContainer'>
                <i 
                  onClick={()=>{
                    setSchedualId(schedual.ha_horario_asignacion_id);
                    setUser({value: schedual.ha_usuario_id, label: schedual.us_nombres});
                    setCourse({value: schedual.ha_curso_id, label: schedual.cu_nombre});
                    setCicle({value: schedual.ha_bloque_id, start_date: schedual.bl_fecha_inicio, end_date: schedual.bl_fecha_fin});
                    setDay(schedual.ha_dia);
                    setSection(schedual.ha_seccion);
                    setStartHour(schedual.ha_hora_inicio);
                    setEndHour(schedual.ha_hora_fin);
                    setIsTableModalOpen(false);
                  }} 
                  class="bi bi-pencil-square ActionItem"
                ></i>
                <i
                  onClick={()=>deleteItem(schedual.ha_horario_asignacion_id, param, start_date, end_date, setMessageParam)} 
                  style={{color:"red"}} 
                  class="bi bi-trash ActionItem"
                ></i>
            </div>
          });
        }

        setSchedualList(data);
      } else {
        setMessageParam(`Error al obtener los datos de horarios, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
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
        setMensaje(`Error al obtener los datos de usuarios, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
      }
    } catch (error) {
      setMensaje('Error al obtener los datos de la busqueda: ' + error.message);
    }
  };

  const getCourse = async (param) => {
    try {
      const response = await HttpPetition({
        url: base_url+'/api/v1/curso/search/'+param,
        method: 'GET',
        validateStatus: () => true,
        timeout: 30000
      });

      if (response.status == 200) {
        const data = [];
        for (const course of response.data) {
          data.push({
            value: course.cu_curso_id,
            label: course.cu_nombre,
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

  const getCicle = async (start_date, end_date, setMessageParam) => {
    try {
      const response = await HttpPetition({
        url: base_url+'/api/v1/bloque/search',
        method: 'GET',
        params: {
          fechainicio: moment(start_date).format('YYYY-MM-DD'),
          fechafin: moment(end_date).format('YYYY-MM-DD'),
        },
        validateStatus: () => true,
        timeout: 30000
      });

      if (response.status == 200) {
        const data = [];
        for (const cilce of response.data) {
          data.push({
            id: cilce.bl_bloque_id,
            start_date: moment(cilce.bl_fecha_inicio).format('DD-MM-YYYY'),
            end_date: moment(cilce.bl_fecha_fin).format('DD-MM-YYYY'),
            acciones: <div className='ActionContainer'>
                <i 
                  onClick={()=>{
                    console.log(cilce)
                    setCicle({value: cilce.bl_bloque_id, start_date: cilce.bl_fecha_inicio, end_date: cilce.bl_fecha_fin});
                    setCicleList([]);
                  }} 
                  class="bi bi-check2-circle ActionItem"
                ></i>
            </div>
          });
        }

        setCicleList(data);
      } else {
        setMessageParam(`Error al obtener los datos de bloques, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
      }
    } catch (error) {
      setMessageParam('Error al obtener los datos de la tabla: ' + error.message);
    }
  };

  const [schedualId, setSchedualId] = useState(0);
  const [course, setCourse] = useState(null);
  const [user, setUser] = useState(null);
  const [cicle, setCicle] = useState(null);
  const [section, setSection] = useState('');
  const [day, setDay] = useState('lunes');
  const [startHour, setStartHour] = useState('');
  const [endHour, setEndHour] = useState('');
  const [schedualList, setSchedualList] = useState([]);
  const [cicleList, setCicleList] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

  return (
    <div className="SchedualScreen">
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

          param={true}
          dates={true}

          setTableData={setSchedualList}
          buscarData={getData}

          placeHolder='Nombre'
          tableColumns={tableColumns}
          tableData={schedualList}
        />
      </Modal>
      <SchedualForm
        cancelarFn={cancelForm}
        guardarFn={saveForm}
        setSection={setSection}
        setDay={setDay}
        setStartHour={setStartHour}
        setEndHour={setEndHour}
        setUser={setUser}
        getUser={getUser}
        setCourse={setCourse}
        getCourses={getCourse}
        setCicleList={setCicleList}
        getCicleData={getCicle}
        section={section}
        day={day}
        startHour={startHour}
        endHour={endHour}
        user={user}
        course={course}
        cicle={cicle}
        tableCiclesColumns={cicleColumns}
        cicleList={cicleList}
        mensaje={mensaje}
      />
    </div>
  );
}
