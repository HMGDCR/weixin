const app = getApp()

// pages/home/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radio: '1',
    count: 2,
    current: 0,
    show: false,
    show2: false,
    show3: false,
    detailData:{},//详情的数据
    productId:"" ,//这是商品详情的Id
    productNum:0,//购物车的数量
  },
  goBack:function(){
    this.$router.go(-1)
  },
  buyImmediate:function(){
      this.$router.push("/order/confirm")
  },
  onClickIcon:function() {
      this.$router.push("/cart/befor")
  },
  onClickButton:function() {
      
  },
  onChange:function(index) {
      this.current = index;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取商品列表传来的商品id
    let productId = options.productId;
    this.setData({
      productId: productId
    })
    console.log("传值Id", productId)   
    this.getDetail(productId)
  },
  /////////////////////////获取商品详情数据方法
  getDetail(productId){
 

    wx.showToast({
      title: '加载中...',
      mask: true,
      icon: 'loading'
    })

    let url ="/product/detail"
    let data = {
      productId
    }
    app.$get(url,data).then(res=>{
      console.log("商品的详情数据",res)

      wx.hideToast()
      this.setData({
        detailData: res.result,
        productNum:res.result.cartNum
      })
   
    }).catch(err=>{
      wx.hideToast()
      console.log("获取失败：",err)
    })
  },
  /////////////////////////添加到购物车
  cartAdd(){
    //注意我们这里使用的商品Id为商品列表穿过来的，而不是商品详情的Id
    let url ='/cart/add'
    let data = {
      productId: this.data.productId,
      buyNum:1
    }
    app.$get(url,data).then(res=>{  
     //当添加购物车成功后，需要给购物车中商品的数量重新赋值
     //注意，我们每点击一次就累加一次，累加的基础是从购物车获取到的数据
      this.setData({
        productNum: this.data.productNum+1
      })     
    
    }).catch(err=>{  
      console.log("添加失败：",err)
    })
  },

  /////////////////////////跳转到购物车
  gotoCart(){
    let url ="/pages/cart/cart"
    wx.switchTab({
      url:url
    })
  },
//////////////////////////调用购物车的数据
getCartData(){
  let url = "/cart/all"
  app.$get(url).then(res=>{
    console.log("购物车的数据：",res)
    //遍历数组，拿到商品总数量
    let num = 0
    res.list.forEach(item=>{
      num+=item.buyNum
    })
    this.setData({
      productNum:num
    })
  }).catch(err=>{
    console.log("获取购物车数据失败",err)
  })
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
    this.getCartData()
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