import _ from 'underscore';

export default class BrandRowDataFactoryDEPRECATED {

    constructor(data, selections) {
      this.data = data
    }

    createRowData(selections) {

      var brand_reduce =
        (acc, row) => ({'brand': acc['brand'], 'emv': acc['emv'] + row['emv']})

      // group selected brands and sum their emv
      var reduced_brands  = _.chain(this.data)
        .filter(row =>
          selections['brand'].includes(row['brand'])
          && selections['ambassador'].includes(row['ambassador']))
        .groupBy(row => row['brand'])
        .map(brand => _.reduce(brand, brand_reduce))
        .value()

      return reduced_brands;
    }
}
