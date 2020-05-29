const app = getApp()
// pages/staffLog/staffLog.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    phone:"",//手机号
    password:"",//密码
    isLogin:true
  },
  // 输入的用户名和密码
  onChangePhone(event) {
    var that=this
    that.setData({
      phone:event.detail
    })
  },
  onChangePassword(event){
    var that=this
    that.setData({
      password:event.detail
    })
  },
  //调转到客户端
  to_cliet(){
    console.log(111);
    wx.navigateToMiniProgram({
      appId: 'wx43d8c50f29e2c8e0',
      success(res) {

      }
    })
  },
  // 登录
  subInfo(){
    var that=this
    if(!(/^1[3456789]\d{9}$/.test(that.data.phone))){
      wx.showToast({
        title: "手机格式不正确",
        icon: 'none',
        duration: 2000
      })
      return
    }else if(that.data.password.length<6){
      wx.showToast({
        title: '请输入6位密码',
        icon: 'none',
        duration: 2000
      })
      return
    }else{
        if(that.data.isLogin){
          wx.login({
            success(res){
              var newCode=res.code
              console.log(newCode)
              if(res.code){
                that.setData({
                  isLogin:false
                })
                app.http({
                  url:"wx_worklogin",
                  param:{
                    code:newCode,
                    phone:that.data.phone,
                    password:that.data.password
                  },
                  method:"POST"
                }).then(res=>{
                  that.setData({
                    isLogin:true
                  })
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none',
                    duration: 2000
                  })
                  if(res.data.code==1){
                    console.log(res)
                    wx.setStorageSync('openId', res.data.openid)
                    wx.setStorageSync('tokenXI', res.data.token)
                    wx.setStorageSync('wid', res.data.data.wid)
                    wx.setStorageSync("phone",that.data.phone)
                    wx.setStorageSync("password",that.data.password)
                    wx.setStorageSync('staff', res.data)
                    wx.reLaunch({
                      // url: '/pages/orderForm/orderForm',
                      url:'/pages/login/login'
                    })
                  }
                }).catch(error=>{
                  that.setData({
                    isLogin:true
                  })
                })
              }
            }
          })
        }else{
          wx.showToast({
            title: '登录中，请稍后~',
            icon: 'none',
            duration: 2000
          })
        }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(wx.getStorageSync('password')!==""&&wx.getStorageSync('phone')!==""){
      wx.redirectTo({
        // url: '/pages/orderForm/orderForm',
        url:'/pages/login/login'
      })
    }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})