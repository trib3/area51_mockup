import ReactDOM from 'react-dom';
import React from 'react';
import {AgGridReact} from 'ag-grid-react';
import RowDataFactory from '../data/RowDataFactory';
import BaseGrid from './BaseGrid.jsx'

export default class BrandGridDEPRECATED extends React.Component {

    constructor() {
        super();
    }

    render() {

        return <BaseGrid
            rowDataFactory={new RowDataFactory(this.props.data, 'brand')}
            selections={{'ambassador': this.props.ambassadorSelection, 'brand': this.props.brandSelection}}
            columnDefs={[
              {headerName: 'brand', field: 'brand', width: 100},
              {headerName: 'emv', field: 'emv', width: 150, cellRenderer: BaseGrid.emvRenderer}
            ]}
          />
    }

}
