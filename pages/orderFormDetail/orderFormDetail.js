const app=getApp()
// pages/orderFormDetail/orderFormDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    text:"接单",
    zhuandan:false,
    jiedan:false,
  },
  // 点击转单显示下弹窗
  showPopup(e) {
    var that=this
    // 获取当前单的wsid
    var wsid=e.currentTarget.dataset.wsid;
    var order_type=e.currentTarget.dataset.order_type;
    // 存储当前订单id
    that.setData({ 
      show: true,
      order_number:e.currentTarget.dataset.ordernumber 
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
      wx.navigateBack({
        delta: 1
      })
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
    var order_number=e.currentTarget.dataset.ordernumber;
    console.log(order_number)
    if(that.data.text==="已接单"){
      wx.showToast({
        title: '已接单',
        icon: 'none',
        duration: 2000
      })
    }else{
      // 发起接单请求
      app.http({
        url:"workman_accept_serve",
        method:"POST",
        param:{
          order_number:order_number
        }
      }).then(res=>{
        if(res.data.code===204){
          console.log(res.data.code)
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          // that.setData({
          //   zhuandan:true,
          //   jiedan:true
          // })
        }else{
          console.log(res.data)
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          that.setData({
            zhuandan:true,
            jiedan:false,
            text:"已接单"
          })
        } 
      }).catch(error=>{
        wx.showToast({
          title: '接单失败',
          icon: 'none',
          duration: 2000
        })
      })
    }
  },
  // 给客户拨打电话
  toTel(e){
    console.log(e.currentTarget.dataset.tel)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel //仅为示例，并非真实的电话号码
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    var state=options.state
    if(state&&state==="已接单"){
      that.setData({
        zhuandan:true,
        jiedan:true,
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
    var that=this
    that.setData({
      orderAll:app.globalData.orderItem
    })
    console.log(that.data.orderAll)
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