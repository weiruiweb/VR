import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
  tabCurrent:0,
  isShow:false,
  chooseType:0,
  img:'background:url(/images/vr.png)'
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
