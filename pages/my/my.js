// pages/orderForm/orderForm.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      allImage:["kehu","tongji","lishi","pingjia","bangzhu","yaoqing1"],
      allText:["客户资源","数据统计","历史服务","客户评价","帮助中心","邀请好友"],
      allColor:["#48b0ff","#98aeff","#98ffa9","#ffbd7c","#ff98fe","#48b0ff"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // 跳转页面
  toServe(e){
    var that=this
    var text=e.currentTarget.dataset.text
    if(text==="历史服务"){
      that.endSetInter()
      wx.navigateTo({
        url: '/my/pages/history/history',
      })
    }else{
      wx.showToast({
        title: '功能开发中',
        icon: 'none',
        duration: 2000
      })
    }
  },
  // 跳转历史服务
  toHistory(){
    var that=this
    that.endSetInter()
    wx.navigateTo({
      url: '/my/pages/history/history',
    })
  },
  // 跳转首页面
  toOrderForm(){
    var that=this
    that.endSetInter()
    wx.redirectTo({
      url: '/pages/orderForm/orderForm',
    })
  },
  // 获取员工端首页数据
  getStaff(){
    var that=this
    app.http({
      url:'workdata',
      method:"POST",
      param:{
        wid:wx.getStorageSync('wid')
      }
    }).then(res=>{
      that.setData({
        orderCount:res.data.data.ordercount,
        orderPrice:res.data.data.orderprice
      })
    }).catch(error=>{
      console.log(error)
    })
  },
  out(){
    wx.showModal({
      title: '提示',
      content: '确定退出登录吗？',
      success: function (res) {
        wx.clearStorageSync();
        wx.redirectTo({
          url: '/pages/staffLog/staffLog',
        })
      }
    })
  },
  // 开启计时器,获取订单金额和订单数量
  startSetInter() {
    var that = this;
    that.data.setInter = setInterval(
    function () {
        that.getStaff()
    }, 30*60*1000);
  },
  //清除计时器
  endSetInter: function () {
    var that = this;
    console.log("清除定时器")
    clearInterval(that.data.setInter)
  },
  onLoad: function (options) {
    var that=this;
    // 获取员工信息
    that.setData({ 
      staff:wx.getStorageSync('staff')
    })
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
    var that=this;
    // 获取员工订单金额和订单数量
    that.getStaff();
    // 开启计时器定时刷新获取员工信息
    that.startSetInter()
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