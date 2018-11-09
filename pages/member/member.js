import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
    isLoadAll:false,
    mainData:[],
    img:'background:url(/images/vr.png)',
    searchItem:{
      thirdapp_id:getApp().globalData.thirdapp_id,
      type:2
    }
  },
  //事件处理函数
  onLoad(e) {
    const self = this;
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.getMainData();
    self.getartData()
  },


  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);
    }
    const postData = {};
    postData.searchItem = api.cloneForm(self.data.searchItem);
  
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none');
      };
      wx.hideLoading();
      self.setData({
        web_mainData:self.data.mainData,
      });     
      console.log(self.data.mainData)
    };
    api.productGet(postData,callback);
  },


  getartData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id
    };
    postData.getBefore = {
      article:{
        tableName:'label',
        searchItem:{
          title:['=',['会员卡说明']],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    };
    const callback = (res)=>{
      self.data.artData = {};
      if(res.info.data.length>0){
        self.data.artData = res.info.data[0];
        self.data.artData.content = api.wxParseReturn(res.info.data[0].content).nodes;
      };
      console.log(self.data.artData);
      wx.hideLoading();
      self.setData({
        web_artData:self.data.artData,
      });  
    };
    api.articleGet(postData,callback);
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

  