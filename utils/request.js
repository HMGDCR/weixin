
import { baseUrl} from './config.js'

function serve(url, data, method){

  method=method||'get'

  url = baseUrl+url
  let token = wx.getStorageSync("token");
  console.log("获取的token",token)

  return new Promise((resolve,rejuct)=>{  
    
      //发起数据请求
      wx.request({
        url,
        data,
        method,


        header: {
          "user-token": token
        },


        //成功的时候
        success(res) {
     
          if (res.data.code===666) {
            resolve(res.data)

          } else if (res.data.code === 603){
            //清楚token
            // wx.removeStorageSync("token");
            wx.showModal({
              title: "提示",
              content: "登录已过期，是否重新登录",
              success(res) {
                if (res.confirm) {
                  // 跳转到个人中心页面
                  wx.switchTab({
                    url: "/pages/my/index"
                  });
                } else if (res.cancel) {
                  console.log("用户点击取消");
                }
              }
            });
          }

          else {
            
            rejuct(res.data.msg)
          }
        },
        //失败的时候
        fail(err) {
          // wx.hideLoading(),
            rejuct("获取数据失败", err)
        },
        
      })
    
    


  })
}

function get(url,method){
  return serve(url,method,'get')
}

function post(url, method) {
  return serve(url, method,'post')
}

export default {
  get,
  post
}