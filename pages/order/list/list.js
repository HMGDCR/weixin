const app = getApp()


// pages/order/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:"",//订单Id
    list:[],//数据列表
    // num:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        orderId: options.orderId
      })
      this.getList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /////////////////////////方法部分


  //获取列表的数据方法
  getList(){

    wx.showToast({
      title: '加载中...',
      mask: true,
      icon: 'loading'
    })

    let url = "/order/all"
 
    app.$get(url).then(res=>{    
    
      this.orderNum(res.list)
      wx.hideToast()
    }).catch(err=>{
      wx.hideToast()
      console.log("err",err)
    })
  },
    /////////计算购买数量
  orderNum(list){
    var  list =list.map(item=>{
      let num=0
      item.carts.forEach(items=>{
        num+=items.buyNum
      })
      return {
        ...item,
        num:num
      }
    })
    this.setData({
      list:list
    })
    console.log("111111111", list)
  },
})