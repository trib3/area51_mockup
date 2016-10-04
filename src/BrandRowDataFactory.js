import _ from 'underscore';

export default class BrandRowDataFactory {

    constructor(data, selections) {
      this.data = data
    }

    createRowData(selections) {

        var brand_reduce = function(acc, row) {
          return {'brand': acc['brand'], 'emv': acc['emv'] + row['emv']}
        }

        // group selected brands and sum their emv
        var reduced_brands  = _.chain(this.data)
          .filter(function(row) { return selections['brands'].includes(row['brand']) }.bind(this))
          .groupBy(function(row) { return row['brand'] })
          .map(function(brand) { return _.reduce(brand, brand_reduce) })
          .value()

        return reduced_brands;
    }
}
