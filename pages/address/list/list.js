const app = getApp()


Page({
    /**
     * 页面的初始数据
     */
    data: { 
      radio: "",
      list:[] ,//地址列表的数据
    },
    onChange(event) {
      //当我们默认的时候，需要重新发修改数据的请求，把默认值改为true
      let item = event.currentTarget.dataset.item
      let index = event.currentTarget.dataset.index

      let data ={
        ...item,
        isDefault:true
      }
      let url = "/address/edit" 
      app.$post(url,data).then(res=>{
        console.log("默认成功：",res)
        this.data.list.splice(index,1,data)   
        this.setData({
          list: this.data.list
        })
      }).catch(err=>{
        console.log("默认失败",err)
      })    
      this.setData({
        radio:""+ event.currentTarget.dataset.index
      });     
    },  
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
     

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
      this.getAddresList()
  
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
    //////////////////////////////////////////////方法部分
    /////////////获取地址列表的数据
    getAddresList(){
      let url = "/address/all"
      app.$get(url).then(res=>{
        console.log("地址列表：",res)
        //过滤找到是默认的，设置为默认
        res.list.forEach((item,index)=>{
          if (item.isDefault){
            this.setData({
              radio:""+index
            })
          }
        })
        this.setData({
          list: res.list
        })
      }).catch(err=>{
        console.log("失败",err)
      })
    },

    /////////////跳转到添加地址
  addAddress(){
    let isAdd=true
    wx.redirectTo({
      url: '/pages/address/add/add?isAdd=' + isAdd,
    })
  },
  //////////////跳转到编辑地址
  editAddress(e) {
    let isAdd = false
    let addressId = e.currentTarget.dataset.addressid
    

    let isdefault = e.currentTarget.dataset.isdefault
    // console.log("isdefault", isdefault)
   

    wx.redirectTo({
      url: '/pages/address/add/add?isAdd=' + isAdd + "&addressId=" + addressId + "&isdefault=" + isdefault,
    })
  },
  /////////////删除地址
  delAddress(e){

    let $this = this
    wx.showModal({
      title: '您即将删除数据',
      content: '是否要删除数据',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
            // //先获取到指定的数据

    let addressid = e.currentTarget.dataset.addressid
    console.log("111111", addressid)
    let index = e.currentTarget.dataset.index

    let url ="/address/del"
    let data = {
      addressId: addressid
    }   
    console.log("11",$this)
    app.$get(url,data).then(res=>{
      console.log("删除成功",res)    
      $this.data.list.splice(index, 1)    
       
      $this.setData({
        list: $this.data.list
      })
    }).catch(err=>{
      console.log("删除失败",err)
    })


        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    }) 

  },

  ////////////////跳转到确认订单
  goOrderConfirm(e){
    let item = e.currentTarget.dataset.item
    console.log("item",item)
    let i=JSON.stringify(item)
 
    wx.redirectTo({
    
      url: '/pages/order/orderConfirm/index?item=' + i,
    })
  }



  })
  