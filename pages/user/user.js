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
    self.getLabelData()
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

  getLabelData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
      type:3,
    };
    postData.getBefore = {
      caseData:{
        tableName:'label',
        searchItem:{
          title:['=',['门店']],
        },
        middleKey:'parentid',
        key:'id',
        condition:'in',
      },
    };
    postData.order = {
      create_time:'normal'
    }
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.labelData.push.apply(self.data.labelData,res.info.data);
      }else{
        api.showToast('暂无可选门店','none');
      }
      console.log(self.data.labelData)
      wx.hideLoading();
      self.setData({
        web_labelData:self.data.labelData,
      });
    };
    api.labelGet(postData,callback);   
  },

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  intoPathRedi(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  },

  intoPathRela(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'rela');
  },




 
})

  