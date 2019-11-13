const app  =getApp()

// pages/order/coupon/coupon.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalMoney:0,
    ableUseCoupon:[],//能够使用的优惠券
    disAbleUseCoupon:[],///不能够使用优惠券
    abLength:0,//可用张数
    disLength:0,//不可用张数
    radio:""


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /////////////////////获取确认订单传过来的商品总价
    let totalMoney = options.totalMoney
    this.setData({
      totalMoney: totalMoney
    })

    this.getCoupon(totalMoney)
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


  /////////////////////////////方法的部分

  /////////////获取优惠券列表的方法
  getCoupon(){
    let url = "/coupon/all"
   
    app.$get(url).then(res=>{    
      //////////////根据商品的总价对优惠券进行分类
     this.sortCoupon(res.list)  
    }).catch(err=>{
      console.log("优惠券失败",err)
    })
  },
  ///////////////////分类优惠券的方法
  sortCoupon(list){   
    let totalMoney=  this.data.totalMoney
    //////////////遍历优惠券数组，并进行分类
    let ableUseCoupon=[]
    let disAbleUseCoupon=[]
    for(let i=0;i<list.length;i++){
      if (totalMoney > list[i].conditionValue){
     ableUseCoupon.push(list[i])
      }else{
        disAbleUseCoupon.push(list[i])
      }
    }
    this.setData({
      ableUseCoupon:ableUseCoupon,
      disAbleUseCoupon:disAbleUseCoupon,
      abLength: ableUseCoupon.length,
      disLength: disAbleUseCoupon.length


    })
    return [ableUseCoupon, disAbleUseCoupon]

  },
  ///////////////////计算优惠金额
  computeCoupon(obj){
    wx.removeStorageSync("discountMoney")
    console.log("111111",obj)
    ///////先判断点击的是优惠券还是不使用优惠券

    //////获取点击优惠券的信息
    let index=obj.currentTarget.dataset.index
    
    let discountMoney=0
    /////计算优惠金额
    if(index==1){//使用优惠券
      let objs = obj.currentTarget.dataset.item 
      console.log("obj",obj)   
      discountMoney=objs.value     
      wx.setStorageSync("discountMoney", discountMoney)
     this.setData({
       radio: ""+obj.currentTarget.dataset.i
     })
    }else{//不使用优惠券     
      wx.setStorageSync("discountMoney", discountMoney)
    }
    wx.navigateTo({
      url: '/pages/order/orderConfirm/index',
    })
      // wx.redirectTo({
      //    url: '/pages/order/orderConfirm/index',
      // })
  }

})