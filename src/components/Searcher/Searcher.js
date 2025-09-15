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

    const setDateParam = (e) => {
        props.setDateParam(e.target.value);
    };

    console.log(props)

    if(!props.dates && !props.useDate) {
        return <div className='SearcherContainer'>
            <input type='text' className='SearcherInput' placeholder={props.placeHolder} value={props.param} onChange={setParam}/>
            <button onClick={props.searchFn} className='SearcherBtn'><i class="bi bi-search" /></button>
            <button onClick={props.cancelFn} className='CancelSearchBtn'><i class="bi bi-x-lg" /></button>
        </div>
    } else if (props.dates && !props.searcher) {
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
    } else if (props.useDate && !props.searcher) {
        return <div className='SearcherContainer'>
            <div>
                <label>Fecha</label>
                <input type='date' className='SearcherInput' value={props.dateParam} onChange={setDateParam}/>
            </div>
            <button onClick={props.searchFn} className='SearcherBtn'><i class="bi bi-search" /></button>
            <button onClick={props.cancelFn} className='CancelSearchBtn'><i class="bi bi-x-lg" /></button>
        </div>
    } else {
        return <div className='SearcherContainer'>
            <div>
                <label>{props.placeHolder}</label>
                <input type='text' className='SearcherInput' placeholder={props.placeHolder} value={props.param} onChange={setParam}/>
            </div>
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