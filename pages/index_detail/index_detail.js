import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
   
    mainData:[],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: false,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    currentId:0,
    id:'',
    isShow:true,
    isChoose:0,
    img:'background-image:url(http://www.solelycloud.com/images/vr.png);'
  },
  //事件处理函数
 
  onLoad(options) {
    const self = this;
    this.setData({
      fonts:app.globalData.font
    });
    self.data.id = options.id;
    self.getMainData();
  },

  getMainData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      id:self.data.id
    }
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0]  
      }
      wx.hideLoading();
      self.data.mainData.content = api.wxParseReturn(res.info.data[0].content).nodes;
      self.setData({
        web_mainData:self.data.mainData,
      });     
    };
    api.productGet(postData,callback);
  },


  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  intoPathRedi(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  },


 
 
})


