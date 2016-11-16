import React from 'react';
import MultiSelect from './MultiSelect.jsx'
import BaseGrid from './grids/BaseGrid.jsx'

import _ from 'underscore';

import './myApp.css';

export default class Area52 extends React.Component {

    constructor() {
        super();

        this.dimensions = {
          'brand': {
            'update': this.updateBrands.bind(this),
            'columnDefs':[
              {headerName: 'brand id', field: 'brand_id', width: 100},
              {headerName: 'brand', field: 'label', width: 100},
              {headerName: 'emv', field: 'emv', width: 150, cellRenderer: BaseGrid.emvRenderer},
                {headerName: 'count', field: 'count', width: 150},
                {headerName: 'views', field: 'views', width: 150}

            ]
          },
          'ambassador': {
              'update': this.updateAmbassadors.bind(this),
              'columnDefs': [
                  {headerName: 'ambassador id', field: 'ambassador_id', width: 100},
                {headerName: 'ambassador', field: 'label', width: 100},
                {headerName: 'emv', field: 'emv', width: 150, cellRenderer: BaseGrid.emvRenderer},
                  {headerName: 'count', field: 'count', width: 150},
                  {headerName: 'views', field: 'views', width: 150}

              ]
          },
            'hashtag': {
                'update': this.updateHashtags.bind(this),
                'columnDefs': [
                  {headerName: 'hashtag', field: 'label', width: 100},
                  {headerName: 'emv', field: 'emv', width: 150, cellRenderer: BaseGrid.emvRenderer},
                    {headerName: 'count', field: 'count', width: 150},
                    {headerName: 'views', field: 'views', width: 150}
                ]
              }
        };

        this.state = {
            quickFilterText: null,
            brandSelection: [''],
            ambassadorSelection: [''],
            hashtagSelection: [''],
            brand: [''],
            ambassador: [''],
            hashtag: [''],
            start_date: '2016-11-01',
            end_date: '2016-11-08'
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
      this.setState({brandSelection: values})
    }

    updateAmbassadors(values) {
      this.setState({ambassadorSelection: values})
    }

    updateHashtags(values) {
      this.setState({hashtagSelection: values})
    }

    delimValues(selections) {
        return _.map(selections, a => a.value).join(',')
    }

    makeQuery(dim) {
        const q = `http://localhost:3000/api/q?` +
                `dim=${dim}&` +
                `start_date=${this.state.start_date}&` +
                `end_date=${this.state.end_date}&` +
                `ambassador_ids=${this.delimValues(this.state.ambassadorSelection)}&` +
                `brand_ids=${this.delimValues(this.state.brandSelection)}&` +
                `hashtags=${this.delimValues(this.state.hashtagSelection)}&` +
                `limit=100`;

        console.log(q);

        fetch(q).then(response => {
            return response.json()
        }).then(json => {
            this.setState({[dim]: json})
        }).catch(error => {
            console.log('error: ' + error.message);
        });
    };

    querySubmit() {
        _.map(this.dimensions, (_, name) => this.makeQuery(name));
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

              <button onClick={this.querySubmit.bind(this)}>
                Submit Filters
              </button>

              {topHeaderTemplate}

              {_.map(this.dimensions, (dim, name) =>
                <BaseGrid key={name} type={name}
                  columnDefs={dim.columnDefs}
                  rows={this.state[name]}
                  />
              )}

          </div>
        </div>;
    }

}
