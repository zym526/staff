//app.js
var txTobdMap = require('/js/map.js');
App({
    onLaunch: function () {
      // 用户版本更新
      if (wx.canIUse("getUpdateManager")) {
        let updateManager = wx.getUpdateManager();
        updateManager.onCheckForUpdate((res) => {
          // 请求完新版本信息的回调
          console.log(res.hasUpdate);
        })
        updateManager.onUpdateReady(() => {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: (res) => {
              if (res.confirm) {
                wx.clearStorageSync()
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate();
              } else if (res.cancel) {
                return false;
              }
            }
          })
        })
        updateManager.onUpdateFailed(() => {
          // 新的版本下载失败
          wx.hideLoading();
          wx.showModal({
            title: '升级失败',
            content: '新版本下载失败，请检查网络！',
            showCancel: false
          });
        });
      }


        //调用API从本地缓存中获取数据
        var that=this
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        // 获取员工端token
        var tokenXI = wx.getStorageSync("tokenXI") || null
        if(tokenXI){
          that.globalData.tokenXI=tokenXI;
          console.log(tokenXI)
        }
    },

    getUserInfo: function (cb) {
        var that = this
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.getUserInfo({
                withCredentials: false,
                success: function (res) {
                    that.globalData.userInfo = res.userInfo
                    typeof cb == "function" && cb(that.globalData.userInfo)
                }
            })
        }
    },
    // 时间戳转年月日
    formatDuring(timestamp) {
        var date = new Date(timestamp*1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '.';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '.';
        var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
        var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
        var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
        var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
        
        var strDate = Y+M+D;
        return strDate;    
    },

    // 请求
    http: function({url = '', param = {}, type = 'json',method=''} = {}) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: this.globalData.url + url,
                method:method,
                data: param,
                header: {
                    'content-type': type == 'json' ? 'application/json' : 'application/x-www-form-urlencoded',
                    'token': wx.getStorageSync("tokenXI"),
                },
                complete: res => {
                    // 重新请求完token，再次执行后的请求在这里拦截
                    if (res.statusCode == 200) {
                        if (res.data.code == 401) {
                            this.getNewToken().then(() => {
                                this.http({url, param, type, method}).then(res => resolve(res));
                            })
                        }else{
                            resolve(res);
                        }   
                    } else {
                        reject(res);
                    }
                }
            }); 
        }); 
    },
    getNewToken: function() {
        // 如果电话或密码为空则返回登录页
        if(wx.getStorageSync('phone')===""||wx.getStorageSync('password')===""){
            wx.navigateTo({
              url: '/pages/staffLog/staffLog',
            })
        }else if(wx.getStorageSync('userInfo')=={}||!wx.getStorageSync('userInfo')){
            wx.redirectTo({
                url: '/pages/login/login',
            })
        }else{     
            return new Promise((resolve, reject) => {
                wx.login({
                    success: res => {
                        wx.request({
                            url: `${this.globalData.url}wx_worklogin`,
                            method: 'POST',
                            data: {
                                code: res.code,
                                phone: wx.getStorageSync('phone'),
                                password: wx.getStorageSync('password')
                            },
                            header: {
                                'content-type': 'application/json'
                            },
                            success: res => {
                                console.log(res)
                                wx.setStorageSync('tokenXI', res.data.token);
                                resolve();
                            }
                        })
                    }
                });
            }) 
        }
    }, 

    globalData: {
        userInfo: null,
        url:"https://wash.xypvip.cn/",
        // url:"https://test.xinyixi.net/",
        tokenXI:null,
        orderItem:{},
    },
})
