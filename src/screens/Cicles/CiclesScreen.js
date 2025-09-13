import "./CiclesScreen.css";

import { useState } from "react";
import Modal from 'react-modal';
import moment from "moment";

import CicleForm from "../../components/forms/CicleForm/CicleForm";
import HttpPetition from "../../helpers/HttpPetition";
import TableModal from "../../components/TableModal/TableModal";

const base_url = process.env.REACT_APP_NODE_API_BASE;

export default function CiclesScreen() {
  const tableColumns = [
    {field: 'start_date', text: 'Fecha inicio'},
    {field: 'end_date', text: 'Fecha fin'},
    {field: 'acciones', text: 'Acciones'}
  ];

  const cancelForm = () => {
    setCicleId(0);
    setStartDate('');
    setEndDate('');
    setMensaje('');
    setCicleList([])
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

      if (cicleId > 0) {
          method = 'PUT';
          url = base_url + '/api/v1/bloque/'+cicleId
      } else {
          method = 'POST';
          url = base_url + '/api/v1/bloque'
      }

      if (cicleId == 0 && (!startDate || !moment(startDate).isValid())) {
        errores.push("La fecha de inicio es un campo obligatorio.");
      }

      if (cicleId == 0 && (!endDate || !moment(endDate).isValid())) {
        errores.push("La fecha de fin es un campo obligatorio.");
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
          fechainicio: startDate ? moment(startDate).format('YYYY-MM-DD') : null,
          fechafin: endDate ? moment(endDate).format('YYYY-MM-DD') : null,
        },
        validateStatus: () => true,
      });

      if (response.status == 200) {
        cancelForm();
        setMensaje("Exito al guardar");
      } else {
        setMensaje(
          `No se pudo guardar el bloque, codigo: ${response.status}${
            response.data.message ? " " + response.data.message : ""
          }`
        );
      }
    } catch (error) {
      setMensaje("Error al guardar el bloque: " + error.message);
    }
  };

  const deleteItem = async (cicleId, start_date, end_date, setMessageParam) => {
    try {
      const response = await HttpPetition({
        url: base_url + '/api/v1/bloque/' + cicleId,
        method: 'DELETE',
        validateStatus: () => true
      });

      if (response.status == 200) {
        cancelForm();
        setMessageParam('Exito al eliminar');
        await getData(start_date, end_date, setMessageParam);
      } else {
        setMessageParam(`Error al eliminar el bloque, codigo: ${response.status}${response.data.message ? ' ' + response.data.message : ''}`);
      }
    } catch (error) {
      setMessageParam('Error al eliminar el bloque: ' + error.message);
    }
  };

  const getData = async (start_date, end_date, setMessageParam) => {
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
                    setCicleId(cilce.bl_bloque_id);
                    setStartDate(cilce.bl_fecha_inicio);
                    setEndDate(cilce.bl_fecha_fin);
                    setIsTableModalOpen(false);
                  }} 
                  class="bi bi-pencil-square ActionItem"
                ></i>
                <i
                  onClick={()=>deleteItem(cilce.bl_bloque_id, start_date, end_date, setMessageParam)} 
                  style={{color:"red"}} 
                  class="bi bi-trash ActionItem"
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

  const [cicleId, setCicleId] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [cicleList, setCicleList] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

  return (
    <div className="CicleScreen">
      <div className="TitleContainer">
        <h1>Bloques</h1>
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

          dates={true}

          setTableData={setCicleList}
          buscarData={getData}

          placeHolder='Nombre'
          tableColumns={tableColumns}
          tableData={cicleList}
        />
      </Modal>
      <CicleForm
        cancelarFn={cancelForm}
        guardarFn={saveForm}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        startDate={startDate}
        endDate={endDate}
        mensaje={mensaje}
      />
    </div>
  );
}
