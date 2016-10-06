export default class MyDataFactory {

    constructor() {
      this.CHANNELS = ['facebook', 'instagram', 'youtube']
      this.AMBASSADORS = ['Amy Zee', 'Baby Yak', 'Chili X', 'Dingo Why', 'Ernie V']
      this.HASHTAGS = ['#apple', '#banana', '#cucumber', '#dill', '#egg', '#fave', '#giraffe', '#magic']
      this.BRAND = ['brand x', 'brand y', 'brand z']
      this.date = new Date()
      this.data = this.createData()
    }

    getData() {
      return this.data
    }

    randomVal(arr) {
        return arr[Math.floor((Math.random() * 171)) % arr.length]
    }

    createData() {
        var rowData = [];

        for (var i = 0; i < 1000; i++) {

          var brand = this.randomVal(this.BRAND)
          var channel = this.randomVal(this.CHANNELS)
          var ambassador = this.randomVal(this.AMBASSADORS)
          var hashtags = this.randomVal(this.HASHTAGS) + ' ' + this.randomVal(this.HASHTAGS)
          this.date.setDate(this.date.getDate() + 1)

          rowData.push({
              brand: brand,
              ambassador: ambassador,
              channel: channel,
              date: this.date.getFullYear() + '-' + this.date.getMonth() + '-' + this.date.getDate(),
              post: 'post ' + i + ' text stuff ' + hashtags,
              hashtags: hashtags,
              emv: Math.random() * 10000
          })
        }
        
        return rowData;
    }
}
