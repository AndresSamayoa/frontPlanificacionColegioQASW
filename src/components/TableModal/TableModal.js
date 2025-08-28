import './TableModal.css'

import { useState } from 'react';

import DataTable from '../../components/DataTable/DataTable';
import Searcher from '../../components/Searcher/Searcher';

export default function TableModal (props) {

    const [buscador, setBuscador] = useState('');
    const [mensaje, setMensaje] = useState('');

    const cerrarModal = () => {
        props.closeModal();
    }
    
    const clearTableData = () => {
        props.setTableData([]);
    }

    return <div className='TableModalComponent'>
        <div className='closeModalDiv'>
            <i onClick={cerrarModal} class="bi bi-x closeIcon" />
        </div>
        <Searcher 
            placeHolder={props.placeHolder}

            param={buscador}
            setParam={setBuscador}

            searchFn={() => props.buscarData(buscador, setMensaje)}
            cancelFn={clearTableData}
        />
        <p>{mensaje}</p>
        <DataTable headers={props.tableColumns} rows={props.tableData} />
    </div>
}
