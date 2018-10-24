//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
  tabCurrent:0,
  isShow:false,
  chooseType:0,
  img:'background-image:url(http://www.solelycloud.com/images/vr.png);'
  },
  
  onLoad: function () {
   this.setData({
      fonts:app.globalData.font
    })
  },
  goBuy:function(){
    var isShow = !this.data.isShow;
    this.setData({
      isShow:isShow
    })
  },
  close:function(){
    this.setData({
      isShow:false
    })
  },
  choose:function(e){
    var chooseType = e.currentTarget.dataset.type;
    this.setData({
      chooseType:chooseType
    })
  },
   intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },
})
