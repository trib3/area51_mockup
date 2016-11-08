import ReactDOM from 'react-dom';
import React from 'react';
import MyDataFactory from './data/MyDataFactory';
import MultiSelect from './MultiSelect.jsx'
import BaseGrid from './grids/BaseGrid.jsx'
import AmbassadorGrid from './grids/AmbassadorGrid.jsx'
import RowDataFactory from './data/RowDataFactory.js';

import _ from 'underscore';

import './myApp.css';

export default class Area52 extends React.Component {

    constructor() {
        super();

        this.dimensions = {
          'brand': {
            'options': [
                  { label: 'Brand X', value: 'brand x'},
                  { label: 'Brand Y', value: 'brand y'},
                  { label: 'Brand Z', value: 'brand z'}
                ],
            'update': this.updateBrands.bind(this),
            'columnDefs':[
              {headerName: 'brand', field: 'brand', width: 100},
              {headerName: 'emv', field: 'emv', width: 150, cellRenderer: BaseGrid.emvRenderer}
            ]
          },
          'ambassador': {
            'options':[
                  { label: 'Amy Zee', value: 'Amy Zee'},
                  { label: 'Baby Yak', value: 'Baby Yak'},
                  { label: 'Chili X', value: 'Chili X'},
                  { label: 'Dingo Why', value :'Dingo Why'},
                  { label: 'Ermie V', value :'Ermie V'}
                ],
              'update': this.updateAmbassadors.bind(this),
              'columnDefs': [
                {headerName: 'ambassador', field: 'ambassador', width: 100},
                {headerName: 'emv', field: 'emv', width: 150, cellRenderer: BaseGrid.emvRenderer}
              ]
            },
            'hashtags': {
              'options':[
                    { label: '#apple', value: '#apple'},
                    { label: '#banana', value: '#banana'},
                    { label: '#cucumber', value: '#cucumber'},
                    { label: '#dill', value :'#dill'},
                    { label: '#egg', value :'#egg'},
                    { label: '#fave', value: '#fave'},
                    { label: '#giraffe', value :'#giraffe'},
                    { label: '#magic', value :'#magic'}
                  ],
                'update': this.updateHashtags.bind(this),
                'columnDefs': [
                  {headerName: 'hashtags', field: 'hashtags', width: 100},
                  {headerName: 'emv', field: 'emv', width: 150, cellRenderer: BaseGrid.emvRenderer}
                ]
              }
        }

        this.state = {
            data: new MyDataFactory().createData(),
            quickFilterText: null,
            brandSelection: [''],
            ambassadorSelection: [''],
            hashtagsSelection: ['']
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
      console.log('updateBrands myApp update', values)
      this.setState({brandSelection: values})
    }

    updateAmbassadors(values) {
      console.log('updateAmbassadors myApp update', values)
      this.setState({ambassadorSelection: values})
    }

    updateHashtags(values) {
      console.log('updateHashtags myApp update', values)
      this.setState({hashtagsSelection: values})
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

              {_.map(this.dimensions, (dim, name) =>
                <MultiSelect key={name} label={name} options={dim.options} update={dim.update} />
              )}

              {topHeaderTemplate}

              {_.map(this.dimensions, (dim, name) =>
                <BaseGrid key={name} type={name}
                  rowFactory={new RowDataFactory(this.state.data, name, _.map(this.dimensions, (dim, name) => name))}
                  selections={{
                    'ambassador': this.state.ambassadorSelection,
                    'brand': this.state.brandSelection,
                    'hashtags': this.state.hashtagsSelection
                  }}
                  columnDefs={dim.columnDefs}
                  />
              )}

          </div>
        </div>;
    }

}
