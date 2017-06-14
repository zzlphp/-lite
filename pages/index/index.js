//index.js
//获取应用实例
var app = getApp()
var hotapp = require('../../utils/hotapp.js');
Page({
  data: {
    hello: '早上好:',
    userInfo: {},
    accounts: ["上海", "北京", "山东"],
    accountIndex: 0,
    p95:null,
    p92: null,
    p0: null,
    p89: null,
    p90: null,
    p93: null,
    p97: null,
    city:'上海',
    today: null,
    showLoading:true,
    updatetime:null 
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this
    var date = new Date();
    var y = date.getFullYear();
    var m = date.getMonth()+1;
    var d = date.getDate();

    var today = y+'年'+m+'月'+d+'日';
    var hour = date.getHours();
    if (hour < 6) { var hello="凌晨好！" }
    else if (hour < 9) { var hello ="早上好！" }
    else if (hour < 12) { var hello ="上午好！" }
    else if (hour < 14) { var hello ="中午好！" }
    else if (hour < 17) { var hello ="下午好！" }
    else if (hour < 19) { var hello ="傍晚好！" }
    else if (hour < 22) { var hello ="晚上好！" }
    else { var hello ="夜里好！" } 
    that.setData({
      hello:hello,
      today: today
    })
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    }),
    wx.request({
      url: 'https://www.zzlphp.com/api/today/regionlist',
      success:function(result){
        var arr = [];
        for (var obj in result.data) {
          arr.push(result.data[obj].subsite_name)
        }
          that.setData({
            accounts: arr
          })
      }
    });
    wx.request({
      url: 'https://www.zzlphp.com/api/today/oilprice',
      success:function(res){
        that.setData({
          p95: res.data[0].p95,
          p92: res.data[0].p92,
          p0: res.data[0].p0,
          p89: res.data[0].p89,
          p90: res.data[0].p90,
          p93: res.data[0].p93,
          p97: res.data[0].p97,
          accountIndex: res.data[0].key_index,
          city: res.data[0].city,
          updatetime: res.data[0].update_time,
          showLoading:false
        })
      }
    })
  },
  selectcity: function (e) {
    var that = this
    this.setData({
      city: this.data.accounts[e.detail.value],
      accountIndex: e.detail.value,
      showLoading: true
    }),
    hotapp.onEvent("selectcity", this.data.accounts[e.detail.value])
    wx.request({
      url: 'https://www.zzlphp.com/api/today/oilprice',
      data: { city: this.data.accounts[e.detail.value]},
      success:function(res){
        that.setData({
          p95: res.data[0].p95,
          p92: res.data[0].p92,
          p0: res.data[0].p0,
          p89: res.data[0].p89,
          p90: res.data[0].p90,
          p93: res.data[0].p93,
          p97: res.data[0].p97,
          updatetime: res.data[0].update_time,
          showLoading: false
        })
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: '今日油价',
      desc: '今日油价',
      path: '/pages/index/index'
    }
  }
})
