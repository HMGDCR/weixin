const app = getApp()
// pages/address/add/add.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: false,
    required: false,

    username: "",//用户名
    phone: "",//电话
    area: "",//区域
    address: "",//详细地址
    zip: "",//邮编
    nameErr: false,//提示输入名字
    phoneErr: false,//提示输入号码
    areaErr: false,//提示输入区域
    detailErr: false,//提示输入详细地址
    zipErr: false,//提示输入邮编,
    isAble: true,//是否可以点击    
    isAdd:false ,//是否是添加
    addressId:"",//地址的Id

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // getApp().setWatcher(this); // 设置监听器
    let isAdd = options.isAdd=='true'?true:false
    //如果是编辑，就获取addressId
    if(!isAdd){
      // console.log("options.isdefault", options.isdefault)
      let isdefault = options.isdefault=="true"?true:false
     this.setData({
       addressId: options.addressId,
       checked:isdefault
     })
      this.getDetail()
    }
    this.setData(
      {
        isAdd: isAdd
      }
    )
    //////////////动态给标题名称
    wx.setNavigationBarTitle({
      title: isAdd?'添加地址':'编辑地址'
    })
    console.log("传值isAdd",isAdd)
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
    // this.enAble()
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
  ///////////////////////////////////////////////////////方法的部分




  ///////////监听输入框的内容是否填写完
  getInput() {
    if (this.data.username && this.data.phone && this.data.area && this.data.address && this.data.zip) {
      this.setData({
        isAble: false
      })
    } else {
      this.setData({
        isAble: true
      })
    }
  },


  //////////////默认地址的设置 

  onChange(e) {
    console.log("eeee", e)
    this.setData({
      checked: !this.data.checked
    })
  },

  ///////////添加地址的方法

  addAddress() {
    if(!this.data.isAble){ //如果能点击就发送请求
      //发起添加地址的请求
      let url = "/address/add"
      let data = {
        "name": this.data.username,
        "tel": this.data.phone,
        "country": "",
        "province": "",
        "city": "",
        "county": this.data.area,
        "areaCode": "000",
        "postalCode": this.data.zip,
        "addressDetail": this.data.address,
        "isDefault": this.data.checked
      }

      app.$post(url, data).then(res => {
        console.log("添加地址成功", res)
        wx.redirectTo({
          url: '/pages/address/list/list',
        })
      }).catch(err => {
        console.log("err", err)
      })
    }


  },

  ////////////编辑地址的方法
  editAddress(){
    if(!this.data.isAble){
      let url ="/address/edit"
      let data = {
        addressId: this.data.addressId,
        "name": this.data.username,
        "tel": this.data.phone,
        "country": "",
        "province": "",
        "city": "",
        "county": this.data.area,
        "areaCode": "000",
        "postalCode": this.data.zip,
        "addressDetail": this.data.address,
        "isDefault": this.data.checked
      }
      app.$post(url,data).then(res=>{
        console.log("修改成功",res)
        wx.redirectTo({
          url: '/pages/address/list/list',
        })
      }).catch(err=>{
        console.log("修改失败",err)
      })
    }
  },
  ////////////////////地址的详情
  getDetail(){
    let url ="/address/detail"
    let data = {
      addressId: this.data.addressId
    }
    app.$get(url,data).then(res=>{        
      this.setData({
        username: res.result.name,
        phone: res.result.tel,
        area: res.result.county,
        address: res.result.addressDetail,      

      })
      
    }).catch(err=>{
      console.log("详情失败",err)
    })
  },
  ////////获取名字的
  changeName(e) {
    if (e.detail) {
      //  this.getInput()
      this.setData({
        nameErr: false,
        username: e.detail,
        //  isAble:false
      })
    }
    else {
      //  this.getInput()
      this.setData({
        nameErr: true,
        //  isAble:true
      })
    }
    this.getInput()
  },
  ///////////获取号码
  changePhone(e) {

    if (e.detail) {
      // this.getInput()
      this.setData({
        phoneErr: false,
        phone: e.detail,
        // isAble:false
      })
    }
    else {
      // this.getInput()
      this.setData({
        phoneErr: true,
        // isAble:true
      })
    }
    this.getInput()
  },
  //////////////////获取地区
  changeArea(e) {

    if (e.detail) {
      // this.getInput()
      this.setData({
        area: e.detail,
        areaErr: false,
        // isAble:false
      })
    }
    else {
      // this.getInput()
      this.setData({
        areaErr: true,
        // isAble:true
      })
    }
    this.getInput()
  },
  /////////////////获取详细地址
  changeAddress(e) {
    if (e.detail) {
      //  this.getInput()
      this.setData({
        address: e.detail,
        detailErr: false,
        //  isAble:false
      })
    }
    else {
      //  this.getInput()
      this.setData({
        detailErr: true,
        //  isAble:true
      })
    }
    this.getInput()

  },
  changeZip(e) {

    if (e.detail) {
      // this.getInput()
      this.setData({
        zip: e.detail,
        zipErr: false,
        // isAble:false
      })
    } else {
      // this.getInput()
      this.setData({
        zipErr: true,
        // isAble:true
      })
    }
    this.getInput()

  }
})