import _ from 'underscore';

export default class RowDataFactory {

    constructor(data, type, dims) {
      this.data = data
      this.type = type
      this.dims = dims
    }

    createRowData(selections) {

      // curried filter: rowFilter(types)(row) => boolean
      var rowFilter = (types) => (row) =>
        _.chain(types)
          .map(type => selections[type][0].length == 0 || selections[type].includes(row[type]))
          .reduce((acc, b) => acc && b)
          .value()

      // special square bracket syntax to add variable to literal key
      var sum_emv = (acc, row) =>
        ({[this.type]: acc[this.type], 'emv': acc['emv'] + row['emv']})

      // group selected brands and sum their emv
      var reduced_brands =
        _.chain(this.data)
          .filter(rowFilter(this.dims))
          .groupBy(row => row[this.type])
          .map(brand => _.reduce(brand, sum_emv))
          .value()

      return reduced_brands;
    }
}
