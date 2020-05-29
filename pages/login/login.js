//获取应用实例
const app = getApp()
//   进入这个页面之前要清理所有本地登录数据

Page({
    data: {
        iv: '',
        data: '',
        textBtn:1,
        checked: false,//协议勾选
        color:"#999999",//btn颜色
    },
    onLoad: function () {
        if(wx.getStorageSync('userInfo')&&wx.getStorageSync('userInfo')!={}){
            wx.redirectTo({
            //   url: '/pages/staffLog/staffLog',
                url:'/pages/orderForm/orderForm'
            })
        }
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
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

    onShow: function () {
    },
    //获取个人信息弹框确认按钮
    getUserInfo(e) {
        var that=this
        if(that.data.checked){
            wx.showLoading({title: '登录中，请稍候', icon: 'loading', duration: 10000});
            let that = this;
            console.log(e)
            that.addUserToken();
        }else{
            wx.showToast({
                title: '您需要同意《法律声明及隐私政策》',
                icon: 'none',
                duration: 2000,//提示的延迟时间，单位毫秒，默认：1500 
            })
        }

    },
    addUserToken() {
        let that = this;
        wx.login({
            success: function (res) {
                if (res.code) {
                    let myCode = res.code;
                    wx.getUserInfo({
                        success: function (res) {
                            that.setData({
                                userInfos: false,
                                userInfo: res.userInfo
                            })
                            wx.setStorageSync("userInfo", that.data.userInfo)
                            wx.redirectTo({
                            //   url: '/pages/staffLog/staffLog',
                                url:'/pages/orderForm/orderForm'
                            })
                        }
                    })
                }
            }
        });
    },
    // 协议勾选
    onChange(event) {
        var that=this
        this.setData({
          checked: event.detail,
        });
        // 判断颜色
        if(event.detail){
            that.setData({
                color:"#00CC33"
            })
        }else{
            that.setData({
                color:"#999999"
            })
        }
    },
})