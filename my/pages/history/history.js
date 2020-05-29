// my/pages/history/history.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topAll:[
      {icon:"moban",text:"全部订单",size:58},
      {icon:"ai-wallet",text:"待服务",size:56},
      {icon:"clock-fill",text:"进行中",size:69},
      {icon:"biaodanwancheng2",text:"已完成",size:60},
    ],//顶部导航
    actionTop:"全部订单",//当前选中导航
    page:1,//页数
    dataAll:[],//获取的所有数据
    lock:true,//请求锁定
  },

  // 导航
  changeBar(e){
    var that=this
    // 获取当前选中文字
    var text=e.currentTarget.dataset.text
    that.setData({
      actionTop:text,
      page:1,
      dataAll:[],
      lock:true
    })
    // 下标为0时为全部订单
    if(text==="全部订单"){
      that.getData(that.data.page,0)
    }else if(text==="待服务"){
      that.getData(that.data.page,10)
    }else if(text==="进行中"){
      that.getData(that.data.page,11)
    }else{
      that.getData(that.data.page,2)
    }    
  },
  // 请求数据
  getData(page,status){
    var that=this
    // 如果lock为true则发起请求，如果为false则不做操作
    if(that.data.lock){
      app.http({
        url:"history_service",
        method:"POST",
        param:{
          pages:page,//页数
          wid:wx.getStorageSync('wid'),//id
          orderstatus:status,//状态0全部订单，10待服务，11进行中，2已完成
        }
      }).then(res=>{
        // 如果返回数据小于10则后面没有更多数据了，将lock转为false
        if(res.data.data.length<10){
          that.setData({
            lock:false
          })
        }
        // 遍历数据并修改判断
        res.data.data.forEach(item=>{
          if(item.order_state==="10"){
            item.statu="待服务"
          }else if(item.order_state==="11"){
            item.statu="服务中"
          }else if(item.order_state==="2"){
            item.statu="已完成"
          }
        })
        // 获取当前dataAll中数据，并将新获取的数据插入
        var oldData=that.data.dataAll
        that.setData({
          dataAll:oldData.concat(res.data.data)
        })
      }).catch(error=>{
        console.log(error)
      })
    }  
  },
  toDetail(e){
    // 将当前单子数据存储
    var orderItem=e.currentTarget.dataset.item
    app.globalData.orderItem=orderItem
    wx.navigateTo({
      url: '/pages/orderFormDetail/orderFormDetail?state=已接单',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    // 请求全部数据
    that.getData(1,0)
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
    var that=this
    if(that.data.lock){
      that.setData({
        page:that.data.page+1
      })
      if(that.data.actionTop==="全部订单"){
        that.getData(that.data.page,0)
      }else if(that.data.actionTop==="待服务"){
        that.getData(that.data.page,10)
      }else if(that.data.actionTop==="进行中"){
        that.getData(that.data.page,11)
      }else{
        that.getData(that.data.page,2)
      }
    } else{
      wx.showToast({
        title: '暂无更多数据',
        icon: 'none',
        duration: 2000
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})