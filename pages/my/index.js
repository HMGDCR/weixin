//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isLogin: false, //登录的转态
    nickName: "",
    headImg: "", //头像
    code: "", //登录凭证
  },

  // /////////////获取凭证code
  getCode() {
    wx.login({
      success: (code) => {
        this.setData({
          code: code.code,        
        })
        console.log("this.data", this.data.headImg)
        ////////////获取用户信息
        let userInfo = wx.getStorageSync("userInfo")
        console.log("用户信息：", userInfo)
        this.setData({
          nickName: userInfo.nickName,
          headImg: userInfo.avatarUrl
        })
      }
    })
  },

  // /////////登录的方法
  login(event) {
    //////判断是否已经登录了，如果已经登录了，就不执行以下的程序
    let token = wx.getStorageSync('token')
    if (token) { //如果已经有登录就不执行以下程序，并提示已经登录
      wx.showToast({
        title: '已经登录了',

      })
      return false //并退出
    } else {

      console.log("event:", event)
      let rawData = JSON.parse(event.detail.rawData)

      this.setData({
        nickName: rawData.nickName,
        headImg: event.detail.userInfo.avatarUrl
      })

      let {
        encryptedData,
        iv,
        userInfo
      } = event.detail

      let data = {
        code: this.data.code,
        encryptedData,
        iv,
        userInfo
      }
      let url = "/user/login"
      app.$get(url, data).then(res => {
        wx.showToast({
          title: '登录成功',
        })

        //保存登录状态
        this.setData({
          isLogin: true
        })
        let {
          token
        } = res.user
        wx.setStorageSync('token', token);
        wx.setStorageSync('userInfo', userInfo)
      }).catch(err => {
        console.log("登录失败", err)
      })
    }

  },


  ////////////////跳转到我的订单
  goOrderList() {
    wx.navigateTo({
      url: '/pages/order/list/list',
    })
  },
  onShow: function() {
    this.getCode();

  },
  onLoad: function() {
 
  }
})