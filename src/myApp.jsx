import ReactDOM from 'react-dom';
import React from 'react';
import MyDataFactory from './MyDataFactory';
import MultiSelect from './MultiSelect.jsx'
import BrandGrid from './grids/BrandGrid.jsx'

import _ from 'underscore';

import './myApp.css';

export default class MyApp extends React.Component {

    constructor() {
        super();

        //this.data =

        this.state = {
            data: new MyDataFactory().createData(),
            quickFilterText: null,
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
            brandOptions: [
                    { label: 'Brand X', value: 'brand x'},
                    { label: 'Brand Y', value: 'brand y'},
                    { label: 'Brand Z', value: 'brand z'}
                  ],
            brandSelection: [],
            ambassadorSelection: [],
            hashtagSelection: []
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

    updateBrands(values) {
      console.log('myApp update', values)

      this.setState({brandSelection: values})
    }

    render() {
        var topHeaderTemplate = (
            <div>
                <div style={{float: 'right'}}>
                    <input type="text" onChange={this.onQuickFilterText.bind(this)} placeholder="Type text to filter..."/>
                </div>
                <div style={{padding: '4px'}}>
                    <b>Post data</b> <span id="rowCount"/>
                </div>
            </div>
        );

        return <div style={{width: '800px'}}>
            <div style={{padding: '4px'}}>
                <MultiSelect label="Brand" options={this.state.brandOptions} updateBrands={this.updateBrands.bind(this)} />
                {topHeaderTemplate}
                <BrandGrid brandSelection={this.state.brandSelection} icons={this.state.icons} data={this.state.data} />
            </div>
        </div>;
    }

}
