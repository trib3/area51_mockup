import ReactDOM from 'react-dom';
import React from 'react';
import {AgGridReact} from 'ag-grid-react';
import MyDataFactory from './MyDataFactory';
import BrandRowDataFactory from './BrandRowDataFactory';
import ColDefFactory from './ColDefFactory.jsx';
import MultiSelect from './MultiSelect.jsx'

import _ from 'underscore';


import './myApp.css';

export default class MyApp extends React.Component {

    constructor() {
        super();

        this.data = new MyDataFactory().createData()

        this.state = {
            quickFilterText: null,
            showGrid: true,
            showToolPanel: false,
            columnDefs: [
              {headerName: 'brand', field: 'brand', width: 100},
              {headerName: 'emv', field: 'emv', width: 150, cellRenderer: function(params) {
                  if (params.value) {
                      return params.value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
                  } else {
                      return null;
                  }
              }}
            ],
            rowData: [], //new BrandRowDataFactory(data, {'brands': ['brand X', 'brand Z']}).createRowData(),
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
                groupExpanded: '<i class="fa fa-minus-square-o"/>',
                groupContracted: '<i class="fa fa-plus-square-o"/>',
                columnGroupOpened: '<i class="fa fa-minus-square-o"/>',
                columnGroupClosed: '<i class="fa fa-plus-square-o"/>'
            },
            options: [
                    { label: 'Brand X', value: 'brand x'},
                    { label: 'Brand Y', value: 'brand y'},
                    { label: 'Brand Z', value: 'brand z'}
                  ]
        };

        // the grid options are optional, because you can provide every property
        // to the grid via standard React properties. however, the react interface
        // doesn't block you from using the standard JavaScript interface if you
        // wish. Maybe you have the gridOptions stored as JSON on your server? If
        // you do, the providing the gridOptions as a standalone object is just
        // what you want!
        this.gridOptions = {
            // this is how you listen for events using gridOptions
            onModelUpdated: function() {
                console.log('event onModelUpdated received');
            },
            // this is a simple property
            rowBuffer: 10 // no need to set this, the default is fine for almost all scenarios
        };
    }

    onGridReady(params) {
        this.api = params.api;
        this.columnApi = params.columnApi;
    }

    onQuickFilterText(event) {
        this.setState({quickFilterText: event.target.value});
    }

    onCellClicked(event) {
        console.log('onCellClicked: ' + event.data.name + ', col ' + event.colIndex);
    }

    onRowSelected(event) {
        console.log('onRowSelected: ' + event.node.data.name);
    }

    updateBrands(values) {
      this.setState({rowData: new BrandRowDataFactory(this.data, {'brands': values}).createRowData()})
    }

    render() {
        var brandGridTemplate;
        var bottomHeaderTemplate;
        var topHeaderTemplate;

        topHeaderTemplate = (
            <div>
                <div style={{float: 'right'}}>
                    <input type="text" onChange={this.onQuickFilterText.bind(this)} placeholder="Type text to filter..."/>
                </div>
                <div style={{padding: '4px'}}>
                    <b>Post data</b> <span id="rowCount"/>
                </div>
            </div>
        );

        // showing the bottom header and grid is optional, so we put in a switch
        brandGridTemplate = (
            <div style={{height: 200}} className="ag-fresh">
                <AgGridReact
                    // gridOptions is optional - its possible to provide
                    // all values as React props
                    gridOptions={this.gridOptions}

                    // listening for events
                    onGridReady={this.onGridReady.bind(this)}
                    onRowSelected={this.onRowSelected.bind(this)}
                    onCellClicked={this.onCellClicked.bind(this)}

                    // binding to simple properties
                    showToolPanel={this.state.showToolPanel}
                    quickFilterText={this.state.quickFilterText}

                    // binding to an object property
                    icons={this.state.icons}

                    // binding to array properties
                    columnDefs={this.state.columnDefs}
                    rowData={this.state.rowData}

                    // no binding, just providing harde coded strings for the properties
                    rowSelection="multiple"
                    enableColResize="true"
                    enableSorting="true"
                    enableFilter="true"
                    groupHeaders="true"
                    rowHeight="22"
                    debug="true"
                />
            </div>
        );

        return <div style={{width: '800px'}}>
            <div style={{padding: '4px'}}>
                <MultiSelect label="Brand" options={this.state.options} updateBrands={this.updateBrands.bind(this)}/>
                {topHeaderTemplate}
                {brandGridTemplate}
            </div>
        </div>;
    }

}
