import ReactDOM from 'react-dom';
import React from 'react';
import {AgGridReact} from 'ag-grid-react';
import BrandRowDataFactory from '../BrandRowDataFactory';
import BaseGrid from './BaseGrid.jsx'

export default class BrandGrid extends React.Component {

    constructor() {
        super();
    }

    emvRenderer(params) {
      if (params.value) {
          return params.value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
      } else {
          return null;
      }
    }

    render() {
        return <BaseGrid
            rowDataFactory={new BrandRowDataFactory(this.props.data)}
            selections={{'brands': this.props.brandSelection}}
            columnDefs={[
              {headerName: 'brand', field: 'brand', width: 100},
              {headerName: 'emv', field: 'emv', width: 150, cellRenderer: this.emvRenderer}
            ]}
          />
    }

}
