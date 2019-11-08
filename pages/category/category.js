const app = getApp()
// pages/prodouct/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      value: "",
      activeKey: 0,
      activeIndex: 10,
      items: [],
     active:"",
    categoryId:"",
    isServe:true,
    itemList:[],//临时的数据表
    isLoding:true,
    pageNum:1,//数据的当前页
    arr:[],
    islodingshow:false

  
  },
////////////获取分类的数据
getCategory(){
  let url = app.$url +"/category/all";
  app.$get(url).then(res=>{
 
    let cateId = res.list[0].categoryId
    this.getList(cateId)
    // this.getList()
    this.setData({
      items:res.list
    })
  }).catch(err=>{
    console.log("err",err)
  })
},
///////////////////////获取数据列表
  getList: function (categoryId,pageNum){ 
    this.data.isLoding=false //调用的时候，下拉加载为false  

    this.setData({
      islodingshow:true
    })

    var url = app.$url +'/product/list';
      var data = {
        categoryId,
        pageNum          
      }

      app.$get(url,data).then(res => {
        // 隐藏加载框
        // wx.hideLoading();


        this.data.isLoding = true //数据回来的时候，下拉加载为true     
               
        this.setData({
          itemList: this.data.itemList.concat(res.list),
          arr:res.list,         
          islodingshow: false
        
        })
   
      }).catch(err => {
        console.log("失败,", err)
      })


    // } 

 
},

///////////////////置顶

  //回到顶部
  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  



  onChange(index){  
    this.goTop()
    //根据下标拿对应的数据
    this.data.categoryId = this.data.items[index.detail].categoryId
    this.data.itemList=[]
    this.data.pageNum=1  
    this.getList(this.data.categoryId, this.data.pageNum)   
   
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 
    this.getCategory();
    
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
   
    //获取首页分类传过来的Id，这个需要在onShow中获取，在onLoad获取不到
    let categoryId = app.$categoryId
    console.log("传过来的分类Id===", categoryId)
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
 
    if(this.data.isLoding&&this.data.arr.length){      
      this.data.pageNum++
      this.getList(this.data.categoryId, this.data.pageNum)   
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})