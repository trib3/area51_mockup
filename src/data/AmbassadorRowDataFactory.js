import _ from 'underscore';

export default class AmbassadorRowDataFactoryDEPRECATED {

    constructor(data) {
      this.data = data
    }

    createRowData(selections) {

      var amb_reduce =
        (acc, row) => ({'ambassador': acc['ambassador'], 'emv': acc['emv'] + row['emv']})

      // group selected brands and sum their emv
      var reduced_brands  = _.chain(this.data)
        .filter(row =>
          selections['brand'].includes(row['brand'])
          && selections['ambassador'].includes(row['ambassador']))
        .groupBy(row => row['ambassador'])
        .map(brand => _.reduce(brand, amb_reduce))
        .value()

      return reduced_brands;
    }
}
