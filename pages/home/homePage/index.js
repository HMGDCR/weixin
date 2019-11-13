
//如果我们需要使用全局的定义好的$https,那么我们的需要导入app.js中的对象
const app =getApp();

Page({
    onShareAppMessage() {
        return {
            title: 'swiper',
            path: 'page/component/pages/swiper/swiper'
        }
    },

    data: {       
        indicatorDots: true,
        vertical: false,
        autoplay: true,
        interval: 2000,
        duration: 500,
        Banners:[] ,//轮播图数据
       Category:[] ,//商品分类的数据
       List:[] ,//商品的列表
       isLoding:false ,//判断是否加载
      pageNum:1 ,//页码
      pageLength:[],//当前数据
       

    },
  onLoad(options) {
    // 页面初次加载，请求第一页数据
    this.getList(1)
  
  },
//这是微信小程序自带的滚动到底部监听的方法
  onReachBottom:function(){
    

    if (this.data.isLoding && this.data.pageLength.length>0){
      console.log("this.data.List.length>0", this.data.List.length>0)
      console.log("到底不了")
      this.getList(this.data.pageNum + 1)
      console.log("this.data.pageNum ", this.data.pageNum ++)
    }
    

  },
  //使用onshow的生命周期函数来调用数据的请求,注意方法和生命周期函数是可以同级存在的
  onShow:function(){
    this.getBanners();
    this.getCategory();
    this.getList();


    wx.showToast({
      title: '加载中...',
      mask: true,
      icon: 'loading'
    })

  },
  //定义一个获取首页轮播图数据的方法
  getBanners(){   
    let url ='/product/getBanners'
    //我们定义好的app对象就相当于this
    app.$get(url).then(res=>{     
      //通过this.setData
      this.setData({
        Banners: res.banners
      })      
    }).catch(err=>{
      console.log("获取数据失败",err)
    })
  },
  //定义一个获取商品分类的方法
  getCategory(){
    let url ='/category/all'
    app.$get(url).then(res=>{      
      this.setData({
        Category:res.list
      })
      console.log("分类数据：",res.list)
    }).catch(err=>{
      console.log("获取商品分类失败",err)
    })
  },
  //获取商品的列表
  getList(pageNow){
    console.log("此时的页面：",pageNow)
    this.data.isLoding=false

    let url ='/product/list?pageNum='+pageNow;
   
    app.$get(url).then(res=>{
      console.log("列表",res);
      

      // complete(){
           wx.hideToast()
        // }


      this.setData({
        List: this.data.List.concat(res.list),
        pageLength:res.list
      });
      console.log("this.data.pageLength====", this.data.List)
      this.data.isLoding = true
      //若想查看data里面的数据可以通过以下方法
      // console.log("11", this.data.List)
    }).catch(err=>{
      wx.hideToast()
      console.log("失败",err)
    })
  },
  
  gotoCategory:function(options){
    //根据传过来的分类Id传过去
    console.log("分类的Id=====", options.currentTarget.dataset.index)
    // 把获取商品分类的Id赋值给全局的变量，我们想要在下一页获取参数，直接获取就行，注意不能把参数放在url中
    app.$categoryId= options.currentTarget.dataset.index

    console.log(" app.$categoryId", app.$categoryId)
    // 普通页面跳转
    console.log("options", options)   
    wx.switchTab({
      url: '/pages/category/category',
  })

  }

})