import React from 'react';
import MultiSelect from './MultiSelect.jsx'
import BaseGrid from './grids/BaseGrid.jsx'
import _ from 'lodash';

import DateSelector from './DateSelector.jsx'
import './myApp.css';

var ReactGridLayout = require('react-grid-layout');

import moment from 'moment';

export default class Area52 extends React.Component {

  constructor() {
    super();

        this.dimensions = {
            'brand': {
                'name': 'brand',
                'selectable': true,
                'row': 0,
                'col': 1,
                'update': this.updateBrands.bind(this),
                'columnDefs':[
                    {headerName: 'brand id', field: 'brand_id', width: 100, hide: false},
                    {headerName: 'brand', field: 'brand', width: 100},
                    {headerName: 'emv', field: 'emv', width: 100, cellRenderer: BaseGrid.emvRenderer},
                    {headerName: 'count', field: 'count', width: 50},
                ],
                'layout': {i: 'brand', x: 0, y: 0, w: 2, h: 2},
            },
            'ambassador': {
              'name': 'ambassador',
              'selectable': true,
              'row': 0,
              'col': 2,
                'update': this.updateAmbassadors.bind(this),
                'columnDefs': [
                    {headerName: 'ambassador id', field: 'ambassador_id', width: 100, hide: false},
                    {headerName: 'ambassador', field: 'ambassador', width: 100},
                    {headerName: 'emv', field: 'emv', width: 100, cellRenderer: BaseGrid.emvRenderer},
                    {headerName: 'count', field: 'count', width: 50},
                ],
               'layout': {i: 'ambassador', x: 0, y: 2, w: 2, h: 2},
            },
            'hashtag': {
                'name': 'hashtag',
                'selectable': true,
                'row': 0,
                 'col': 3,
                'update': this.updateHashtags.bind(this),
                'columnDefs': [
                    {headerName: 'hashtag', field: 'hashtag', width: 100},
                    {headerName: 'emv', field: 'emv', width: 100, cellRenderer: BaseGrid.emvRenderer},
                    {headerName: 'count', field: 'count', width: 50},
                ],
                'layout': {i: 'hashtag', x: 0, y: 6, w: 2, h: 2},

            },
            'post': {
                'name': 'post',
                'selectable': false,
                'col': 1,
                'row': 1,
                'columnDefs': [
                    {headerName: 'tpid', field: 'tpid', width: 100, hide: false},
                    {headerName: 'publish time', field: 'publish_time', width: 100},
                    {headerName: 'link', field: 'link', width: 100},
                    {headerName: 'brand', field: 'brand', width: 100},
                    {headerName: 'ambassador', field: 'ambassador', width: 100},
                    {headerName: 'hashtag', field: 'hashtag', width: 100},
                    {headerName: 'emv', field: 'emv', width: 100, cellRenderer: BaseGrid.emvRenderer},
                    {headerName: 'views', field: 'views', width: 50},
                ]
            },
        };

        this.state = {
            brandSelection: null,
            ambassadorSelection: null,
            hashtagSelection: null,
            brand: null,
            ambassador: null,
            hashtag: null,
            startDate: moment().subtract(30, 'days'),
            endDate:  moment(),
            brandLoading: false,
            ambassadorLoading: false,
            hashtagLoading: false,
            postLoading: false
        };
    }

    componentDidMount() {
      //this.querySubmit()
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
      return encodeURIComponent(_.map(selections, a => a.value).join(','));
    }

    makeQuery(dim) {
        const q = `http://localhost:3000/api/q?` +
                `dim=${dim}&` +
                `start_date=${this.state.startDate.format('YYYY-MM-DD')}&` +
                `end_date=${this.state.endDate.format('YYYY-MM-DD')}&` +
                `ambassador_ids=${this.delimValues(this.state.ambassadorSelection)}&` +
                `brand_ids=${this.delimValues(this.state.brandSelection)}&` +
                `hashtags=${this.delimValues(this.state.hashtagSelection)}&` +
                `limit=20`;

        console.log(q);

        fetch(q).then(response => {
            return response.json()
        }).then(json => {
            this.setState({[dim+'Loading']: false});
            this.setState({[dim]: json});
        }).catch(error => {
            this.setState({[dim+'Loading']: false});
            console.log('error: ' + error.message);
        });
    };

    querySubmit() {
        _.map(this.dimensions, (_, name) => {
          // clear grids with loading overlay
          this.setState({[name + 'Loading']: true});

          // make the queries
          this.makeQuery(name)
        });
    }

    dateChange(startDate, endDate) {
      this.setState({startDate: startDate, endDate: endDate});
    }

  render() {

    return (
      <div>

      <ReactGridLayout className="layout" cols={12} rowHeight={30} width={1200}>

        <div key='dateSelector' data-grid={{x:0, y:0, h:3, w:2}} style={{padding: '4px'}}>
          <DateSelector initStartDate={this.state.startDate}
                    initEndDate={this.state.endDate}
                    update={this.dateChange.bind(this)}/>
        </div>
        <div key='optionsList' data-grid={{x:0, y:3, h:9, w:2}} style={{padding: '4px'}}>

          {/* filter option dropdown s*/}
          {_.chain(this.dimensions).filter(({'selectable': true})).map((dim) =>
             <MultiSelect key={dim.name} label={dim.name} options={dim.options} update={dim.update} />
          ).value()}

          {/* options submit button s*/}
          <div style={{padding: '4px'}}>
            <button onClick={this.querySubmit.bind(this)}>
              Submit Filters
            </button>
          </div>
        </div>

        {/* tables */}
        {_.chain(this.dimensions).map((dim) =>
            <div key={dim.name} data-grid={{x:(dim.col*2), y:(dim.row*8), h:9, w:2}}>
              <h2>{dim.name}</h2>
              <BaseGrid key={dim.name} type={dim.name} columnDefs={dim.columnDefs} rows={this.state[dim.name]}
                        loading={this.state[dim.name + 'Loading']}/>
            </div>
        ).value()}

      </ReactGridLayout>
      </div>
    )
  }
}
