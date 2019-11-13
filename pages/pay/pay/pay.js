const app =getApp()

// pages/pay/pay/pay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:"",
    count:5,/////倒计时
   
    qrcode:"",////二维码地址
    total_fee:0,//实付金额
    time:null,
    times:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    console.log("实付金额", options.total_fee)
   this.setData({
     orderId:options.orderId,
     qrcode: options.qrcode,
     total_fee: options.total_fee,
     
   })

    /////调用轮询的方法
    this.payResult()
    /////////调用定时器的方法
    this.loop()
    
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
  clearInterval(this.data.time)
  clearTimeout(this.data.times)
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
  //////////////////////////////////////////////////方法的部分
  ////////////支付倒计时
  loop(){
    let time=setInterval(()=>{
      console.log("11111111111111111")
      this.setData({
        count: --this.data.count
      })
      if(this.data.count==0){
        clearInterval(time)
      }
    },1000)
    this.setData({
      time
    })
  },
  /////调用轮询的方法
  payResult(){   
    // console.log("options",this.data.orderId)
    let orderId = this.data.orderId
    let url ="/order/payResult"
    let data={
      orderId:orderId
    }
    app.$get(url,data).then(res=>{
    ///////////支付有结果
      if (res.result.haveResult){       
        let title = res.result.payStatus=='01'?'成功':"失败"
       wx.showModal({
         title:"温馨提示",
         content: '支付'+title,
         success(res2){
           if(res2.confirm){
             let isPay =true        
             wx.redirectTo({
                 url: `/pages/order/detail/detail?orderId=${orderId}&isPay=${isPay}`,
               })
         
            
           }
         }

       })
       return false

      }
      
      if(this.data.count>0){
  //////////////// 支付没有结果
  let times=setTimeout(()=>{
    console.log("333333333333333333")
    this.payResult()
  },1000)

this.setData({
  times
})
  return false;

      }
      //////////倒计时结束
      wx.showModal({
        title: "温馨提示",
        content: '支付失败',
        success(res3) {
          let isPay = false   
          // setTimeout(() => {
            wx.navigateTo({
              url: `/pages/order/detail/detail?orderId=${orderId}&isPay=${isPay}`,
            })
          // }, 3000)
        }

      })
    }).catch(err=>{
      console.log("支付失败",err)
    })
  },



})