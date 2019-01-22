import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();


Page({
  data: {
    articleData:[],
    scoreData:[],
    labelData:[],
    productData:[],
    indicatorDots: false,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 2000,
    duration: 1000,
    previousMargin: 0,
    nextMargin: 0,
    swiperIndex:0,
    sForm:{
      item:'' 
    }
  },
  //事件处理函数
 
  onLoad(options) {
    const self = this;
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.getSliderData();
    self.getLabelData();
    self.getProductData();
    self.getScoreData();
    self.getArticleData();
    self.setData({
      img:app.globalData.img,
    })
  },
  swiperChange(e) {
    const self = this;
    self.setData({
      swiperIndex: e.detail.current,
    })
  },
  getSliderData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      title:'首页轮播图',
      thirdapp_id:getApp().globalData.thirdapp_id,
    };
    const callback = (res)=>{ 
      if(res.info.data.length>0){
        self.data.sliderData = res.info.data[0];
      }
      self.setData({
        web_sliderData:self.data.sliderData,
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

  getScoreData(){
    const self = this;
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = {
      type:1,
      thirdapp_id:getApp().globalData.thirdapp_id,
    };
    postData.order = {
      listorder:'desc'
    }
    postData.getBefore = {
      label:{
        tableName:'label',
        searchItem:{
          title:['=',['积分兑换商品']],
        },
        middleKey:'category_id',
        key:'id',
        condition:'in'
      },
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.scoreData.push.apply(self.data.scoreData,res.info.data);
        
      }else{
        api.showToast('暂无积分兑换商品','none');
      }
      wx.hideLoading();
      console.log(self.data.scoreData)
      self.setData({
        web_scoreData:self.data.scoreData,
      });
    };
    api.productGet(postData,callback);   
  },  

  getProductData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
      type:2,
      member:'false'
    };
    postData.order = {
      listorder:'desc'
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.productData.push.apply(self.data.productData,res.info.data);
      }else{
        api.showToast('暂无活动商品','none');
      }
      wx.hideLoading();
      console.log(self.data.productData)
      self.setData({
        web_productData:self.data.productData,
      });
    };
    api.productGet(postData,callback);   
  },



  getArticleData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
    };
    postData.getBefore = {
      label:{
        tableName:'label',
        searchItem:{
          title:['=',['热门活动']],
          thirdapp_id:['=',[getApp().globalData.thirdapp_id]],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    };
    postData.order = {
      create_time:'normal'
    }
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.articleData.push.apply(self.data.articleData,res.info.data)
      }else{
        api.showToast('暂无热门活动','none');
      }
      self.setData({
        web_articleData:self.data.articleData
      })
    };
    api.articleGet(postData,callback);   
  },

  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll){
      self.data.paginate.currentPage++;
      self.getScoreData();
    };
  },



  inputChange(e){
    const self = this;
    api.fillChange(e,self,'sForm');
    self.setData({
      web_sForm:self.data.sForm,
    });  
    console.log(self.data.sForm)
  },

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  }, 

})

  