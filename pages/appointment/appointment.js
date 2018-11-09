import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
    storeData:[],
    mainData:[],
    img:'background-image:url(http://www.solelycloud.com/images/vr.png)',
    complete_api:[],
    select:false
  },
  //事件处理函数
  

  onLoad(options){
    const self = this;
    wx.showLoading();
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.data.id = options.id;
    self.getLabelData();
    self.getMainData();
    self.getStoreData()
  },

  getStoreData(){
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
        self.data.storeData.push.apply(self.data.storeData,res.info.data);
      }else{
        api.showToast('暂无可选门店','none');
      }
      console.log(self.data.storeData)
      wx.hideLoading();
      self.setData({
        web_storeData:self.data.storeData,
      });
    };
    api.labelGet(postData,callback);   
  },


  getLabelData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
      type:3,
      id:self.data.id
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.labelData = res.info.data[0]
        self.data.complete_api.push('getLabelData')
      }else{
        api.showToast('门店不存在！','none');
      }
      console.log(self.data.labelData)
      self.setData({
        web_labelData:self.data.labelData,
      });
    };
    api.labelGet(postData,callback);   
  },

  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self); 
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
      category_id:self.data.id
    };
  
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data)
      }else{
        api.showToast('暂无商品','none');
      };
      self.data.complete_api.push('getMainData')
      console.log(self.data.mainData)
      self.setData({
        web_mainData:self.data.mainData,
      });
      self.checkLoadComplete()
    };
    api.productGet(postData,callback);   
  },

  checkLoadComplete(){
    const self = this;
    var complete = api.checkArrayEqual(self.data.complete_api,['getMainData','getLabelData']);
    if(complete){
      wx.hideLoading();
    };
  },

  bindShowMsg() {
    const self = this;
    self.setData({
      select:!self.data.select
    })
  },


  mySelect(e) {
    const self = this;
    var id = api.getDataSet(e,'id');
    self.data.id = id;
    self.setData({
      select: false
    })
    self.getMainData(true);
    self.getLabelData();
  },



  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  intoPathBack(e){
    const self = this;
    wx.navigateBack({
      delta:1
    })
  },

  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  }, 
})

  