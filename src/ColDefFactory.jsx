export default class ColDefFactory {

    createColDefs() {

        var columnDefs = [
          {headerName: 'brand', field: 'brand', width: 100},
          {headerName: 'ambassador', field: 'ambassador', width: 100},
          {headerName: 'channel', field: 'channel', width: 100},
          {headerName: 'date', field: 'date', width: 100},
          {headerName: 'post', field: 'post', width: 250},
          {headerName: 'hashtags', field: 'hashtags', width: 150},
          {headerName: 'emv', field: 'emv', width: 150}
        ];
        return columnDefs;
    }
}
