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
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },
  //////////////////进步器
  onChange(event) {
    console.log("event",event)
    console.log(event.detail);
    let buyNum = event.detail
    let index = event.currentTarget.dataset.index
    //每点击一次，就发送修改请求
    let cartId = this.data.cartList[index].cartId   
   
    let data={
      buyNum: buyNum,
      cartId: cartId
    }
    let url = app.$url +'/cart/updateNum'
    app.$get(url,data).then(res=>{
      console.log("修改成功",res)
      console.log("此时的数据", this.data.cartList[index])
    }).catch(err=>{
      console.log("修改失败",err)
    })

  },
  //////////////提交
  onClickButton(){
    console.log("提交")
  },
   //////////////删除
  onDelet(){
    console.log("删除")
    let url = app.$url +'/cart/del'
    console.log(" this.data.deleList", this.data.deleList)
    //遍历拿到即将要删除的数组，拿到购物车的Id
    let carId =[]
    this.data.deleList.forEach(item=>{
      carId.push(item.cartId)
   })
   

    console.log("购物车的Id", carId)

    let data={
      cartId: carId
    }
    let arr=[]
    app.$post(url,data).then(res=>{
      console.log("删除成功",res)

      carId.map(i=>{
        var arr=this.data.cartList.filter((item) => {
          return item.cartId != i
        })
      })  

      // console.log("删除的数组", arr)  
      this.setData({
        cartList: arr,
        deleListCartIndex:[]
      })
    }).catch(err=>{
      console.log("删除失败",err)
    })
  },

/////////////编辑与完成的切换
  goEdit(e){
console.log("22",e)
   let isEdit= !this.data.isEdit
this.setData({
  isEdit: isEdit
})
  },

  ////////////////////获取购物车列表的所有数据
  getCartList(){
    let url = app.$url +"/cart/all"
    app.$get(url).then(res=>{
      // 我们要通过一个临时数组，来存值，然后再通过setData来赋值，否则会渲染不了
      let arr = res.list.map(item=>{
        return {
          ...item,
          checked:false
        }
      })
      console.log("arr",arr)
      this.setData({
        cartList:arr
      })
      console.log("修改",this.data.cartList)
    
    }).catch(err=>{
      console.log("失败：",err)
    })
  },

//////////合计的方法
  countMoney(list){ 
    let money=0
    list.forEach(item=>{
      money += item.buyNum * item.price/100
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

    this.data.cartList[index].checked = !this.data.cartList[index].checked
    ////////如果选中的个数为所有的长度，则让全选状态为true
    let list = this.data.cartList.filter(item=>{
      return item.checked==true
    }) 
    //赋值给要删除的数组
    this.setData({
      deleList: list,
    })
   
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
     isSelectAll:istrue
   })
   if(istrue){
   let arr=  this.data.cartList.map(item=>{
       return {
         ...item,
         checked:true
       }
     })
     this.setData({
       cartList:arr,
       deleList: arr
     })   
     //全选的时候，合计的算法
     this.countMoney(arr) 
     
   }
   else{
     let arr = this.data.cartList.map(item => {
       return {
         ...item,
         checked: false
       }
     })
     this.setData({
       cartList: arr,
       deleList: []
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