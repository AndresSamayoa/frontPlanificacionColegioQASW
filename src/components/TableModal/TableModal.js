import './TableModal.css'

import { useState } from 'react';

import DataTable from '../../components/DataTable/DataTable';
import Searcher from '../../components/Searcher/Searcher';

export default function TableModal (props) {
    let guardar_funcion = () => props.buscarData(buscador, setMensaje);

    if (props.dates && !props.param) {
        guardar_funcion = () => props.buscarData(startDate, endDate, setMensaje);
    }else if (props.useDate && !props.param) {
        guardar_funcion = () => props.buscarData(date, setMensaje);
    } else if (props.dates && props.param) {
        guardar_funcion = () => props.buscarData(buscador, startDate, endDate, setMensaje);
    }

    const [buscador, setBuscador] = useState('');
    const [date, setDate] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [mensaje, setMensaje] = useState('');

    const cerrarModal = () => {
        props.closeModal();
    }
    
    const clearTableData = () => {
        props.setTableData([]);
    }

    return <div className='TableModalComponent'>
        {!props.notModal && <div className='closeModalDiv'>
            <i onClick={cerrarModal} class="bi bi-x closeIcon" />
        </div>}
        <Searcher 
            placeHolder={props.placeHolder}

            dates={props.dates}
            useDate={props.useDate}
            searcher={props.param}

            param={buscador}
            startDate={startDate}
            endDate={endDate}
            date={date}
            setParam={setBuscador}
            setStartDateParam={setStartDate}
            setEndDateParam={setEndDate}
            setDateParam={setDate}

            searchFn={guardar_funcion}
            cancelFn={clearTableData}
        />
        <p>{mensaje}</p>
        <DataTable headers={props.tableColumns} rows={props.tableData} />
    </div>
}
