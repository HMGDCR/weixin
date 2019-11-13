//app.js

//全局导入utils的request.js的文件，这是我们已经封装好的
import $https from './utils/request.js'


App(  
  
  {
  onLaunch: function () {
    //请求的封装  
    this.$get = $https.get;
    this.$post = $https.post;
    this.$categoryId="1111111111" //分类商品的Id

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  },



    /**
      * 设置监听器
      */
    setWatcher(page) {
      let data = page.data;
      let watch = page.watch;
      Object.keys(watch).forEach(v => {
        let key = v.split('.'); // 将watch中的属性以'.'切分成数组
        let nowData = data; // 将data赋值给nowData
        for (let i = 0; i < key.length - 1; i++) { // 遍历key数组的元素，除了最后一个！
          nowData = nowData[key[i]]; // 将nowData指向它的key属性对象
        }
        let lastKey = key[key.length - 1];
        // 假设key==='my.name',此时nowData===data['my']===data.my,lastKey==='name'
        let watchFun = watch[v].handler || watch[v]; // 兼容带handler和不带handler的两种写法
        let deep = watch[v].deep; // 若未设置deep,则为undefine
        this.observe(nowData, lastKey, watchFun, deep, page); // 监听nowData对象的lastKey
      })
    },
    /**
     * 监听属性 并执行监听函数
     */
    observe(obj, key, watchFun, deep, page) {
      var val = obj[key];
      // 判断deep是true 且 val不能为空 且 typeof val==='object'（数组内数值变化也需要深度监听）
      if (deep && val != null && typeof val === 'object') {
        Object.keys(val).forEach(childKey => { // 遍历val对象下的每一个key
          this.observe(val, childKey, watchFun, deep, page); // 递归调用监听函数
        })
      }
      var that = this;
      Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: true,
        set: function (value) {
          // 用page对象调用,改变函数内this指向,以便this.data访问data内的属性值
          watchFun.call(page, value, val); // value是新值，val是旧值
          val = value;
          if (deep) { // 若是深度监听,重新监听该对象，以便监听其属性。
            that.observe(obj, key, watchFun, deep, page);
          }
        },
        get: function () {
          return val;
        }
      })}

















    // /**
    //    * 设置监听器
    //    */
    // setWatcher(data, watch) { // 接收index.js传过来的data对象和watch对象
    //   Object.keys(watch).forEach(v => { // 将watch对象内的key遍历
    //     this.observe(data, v, watch[v]); // 监听data内的v属性，传入watch内对应函数以调用
    //   })
    // },

    // /**
    //  * 监听属性 并执行监听函数
    //  */
    // observe(obj, key, watchFun) {
    //   var val = obj[key]; // 给该属性设默认值
    //   Object.defineProperty(obj, key, {
    //     configurable: true,
    //     enumerable: true,
    //     set: function (value) {
    //       val = value;
    //       watchFun(value, val); // 赋值(set)时，调用对应函数
    //     },
    //     get: function () {
    //       return val;
    //     }
    //   })}



})