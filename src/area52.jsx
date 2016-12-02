import React from 'react';
import MultiSelect from './MultiSelect.jsx'
import BaseGrid from './grids/BaseGrid.jsx'
import _ from 'lodash';

import {Grid, Row, Col} from 'react-flexbox-grid';

import './myApp.css';

export default class Area52 extends React.Component {

  constructor() {
    super();

        this.dimensions = {
            'brand': {
                'name': 'brand',
                'selectable': true,
                'row': 0,
                'update': this.updateBrands.bind(this),
                'columnDefs':[
                    {headerName: 'brand id', field: 'brand_id', width: 100, hide: true},
                    {headerName: 'brand', field: 'brand', width: 100},
                    {headerName: 'emv', field: 'emv', width: 100, cellRenderer: BaseGrid.emvRenderer},
                    {headerName: 'count', field: 'count', width: 50},
                ]
            },
            'ambassador': {
              'name': 'ambassador',
              'selectable': true,
              'row': 0,
                'update': this.updateAmbassadors.bind(this),
                'columnDefs': [
                    {headerName: 'ambassador id', field: 'ambassador_id', width: 100, hide: true},
                    {headerName: 'ambassador', field: 'ambassador', width: 100},
                    {headerName: 'emv', field: 'emv', width: 100, cellRenderer: BaseGrid.emvRenderer},
                    {headerName: 'count', field: 'count', width: 50},
                ]
            },
            'hashtag': {
                'name': 'hashtag',
                'selectable': true,
                'row': 0,
                'update': this.updateHashtags.bind(this),
                'columnDefs': [
                    {headerName: 'hashtag', field: 'hashtag', width: 100},
                    {headerName: 'emv', field: 'emv', width: 100, cellRenderer: BaseGrid.emvRenderer},
                    {headerName: 'count', field: 'count', width: 50},
                ]
            },
            'post': {
                'name': 'post',
                'selectable': false,
                'row': 1,
                'columnDefs': [
                    {headerName: 'tpid', field: 'tpid', width: 100},
                    {headerName: 'post_link', field: 'post_link', width: 100},
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
            start_date: '2016-11-01',
            end_date: '2016-12-01',
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
                `start_date=${this.state.start_date}&` +
                `end_date=${this.state.end_date}&` +
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

            console.log('received rows', dim, json.length)
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

  render() {

    const selectTemplates = (
      <div key='select_templates' style={{padding: '4px'}}>
        {_.chain(this.dimensions).filter(({'selectable': true})).map((dim) =>
           <MultiSelect key={dim.name} label={dim.name} options={dim.options} update={dim.update} />
        ).value()}
        <div style={{padding: '4px'}}>
          <button onClick={this.querySubmit.bind(this)}>
            Submit Filters
          </button>
        </div>
      </div>
    );


    return <Grid>
      <Row>
        <Col key='st' xs>
          {selectTemplates}
        </Col>
          {_.chain(this.dimensions).filter(({'row':0})).map((dim) =>
              <Col key={dim.name} xs>
                <h2>{dim.name}</h2>
                <BaseGrid key={dim.name} type={dim.name} columnDefs={dim.columnDefs} rows={this.state[dim.name]}
                          loading={this.state[dim.name + 'Loading']}/>
              </Col>
          ).value()}
      </Row>
      <Row>
        <Col key="post_col" xs>
          <h2>posts</h2>
          <BaseGrid key="post" type="post" columnDefs={this.dimensions.post.columnDefs} rows={this.state.post}
                        loading={this.state.postLoading} />
        </Col>
      </Row>
    </Grid>
  }
}
