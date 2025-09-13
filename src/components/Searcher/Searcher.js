import './Searcher.css'

export default function Searcher (props) {
    const setParam = (e) => {
        props.setParam(e.target.value);
    };

    const setStartDateParam = (e) => {
        props.setStartDateParam(e.target.value);
    };

    const setEndDateParam = (e) => {
        props.setEndDateParam(e.target.value);
    };
    if(!props.dates) {
        return <div className='SearcherContainer'>
            <input type='text' className='SearcherInput' placeholder={props.placeHolder} value={props.param} onChange={setParam}/>
            <button onClick={props.searchFn} className='SearcherBtn'><i class="bi bi-search" /></button>
            <button onClick={props.cancelFn} className='CancelSearchBtn'><i class="bi bi-x-lg" /></button>
        </div>
    } else if (props.dates) {
        return <div className='SearcherContainer'>
            <div>
                <label>Fecha de inicio</label>
                <input type='date' className='SearcherInput' value={props.startDateParam} onChange={setStartDateParam}/>
            </div>
            <div>
                <label>Fecha de fin</label>
                <input type='date' className='SearcherInput' value={props.endDateParam} onChange={setEndDateParam}/>
            </div>
            <button onClick={props.searchFn} className='SearcherBtn'><i class="bi bi-search" /></button>
            <button onClick={props.cancelFn} className='CancelSearchBtn'><i class="bi bi-x-lg" /></button>
        </div>
    }
};