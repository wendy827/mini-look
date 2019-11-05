const interfaces = require('../../utils/interfaces.js');
const months = [];
const days = [];

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

for (let i = 1; i <= 31; i++) {
  days.push(i)
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    curday: "",
    months: months,
    days: days,
    value: [0, 0],
    hidePicker: true,
    list: []
  },
  onLoad: function (options) {
    let month = new Date().getMonth() + 1;
    let day = new Date().getDate();
    let curDay = month + '月' + day + '日';
    this.setData({
      curday: curDay
    })
    this.getList(month, day);
  },
  getList: function (month, day) {
    const self = this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: interfaces.historyeventold,
      data: {
        month: month,
        day: day
      },
      method: 'POST',
      success: function (res) {
        if (res.data.success) {
          self.setData({
            list: res.data.data
          });
        } else {
          wx.showToast({
            title: res.data.msg,
            duration: 3000,
            icon: "none"
          })
        }
        wx.hideLoading();
      },
      fail: function (res) {
        wx.showToast({
          title: '请求异常',
          duration: 3000
        });
        wx.hideLoading();
      }
    })
  },
  isHidePicker: function (e) {
    this.setData({
      hidePicker: e.currentTarget.dataset.ishide
    })
  },
  surePicker: function () {
    let month = this.data.value[0] + 1;
    let day = this.data.value[1] + 1;
    let curDay = month + '月' + day + '日';
    this.setData({
      curday: curDay
    })
    this.getList(month, day);
    this.setData({
      hidePicker: true
    })
  },
  bindChange: function (e) {
    const val = e.detail.value;
    this.setData({
      value: val
    })
  },
  catchtouchPickermove: function () { }
})