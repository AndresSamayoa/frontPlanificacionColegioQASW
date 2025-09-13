import "./CoursesScreen.css";

import { useState } from "react";
import Modal from 'react-modal';

import CourseForm from "../../components/forms/CourseForm/CourseForm";
import HttpPetition from "../../helpers/HttpPetition";
import TableModal from "../../components/TableModal/TableModal";

const base_url = process.env.REACT_APP_NODE_API_BASE;

export default function CoursesScreen() {
  const tableColumns = [
    {field: 'name', text: 'Nombre'},
    {field: 'schoolYear', text: 'Grado'},
    {field: 'acciones', text: 'Acciones'}
  ];

  const cancelForm = () => {
    setCourseId(0);
    setName('');
    setSchoolYear(null)
    setMensaje('');
    setCourseList([]);
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

      if (courseId > 0) {
          method = 'PUT';
          url = base_url + '/api/v1/curso/'+courseId
      } else {
          method = 'POST';
          url = base_url + '/api/v1/curso'
      }

      if (courseId == 0 && (!name || name.trim().length < 1)) {
        errores.push("El nombre es un campo obligatorio.");
      }

      if (courseId == 0 && (!schoolYear)) {
        errores.push("El grado es un campo obligatorio.");
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
          nombrecurso: name ? name.trim() : null,
          gradoid: schoolYear ? schoolYear.value : null,
        },
        validateStatus: () => true,
      });

      if (response.status == 200) {
        cancelForm();
        setMensaje("Exito al guardar");
      } else {
        setMensaje(
          `No se pudo guardar el curso, codigo: ${response.status}${
            response.data.message ? " " + response.data.message : ""
          }`
        );
      }
    } catch (error) {
      setMensaje("Error al guardar el curso: " + error.message);
    }
  };

  const deleteItem = async (courseId, param, setMessageParam) => {
    try {
      const response = await HttpPetition({
        url: base_url + '/api/v1/curso/' + courseId,
        method: 'DELETE',
        validateStatus: () => true
      });

      if (response.status == 200) {
        cancelForm();
        setMessageParam('Exito al eliminar');
        await getData(param, setMessageParam);
      } else {
        setMessageParam(`Error al eliminar el curso, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
      }
    } catch (error) {
      setMessageParam('Error al eliminar el curso: ' + error.message);
    }
  };

  const getData = async (param, setMessageParam) => {
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
            id: course.cu_curso_id,
            name: course.cu_nombre,
            schoolYear: course.gr_nombre,
            acciones: <div className='ActionContainer'>
                <i 
                  onClick={()=>{
                    setCourseId(course.cu_curso_id);
                    setName(course.cu_nombre);
                    setSchoolYear({value: course.cu_grado_id, label: course.gr_nombre});
                    setIsTableModalOpen(false);
                  }} 
                  class="bi bi-pencil-square ActionItem"
                ></i>
                <i
                  onClick={()=>deleteItem(course.cu_curso_id, param, setMessageParam)} 
                  style={{color:"red"}} 
                  class="bi bi-trash ActionItem"
                ></i>
            </div>
          });
        }

        setCourseList(data);
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
        for (const course of response.data) {
          data.push({
            value: course.gr_grado_id,
            label: course.gr_nombre,
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

  const [courseId, setCourseId] = useState(0);
  const [name, setName] = useState("");
  const [schoolYear, setSchoolYear] = useState(null);
  const [courseList, setCourseList] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

  return (
    <div className="CourseScreen">
      <div className="TitleContainer">
        <h1>Cursos</h1>
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

          setTableData={setCourseList}
          buscarData={getData}

          placeHolder='Nombre'
          tableColumns={tableColumns}
          tableData={courseList}
        />
      </Modal>
      <CourseForm
        cancelarFn={cancelForm}
        guardarFn={saveForm}
        setName={setName}
        setSchoolYear={setSchoolYear}
        getSchoolYear={getSchoolYears}
        name={name}
        schoolYear={schoolYear}
        mensaje={mensaje}
      />
    </div>
  );
}
