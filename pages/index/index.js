//index.js
//获取应用实例
let phone = '';
let pwd = '';
let name = '';
const db = wx.cloud.database();

const app = getApp()

Page({
  data: {
    isShow:true,
  
  },
  reg_a(){
    this.setData({
      isShow:!this.data.isShow
    })
  },
  //注册
  reg(){
    let that = this;
    //判断输入的格式
    if(phone === '' || phone < 11){
      wx.showToast({
        title: '格式不对',
        icon:'none'
      })
      return;
    }
    if(name === ''){
      wx.showToast({
        title: '用户名不能为空',
        icon:'none'
      })
      return;
    }
    if(pwd === ''){
      wx.showToast({
        title: '密码不能为空',
        icon:'none'
      
      })
      return;
    }
      //获取用户输入
      //检查手机号是否注册
      db.collection("sign_in").where({
        phone
      }).get({
        success(res){
          if(res.data.length){
            wx.showToast({
              title: '手机号已经存在',
              icon:"none"
            })
          }else{
            that.sign_in();
          }
        }
      })
      //注册信息输入云数据库
     
      //提示完成跳转

  },
  login_a(){
    this.setData({
      isShow:!this.data.isShow
    })
  },
  //登录操作
  login(){
    if(phone === '' || phone < 11 ){
      wx.showToast({
        title: '用户名或密码错误',
        icon:'none'
      })
      return;
    }
    //获取用户名和密码
    //在数据库中查找
    db.collection("sign_in").where({
      pwd,
      phone
    }).get({
      success(res){
        if(res.data.length){
            //用户名存在
            let loginInfo = {
              phone,
              name,
              id:res.data[0]._id
            }
            wx.setStorage({
              data: loginInfo,
              key: 'loginInfo',
            })
            wx.showToast({
              title: '登入成功',
              icon:'success',
              duration:1000
            })
            //跳转
            setTimeout(()=>{
              wx.redirectTo({
                url: '/pages/userCenter/userCenter',
              })
            },1000)
           
        }else{
          wx.showToast({
            title: '用户名或密码错误',
            icon:'none'
          })
        }
      }
    })
    //与数据库做对比
    //是否成功提示
  },
  //注册函数
  sign_in(){
    let that = this;
    db.collection("sign_in").add({
      data:{
        name,
        phone,
        pwd
      },
      success(res){
        
        wx.showToast({
          title: '注册成功',
          icon:'success'
        })
        that.setData({
          isShow:!that.data.isShow
        })
      }
    })
  },
  //手机获取
  getphone(e){
    phone = e.detail.value;
  },
  //密码获取
  getpwd(e){
    pwd = e.detail.value
  },
  //姓名获取
  getname(e){
    name = e.detail.value;
  },
  //事件处理函数
  
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
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
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
