const app = getApp()

// pages/cart/cart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartList:[],
    isSelectAll:false,
    totalMoney:0,//商品总价钱
    isEdit:false,//判断是否是编辑页面  
    deleList:[] ,//删除的数组  ,
    deleListCartIndex:[],//删除购物车的Id
    isButton: true,//是否可以点击,
    isAbleSelete:false,//是否禁用复选框
  
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },
  //////////////////进步器
  onChange(event) {   
    let buyNum = event.detail
    let index = event.currentTarget.dataset.index
    //每点击一次，就发送修改请求
    let cartId = this.data.cartList[index].cartId   
   
    let data={
      buyNum: buyNum,
      cartId: cartId
    }
    let url ='/cart/updateNum'
    app.$get(url,data).then(res=>{

//////////////当前商品的
    let obj = {
      ...this.data.cartList[index],
      buyNum: data.buyNum,
    }
    
      let cartLists = this.data.cartList
      cartLists.splice(index, 1, obj)
   this.setData({
     cartList: cartLists
   })

   /////////////////////修改完后，需要对价钱重新调用 ，我们需要传递的数组是选中的数据给计算合计的方法，而不是传递整个数据 
      this.countMoney(this.getSelectArr())

    }).catch(err=>{
      console.log("修改失败",err)
    })

  },

////////////////////////筛选出已经选中的数组
getSelectArr(){
let arr=  this.data.cartList.filter(item=>{
    return item.checked==true
  })
  return arr
},

  //////////////提交
  onClickButton(){   
    //调用已经选中的方法，拿到cartId
  let arrId=  this.getSelectArr().map(item=>{
    return item.cartId
  }) 
    //提交订单，我们需要发请求
    let url = "/preOrder/add"
    let data = {
      totalMoney: this.data.totalMoney,
      cartId:arrId
    }
    console.log("购物车data",data)
    app.$post(url,data).then(res=>{
      console.log("111",res)
      console.log("res.result.preOrderId", res.result.preOrderId)
        wx.navigateTo({
          url: '/pages/order/orderConfirm/index?preOrderId=' + res.result.preOrderId,
  })
 
    }).catch(err=>{
      console.log("2222",err)
    })  


  },
   //////////////删除
  onDelet(){
    let arr = this.getSelectArr()    
    // 遍历拿到即将要删除的数组，拿到购物车的Id
   if(arr.length>0){   
     let url = '/cart/del'

    let carId = arr.map(item => {
       return item.cartId
     })
     let data = {
       cartId: carId
     }

     app.$post(url, data).then(res => {
       console.log("删除成功", res)   
       //删除成功后需要重新渲染页面
       this.getCartList()
       //删除成功后重新调用全选，解决当全删的时候合计栏的数据没有更新的问题
     this.selectAll()  
     //判断如果删除的长度和购物车的列表的长度相等，就禁用复选框
     if(this.data.cartList.length==arr.length){       
       this.setData({
         isAbleSelete:true
       })     
     }
     }).catch(err => {
       console.log("删除失败", err)
     })

   }  

  },

/////////////编辑与完成的切换
  goEdit(e){
   let isEdit= !this.data.isEdit
this.setData({
  isEdit: isEdit
})
  },

  ////////////////////获取购物车列表的所有数据
  getCartList(){

    wx.showToast({
      title: '加载中...',
      mask: true,
      icon: 'loading'
    })

    let url ="/cart/all"
    app.$get(url).then(res=>{
      wx.hideToast()
      // 我们要通过一个临时数组，来存值，然后再通过setData来赋值，否则会渲染不了
      let arr = res.list.map(item=>{
        return {
          ...item,
          checked:false,
          isStepper:true
        }
      })
      //判断如果列表的数据为空，就禁用复选框
      if(arr.length>0){
        this.setData({
          isAbleSelete: false,
          cartList:arr
        })
      }

      else{
        this.setData({
          isAbleSelete: true,
          cartList:[]
        })
      } 
    
    }).catch(err=>{
      wx.hideToast()
      console.log("失败：",err)
    })
  },

//////////合计的方法
  countMoney(list){ 
    let money=0
    list.forEach(item=>{
      money += item.buyNum * item.price
    })
    this.setData({
      totalMoney:money
    })   
  },

  //////////////单选按钮点击
  changeChecked(e){   
    let index=e.currentTarget.dataset.index
    console.log("index", index)
    this.data.deleListCartIndex.push(index)   
//注意：我们对数据进行更改后，需要重把最新的数据赋值给列表，否则不能渲染
    this.data.cartList[index].checked = !this.data.cartList[index].checked
    this.data.cartList[index].isStepper=!this.data.cartList[index].isStepper  
    ////////如果选中的个数为所有的长度，则让全选状态为true 
   let list= this.getSelectArr()

    if(list.length>0){
      this.setData({
        isButton:false,
        cartList:this.data.cartList,
       

      })
    }
    else{
      this.setData({
        isButton:true,
        cartList: this.data.cartList,
       
      })
    }


    // //赋值给要删除的数组
   
    //////////调用计算合计
    this.countMoney(list)
    if(list.length==this.data.cartList.length){   
      this.setData({
        isSelectAll:true,        
      })     
    }
    else{
      this.setData({
        isSelectAll: false,   
      }) 
    }
  },
  ///////////全选按钮的点击
  selectAll(e){
    //全选为true
   let istrue= !this.data.isSelectAll
   this.setData({
     isSelectAll:istrue,  

   })
   if(istrue){
   let arr=  this.data.cartList.map(item=>{
       return {
         ...item,
         checked:true,
         isStepper: false
       }
     })
     this.setData({
       cartList:arr,
      isButton:false
     })   
     //全选的时候，合计的算法
     this.countMoney(arr)      
   }
   else{
     let arr = this.data.cartList.map(item => {
       return {
         ...item,
         checked: false,
         isStepper: true
       }
     })
     this.setData({
       cartList: arr,
      isButton:true
     }) 
     //不全选的合计算法
     //全选的时候，合计的算法
     this.countMoney([]) 
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
    this.getCartList()
    this.setData({
      isSelectAll:false,
      isButton:true,
      totalMoney:0
    })
    
    
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