// pages/userCenter/userCenter.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      username:'未登入'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    let that = this;
      wx.getStorage({
        key: 'loginInfo',
        success(res){
          that.setData({
            username:res.data.name
          })
        },
        fail(err){
            wx.showToast({
              title: '登录方式异常，请从新登录',
              icon:'none',
              duration:1000
            })
            setTimeout(()=>{
              wx.redirectTo({
                url: '/pages/index/index',
              })
            },1000)
            
        }
        
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