const app=getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabbar:"待接单",
    show: false,
    btnLeft:"我要转单",
    btnRight:"我要接单",
    columns: [],
  },
  // 更改tabbar
  changeTabbar: function(e){
    var that=this;
    var item=e.currentTarget.dataset.item;
    that.setData({
      tabbar:item,
      orderAll:[]
    })
    if(item==="待接单"){
      that.getAwait(1);
      that.endSetInterJD()
      that.startSetInterJD(1)
      that.setData({
        btnLeft:"我要转单",
        btnRight:"我要接单"
      })
    }else{
      that.getAwait(10)
      that.endSetInterJD();
      that.startSetInterJD(10)
      that.setData({
        btnLeft:"联系车主",
        btnRight:"导航位置"
      })
    }
  },
  // 点击转单显示下弹窗
  showPopup(e) {
    var that=this
    if(that.data.btnLeft=="我要转单"){
      // 获取当前单的wsid
      var wsid=e.currentTarget.dataset.item.wsid;
      var order_type=e.currentTarget.dataset.item.order_type;
      // 存储当前订单id
      that.setData({ 
        show: true,
        order_number:e.currentTarget.dataset.item.order_number 
      });
      // 获取同站点员工信息
      app.http({
        url:"get_same_stations_workman",
        method:"POST",
        param:{
          wsid: wsid,
          category:order_type
        }
      }).then(res=>{
        if(res.data.data.length!==0){
          // 将姓名排查出来
          var allName=[]
          for(var i=0;i<res.data.data.length;i++){
            allName.push(res.data.data[i].name)
          }
          that.setData({
            columns:allName,
            columnsAll:res.data.data
          })
        }else{
          that.setData({
            columns:["暂无数据"]
          })
        }  
      }).catch(error=>{
        wx.showToast({
          title: "数据获取失败",
          icon: 'none',
          duration: 2000
        })
      })
    }else{
      that.endSetInter()
      that.endSetInterJD()
      wx.makePhoneCall({
        phoneNumber: e.currentTarget.dataset.item.user_phone //仅为示例，并非真实的电话号码
      })
    } 
  },
  // 隐藏下弹窗
  onClose() {
    this.setData({ show: false });
  },
  // 点击确定转单成功
  onConfirm(event) {
    var that=this
    //value人员，index下标
    const { picker, value, index } = event.detail;
    // 发起转单请求
    app.http({
      url:"order_to_other",
      method:"POST",
      param:{
        order_number: that.data.order_number,
        wid:that.data.columnsAll[index].wid
      }
    }).then(res=>{
      wx.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 2000
      })
      that.getAwait(1)
    }).catch(error=>{
      wx.showToast({
        title: '转单失败',
        icon: 'none',
        duration: 2000
      })
    })
    this.onClose()
  },
  // 点击取消，取消转单
  onCancel() {
    wx.showToast({
      title: '取消转单',
      icon: 'none',
      duration: 2000
    })
    this.onClose();
  },
  // 接单
  receiving(e){
    var that=this
    // 如果是我要接订单则请求接单
    if(that.data.btnRight==="我要接单"){
      var order_number=e.currentTarget.dataset.item.order_number;
      // 发起接单请求
      app.http({
        url:"workman_accept_serve",
        method:"POST",
        param:{
          order_number:order_number
        }
      }).then(res=>{
        // 如果返回204有异常，则显示并重新获取
        if(res.data.code===204){
          console.log(res.data.code)
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          that.getAwait(1)
        }else{
          console.log(res.data)
          // 如果正常则显示并改为已结单
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          that.setData({
            tabbar:"已接单",
            btnRight:"导航位置"
          })
          that.getAwait(10)
        } 
      }).catch(error=>{
        wx.showToast({
          title: '接单失败',
          icon: 'none',
          duration: 2000
        })
      })
    }else{
      // 如果是导航位置则跳转导航
      // 获取订单的经纬度位置
      var lat=e.currentTarget.dataset.item.latitude;
      var lon=e.currentTarget.dataset.item.longitude;
      console.log(lat,lon,e)
      that.endSetInter();
      that.endSetInterJD()
      // 跳转导航页面
      wx.navigateTo({
        url: '/pages/navigationMap/navigationMap?lon='+lon+"&lat="+lat,
      })
    }
  },
  // 获取待接单数据
  getAwait(index){
    var that=this
    app.http({
      url:"order_info",
      method:"POST",
      param:{
        order_state:index
      }
    }).then(res=>{
      console.log(res)
      that.setData({
        orderAll:res.data.data
      })
    }).catch(error=>{
      console.log(err)
      wx.showToast({
        title: "数据获取失败",
        icon: 'none',
        duration: 2000
      })
    })
  },
  // 前往详情页
  toDetails(e){
    var that=this
    that.endSetInter()
    that.endSetInterJD()
    // 将当前单子数据存储
    var orderItem=e.currentTarget.dataset.item
    app.globalData.orderItem=orderItem
    if (this.data.tabbar==="待接单"){
      // 跳转详情页
      wx.navigateTo({
        url: '/pages/orderFormDetail/orderFormDetail',
      })
    }else{
      wx.navigateTo({
        url: '/pages/orderFormDetail/orderFormDetail?state=已接单',
      })
    }
  },
  // 前往我的页面
  toMy(){
    var that=this;
    that.endSetInter()
    that.endSetInterJD()
    wx.redirectTo({
      url: '/pages/my/my',
    })
  },
  // 跳转历史服务
  toHistory(){
    var that=this
    that.endSetInter()
    that.endSetInterJD()
    wx.navigateTo({
      url: '/my/pages/history/history',
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
  // 开启计时器,获取待接单或已结单数据
  startSetInterJD(index) {
    var that = this;
    that.data.setInterJD = setInterval(
    function () {
        that.getAwait(index)
    }, 5*60*1000);
  },
  //清除计时器
  endSetInterJD: function () {
    var that = this;
    console.log("清除定时器")
    clearInterval(that.data.setInterJD)
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

  /**
   * 生命周期函数--监听页面加载
   */
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
    // 获取待接单数据
    that.getAwait(1);
    // 开启计时器定时刷新获取员工信息
    that.startSetInter()
    that.startSetInterJD(1)
    that.setData({
      tabbar:"待接单",
      btnRight:"我要接单"
    })
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