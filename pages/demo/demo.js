const app =getApp()
// pages/demo/demo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    adTitle: '你的需求',
    username:"h",
    userpawss:"1"

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 

  },

  //进步器
  onChange(event) {
    console.log(event.detail);
  },

  //输入框的事件
  adInputChange: function (e) {
    console.log("eeeeeeee",e)   
    let value = e.detail.value
    let aa = e.dataset.name
    
    console.log("值：", aa) 
    // this.setData({
    //   [aa]:value
    // })
  },
  submit(){
    console.log("名字：",this.data.username,"密码：",this.data.userpawss)
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

  }
})