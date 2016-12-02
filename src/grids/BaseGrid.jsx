'use strict';

import React from 'react';
import {AgGridReact} from 'ag-grid-react';

export default class BrandGrid extends React.Component {

    constructor() {
        super();

        this.state = {
            quickFilterText: null,
            showGrid: true,
            showToolPanel: false,
        };

        this.icons = {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
            groupExpanded: '<i class="fa fa-minus-square-o"/>',
            groupContracted: '<i class="fa fa-plus-square-o"/>',
            columnGroupOpened: '<i class="fa fa-minus-square-o"/>',
            columnGroupClosed: '<i class="fa fa-plus-square-o"/>'
        }
    }

    static emvRenderer(params) {
      if (params.value) {
          const emv = parseInt(params.value) / 1000000;
          return emv.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
      } else {
          return null;
      }
    }

    onGridReady(params) {
        this.api = params.api;
        this.columnApi = params.columnApi;
        this.api.showNoRowsOverlay();
    }

    onQuickFilterText(event) {
        this.setState({quickFilterText: event.target.value});
    }

    onCellClicked(event) {
        console.log('onCellClicked: ' + event.data.name + ', col ' + event.colIndex);
    }

    onRowSelected(event) {
        console.log('onRowSelected: ', event);
    }

    render() {
        const empty = !this.props.rows || this.props.rows.length == 0;

        if (this.api) {
            if (this.props.loading) {
                this.api.showLoadingOverlay()
            } else if (empty) {
                this.api.showNoRowsOverlay()
            } else {
                this.api.hideOverlay()
            }
        }

        return  <div style={{height: 300}} className="ag-fresh">
              <AgGridReact

                  // listening for events
                  onGridReady={this.onGridReady.bind(this)}
                  onRowSelected={this.onRowSelected.bind(this)}
                  onCellClicked={this.onCellClicked.bind(this)}

                  // binding to simple properties
                  showToolPanel={this.state.showToolPanel}
                  quickFilterText={this.state.quickFilterText}

                  // binding to an object property
                  icons={this.icons}

                  // binding to array properties
                  columnDefs={this.props.columnDefs}

                  // rowData={this.props.rowFactory.createRowData(this.props.selections)}
                  rowData={this.props.rows}

                  // no binding, just providing hard coded strings for the properties
                  rowSelection="multiple"
                  enableColResize="true"
                  enableSorting="true"
                  enableFilter="true"
                  groupHeaders="true"
                  rowHeight="22"
                  debug="true"
              />
          </div>
    }

}
