// pages/addPhoto/addPhoto.js

const db = wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    _id:'',
    isShowModal:false,
    imageUrl:null,
  },
  //打开图片信息
  openPersonal(e){
    
    let that = this;
    this.setData({
      _id:e.target.dataset.id,
      isShowModal:!that.data.isShowModal
    })
  },
  //关闭图片信息
  close(){
    let that = this;
    this.setData({
      isShowModal:!that.data.isShowModal
    })
  },
  //上传图片
  upLoadImage(){
    
    let that = this;
    wx.chooseImage({
      count:3,
      success(res){
        console.log(res)
        that.setUpLoadImage(res);
      }
    })
  },
  //图片存储到云数据库
  setUpLoadImage(res){
    let that = this;
    if(res.tempFilePaths === []){
      wx.showToast({
        title: '没有图片',
        icon:"none"
      })
      return;
    }else{
      res.tempFilePaths.forEach((item,index,arr)=>{
        let random = Math.random(1000)*100 + ".png";
        wx.cloud.uploadFile({
          cloudPath:random,
          filePath:res.tempFilePaths[index],
          config:{
            env:'cloud-1gf1ocs94c8a33b7'
          },
          success(res){
            that.data.imageUrl.push(res.fileID);
            console.log(that.data.imageUrl)
            //上传数据库
            that.addFall(res.fileID);
          },
          fail(err){
            console.log(err)
          }
        })
      })
     
    }
  },
  //上传数据库
  addFall(imageUrl){
    let data = {
      name:'Kiven',
      imageUrl:imageUrl,
      time:this.getNowFormData()
    }
    db.collection("imageList").add({
      data:data,
      success(res){
        wx.showToast({
          title:'添加成功',
          icon:'success'
        })
        
      },
      fail(err){

      }
    })
  },
  //格式化当前时间
  getNowFormData(){
    let date = new Date();
    let sepertor1 = '-';
    let sepertor2 = ':';
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if(month >= 1 && month <= 9){
      month = '0'+month;
    }
    if(strDate >= 0 && strDate <= 9){
      strDate = "0" + strDate
    }
    //                     2020              -           10     -            03                   小时          :  
    let currentDate = date.getFullYear() + sepertor1 + month + sepertor2 + strDate + " " + date.getHours() + sepertor2
    //         分钟            ：           秒钟
    +date.getMinutes() + sepertor2 + date.getSeconds();
    return currentDate;
  },
  //删除图片
  deleteImage(){
    let id = this.data._id;
    let that = this;
    wx.showModal({
      title:'警告',
      content:'确定删除吗？',
      cancelColor:"green",
      success(res){
        if(res.confirm){
          db.collection("imageList").doc(id).remove({
            success(res){
              wx.showToast({
                title: '成功'
              })
              that.onPullDownRefresh();
              that.setData({
                isShowModal:!that.data.isShowModal
              })
           },
           fail(err){
              wx.showToast({
                title: '发生异常',
                icon:'none'
              })
           }
          })
        }else{
          that.setData({
            isShowModal:!that.data.isShowModal
          })
        }
      }
    })
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
    this.onPullDownRefresh();
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
    let that = this;
    db.collection("imageList").get({
      success(res){
        that.setData({
          imageUrl:res.data
        })
        
      }
    })
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