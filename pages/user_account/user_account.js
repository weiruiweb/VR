import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();



Page({

  /**
   * 页面的初始数据
   */
  data: {
    labelData:[],
    mainData:[],
    img:'background-image:url(http://www.solelycloud.com/images/vr.png);'
  },
    


  onLoad(){
    const self = this;

  },

  onShow(){
    const self = this;
    self.userGet();

  },


  userGet(){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('token');
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0];
      }   
      self.setData({
        web_mainData:self.data.mainData
      });
      console.log(self.data.mainData)
      wx.hideLoading();
    };
    api.userGet(postData,callback);
  },



 



 
})

  