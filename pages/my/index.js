//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isLogin:false,//登录的转态
    nickName:"",
    headImg:"" //头像
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // 登录的方法
  login(event){
    console.log("event:",event)
    let rawData=JSON.parse(event.detail.rawData)
    // console.log("event.rawData.nickName", rawData)
   
    this.setData({
      nickName: rawData.nickName ,
      headImg: event.detail.userInfo.avatarUrl
    })
    
    let { encryptedData,iv, userInfo} = event.detail
    wx.login({
      success:(res=>{       
        let data = {
          code: res.code,
          encryptedData, 
          iv,
           userInfo
        }
        let url = app.$url +"/user/login"
        app.$get(url,data).then(res=>{
          console.log("登录成功",res)
          //保存登录状态
          this.setData({
            isLogin:true
          })
          let { token } = res.user          
          wx.setStorageSync('token', token);
        }).catch(err=>{
          console.log("登录失败",err)
        })
        
      })
    })

  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
