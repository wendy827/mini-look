const interfaces = require('../../utils/interfaces.js');
const utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    top: 0,
    curTypeIndex: 0,
    curTypeId: -1,
    bookList: [],
    bookType: [],
    start: 1,
    count: 20,
    isShow: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTypeData();
  },

  getTypeData: function () {
    const self = this;
    const url = interfaces.booktype;
    wx.request({
      url: url,
      method: 'GET',
      success: function (res) {
        if (res.data.success) {
          self.setData({
            bookType: res.data.data,
            curTypeId: res.data.data[0].id,
            isShow: 1
          });
          self.getTypebook(res.data.data[0].id, false);
        } else {
          wx.showToast({
            title: res.data.msg,
            duration: 3000,
            icon: "none"
          })
          self.setData({
             isShow:2
          })
        };

      },
      fail: function (res) {
        wx.showToast({
          title: "请求异常",
          duration: 3000,
          icon: "none"
        });
      }
    })
  },
  getTypebook: function (id, isLoadMore) {
    const self = this;
    const url = interfaces.booklist;
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: url,
      method: 'POST',
      data: {
        catalog_id: id,
        pn: self.data.start,
        rn: self.data.count
      },
      success: function (res) {
        if (res.data.success) {
          for (let i = 0; i < res.data.data.data.length; i++) {
            res.data.data.data[i].tagArr = utils.trimSpace(res.data.data.data[i].tags.split(" "));
            let cataArr = res.data.data.data[i].catalog.split(" ");
            if (cataArr.length > 2) {
              cataArr.shift();
            }
            res.data.data.data[i].catalog = cataArr.join(" ");
          }
          if (isLoadMore) {
            const newlist = self.data.bookList.concat(res.data.data.data);
            self.setData({
              bookList: newlist,
              top: 0,
              isShow: 1
            })
          } else {
            self.setData({
              bookList: res.data.data.data,
              top: 0,
              isShow: 1
            })
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            duration: 3000,
            icon: "none"
          });
          self.setData({
            isShow: 2
          })
        };
        wx.hideLoading();
      },
      fail: function (res) {
        wx.showToast({
          title: "请求异常",
          duration: 3000,
          icon: "none"
        });
        wx.hideLoading();
      }
    })
  },
  changeType: function (e) {
    const idx = e.currentTarget.dataset.index;
    const id = e.currentTarget.dataset.cataid;
    if (this.data.curTypeIndex != idx) {
      this.setData({
        curTypeIndex: idx,
        curTypeId: id
      })
      this.getTypebook(id, false);
    }
  }
})