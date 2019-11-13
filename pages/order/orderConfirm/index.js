const app = getApp()


// pages/order/orderConfirm/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    isShow:false,
    preOrder:[] ,//预定单的数据
    totalMoney:0,//商品总价
    expressFee:0,//运费
    discountMoney:0,//优惠金额
    preOrderId:"",
    total_fee:0,//实付金额
    couponNum:0,//可使用优惠券的张数
    preOrderIdOlder:"",//预订单的Id,用于提交订单传参
   

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //////获取购物车传递的预订单Id
    let preOrderId= options.preOrderId  
    this.setData({
      preOrderId: preOrderId,
    
    })  
  
    /////调用详情的数据
    this.getListData(preOrderId)


   let isShow= JSON.stringify(options) != "{}"?true:false
    // wx.setStorageSync('isShow', isShow)
  
   this.setData({
     isShow: isShow
   })
    
    if (isShow){
      let address = JSON.parse(options.item)  
      wx.setStorageSync('address', address)     
      wx.setStorageSync('isShow', isShow)
      this.setData({
        address: address,        
      })
    }
  
  
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
    let isShow = wx.getStorageSync("isShow");
    let address = wx.getStorageSync("address") 
    this.setData({
      isShow: wx.getStorageSync("isShow"),
       address
    })
//////////////////获取缓存的数据
    this.setData({
      preOrder: wx.getStorageSync("preOrder"),
      totalMoney: wx.getStorageSync("totalMoney"),
      expressFee: wx.getStorageSync("expressFee"),
      preOrderIdOlder:wx.getStorageSync("preOrderIdOlder")
     
    })
  
 
    ////////////////调用计算总价钱的方法
    this.computeMoney()
    /////////调用优惠券的张数的方法
    this.getCoupon()
   

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
////////////////////////////////////////方法部分

///////////////////获取预定订单详情
  getListData(preOrderId){

   let isShow= preOrderId!=undefined
    console.log("isShow", isShow)
    if (!isShow){          
          return false;
        }else{
          //如果有预订单的Id有值，就清除缓存
      wx.removeStorageSync("preOrder")
      wx.removeStorageSync("totalMoney")
      wx.removeStorageSync("expressFee")
      //////清除优惠金额
      wx.removeStorageSync("discountMoney")
      wx.removeStorageSync("preOrderIdOlder")


          let url = "/preOrder/detail";
          let data = {
            preOrderId: preOrderId
          }
          app.$get(url, data).then(res => {           
            console.log("详情数据", res)
            let money = 0
            res.result.carts.forEach(item => {
              money += item.buyNum * item.price
            })
            //////////判断是否符合免运费
            if (money > res.result.fullReduceMoney) {
              this.setData({
                expressFee: 0
              })
            }
            else {
              this.setData({
                expressFee: res.result.expressFee
              })
            }
            this.setData({
              preOrder: res.result.carts,
              totalMoney: money,
              preOrderIdOlder: preOrderId

            })          
            wx.setStorageSync("preOrder", res.result.carts)
            wx.setStorageSync("totalMoney", money)
            wx.setStorageSync("expressFee", this.data.expressFee)
            wx.setStorageSync("preOrderIdOlder", preOrderId)
            //////调用计算实付金额的方法
            this.computeMoney()

          }).catch(err => {
            console.log("获取失败", err)
          }) 
        }       
  },


  /////////////跳转到地址列表的方法
  goAddressList() {
    wx.redirectTo({     
      url: '/pages/address/list/list'
    })
  },
  /////////////////跳转到优惠券组件
  goCoupon(){   
    wx.redirectTo({
      url: '/pages/order/coupon/coupon?totalMoney=' + this.data.totalMoney,
    })
  },
  /////////////////定义一个计算实际支付的方法
  computeMoney(){
    // 总价=商品总价+运费-优惠 
    this.setData({
      discountMoney:wx.getStorageSync("discountMoney")
    })
    let total_fee =this.data.totalMoney+this.data.expressFee- this.data.discountMoney
    this.setData({
      total_fee: total_fee
    })

  },

  ///////////////判断有张可用优惠券

  getCoupon() {
    let url = "/coupon/all"

    app.$get(url).then(res => {
      //////////////根据商品的总价对优惠券进行分类
      this.sortCoupon(res.list)
    }).catch(err => {
      console.log("优惠券失败", err)
    })
  },

  ///////////////////分类优惠券的方法
  sortCoupon(list) {
    let totalMoney = this.data.totalMoney
    //////////////遍历优惠券数组，并进行分类
    let ableUseCoupon = [] 
    for (let i = 0; i < list.length; i++) {
      if (totalMoney > list[i].conditionValue) {
        ableUseCoupon.push(list[i])
      } 
    }
    //////////判断如果优惠券的金额不为0，就显示优惠金额，否则显示优惠张数
    let discountMoney=wx.getStorageSync("discountMoney")
    if (discountMoney){
      this.setData({
        couponShow: '-'+discountMoney/100+"元"
      })
    }
    else{
      this.setData({
        couponShow: ableUseCoupon.length + "张券可用"
      })
    } 
  },
/////////////////////////提交订单的方法

prePay(){ 
  let discount = this.data.discountMoney == false ? 0 : this.data.discountMoney
  let url = "/order/getPayInfo" 
  let data={
    preOrderId: this.data.preOrderIdOlder,
    addressInfo: this.data.address,
    discount: discount,
    expressFee: this.data.expressFee,
    totalPrice: this.data.totalMoney,
    total_fee: this.data.total_fee
  }
  console.log("确认订单参数",data)
 app.$post(url,data).then(res=>{
   console.log("支付",res)
   let qrcode = res.result.qrcode
   let orderId = res.result.orderId
  
   wx.redirectTo({
     url: `/pages/pay/pay/pay?qrcode=${qrcode}&orderId=${orderId}&total_fee=${this.data.total_fee}`,
   })
 }).catch(err=>{
   console.log("失败",err)
 })

}


})


