//index.js
//获取应用实例
var app = getApp()
var hotapp = require('../../utils/hotapp.js');
Page({
  data: {
    hello: '早上好:',
    userInfo: {},
    accounts: ["上海", "北京", "山东"],
    types: ['95号', '92号', '0号', '89号', '90号', '93号', '97号'],
    accountIndex: 0,
    typeIndex:0,
    p95: null,
    p92: null,
    p0: null,
    p89: null,
    p90: null,
    p93: null,
    p97: null,
    city: '上海',
    typen:'95号',
    today: null,
    showLoading: true,
    updatetime: null,
    hislist:[]
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this
    var date = new Date();
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();

    var today = y + '年' + m + '月' + d + '日';
    var hour = date.getHours();
    if (hour < 6) { var hello = "凌晨好！" }
    else if (hour < 9) { var hello = "早上好！" }
    else if (hour < 12) { var hello = "上午好！" }
    else if (hour < 14) { var hello = "中午好！" }
    else if (hour < 17) { var hello = "下午好！" }
    else if (hour < 19) { var hello = "傍晚好！" }
    else if (hour < 22) { var hello = "晚上好！" }
    else { var hello = "夜里好！" }
    that.setData({
      hello: hello,
      today: today
    })
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    }),
      wx.request({
        url: 'https://www.zzlphp.com/api/today/regionlist',
        success: function (result) {
          var arr = [];
          for (var obj in result.data) {
            arr.push(result.data[obj].subsite_name)
          }
          that.setData({
            accounts: arr
          })
        }
      });
    this.gethistorylist();
  },
  selectcity: function (e) {
    var that = this;
    that.setData({
      city: this.data.accounts[e.detail.value],
      accountIndex: e.detail.value,
      showLoading: true
    });
      that.gethistorylist();
  },
  selecttype:function(e){
    var that = this
    that.setData({
      typen: this.data.types[e.detail.value],
      typeIndex: e.detail.value,
      showLoading: true
    });
    this.gethistorylist();
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '今日油价',
      desc: '今日油价',
      path: '/pages/index/index'
    }
  },
  shareoil: function () {
    wx.showShareMenu({
      title: '今日油价',
      desc: '今日油价',
      path: '/pages/index/index'
    })
  },
  gethistorylist:function(e){
    var that = this
    hotapp.wxlogin();
    var openid = hotapp.getOpenID();
    wx.request({
      url: 'https://www.zzlphp.com/api/today/historyoilprice',
      data: { 
        city: this.data.city,
        typen:this.data.typen,
        openid: openid,
        userinfo: that.data.userInfo 
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          hislist: res.data,
          showLoading: false
        })
      }
    })
  }
})
