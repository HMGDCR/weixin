


const app =getApp()


// pages/order/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:"",//订单Id
    isPay:false,//是否支付
    addressInfo:{},//地址信息
    carts:[],//商品
    totalPrice:0,//商品总价
    total_fee: 0,//实付金额    
    updateTime:0,//时间戳
    expressFee:0 ,//运费
    tiem:""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options.orderId", options.orderId)
    console.log("options.isPay", options.isPay)
    let isPay = options.isPay=='true'?true:false
    // wx.setStorageSync("orderId", options.orderId)
    this.setData({
      orderId:options.orderId,
      isPay:isPay,

    })
    /////////////////调用数据
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
    this.getList()
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
  //////////////////////////////方法部分
  getList(){
  
    let url ="/order/detail"
    let data ={
      orderId: this.data.orderId
    
    }
    app.$get(url,data).then(res=>{
      console.log("获取",res)

      this.setData({
        addressInfo: res.result.addressInfo,
        carts: res.result.carts,
        total_fee: res.result.total_fee,
        totalPrice: res.result.totalPrice,
        updateTime: res.result.updateTime,
        expressFee: res.result.expressFee
      })
     
      let date = new Date(this.data.updateTime)

      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours()
      const minute = date.getMinutes()
      const second = date.getSeconds()
      let tiem = `${year}-${month}-${day} ${hour}:${minute}:${second}`
      this.setData({
        tiem: tiem
      })
     
    }).catch(err=>{
      console.log("err",err)
    })
  },
  ///////////////////////////跳转到地址详情
  goAddress(){
    wx.navigateTo({
      url: '/pages/address/list/list',
    })
  },
  /////////////////跳转到订单列详情
  goOrderComfirm(){

wx.navigateTo({
  url: `/pages/order/orderConfirm/index`,
})
  },
})