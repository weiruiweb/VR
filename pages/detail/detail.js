

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
    isShow:false,
    isChoose:0,
    web_skuLabel:{},
    selectData:'',
    skuToday:[],
    chooseId:''
  },
  //事件处理函数
 
  onLoad(options) {
    const self = this;
    self.data.id = options.id;
    wx.showShareMenu({
      withShareTicket: true
    });
    self.getMainData();
    self.data.selectData = new Date(new Date().toLocaleDateString()).getTime();
    self.setData({
      web_selectData:new Date(new Date().toLocaleDateString()).getTime(),
      img:app.globalData.img
    });
  },

  getMainData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      id:self.data.id
    }
    postData.getAfter={
      sku:{
        tableName:'sku',
        middleKey:'product_no',
        key:'product_no',
        condition:'=',
        searchItem:{
          status:['in',[1]],
          behavior:['in',[1]]
        },
      },
      skuToday:{
        tableName:'sku',
        middleKey:'product_no',
        key:'product_no',
        condition:'=',
        searchItem:{
          status:['in',[1]],
          behavior:['in',[0]],
          deadline:['between',[self.data.selectData,(self.data.selectData+86400)]]
        },
      } 
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0]
        for (var i = 0; i < self.data.mainData.sku.length; i++) {
          for (var j = 0; j < self.data.mainData.skuToday.length; j++) {
            if(self.data.mainData.sku[i]['sku_item'][0]==self.data.mainData.skuToday[j]['sku_item'][0]){
              self.data.mainData.sku.splice(i,1,self.data.mainData.skuToday[j]);
              self.data.mainData.skuToday.splice(j,1)
            };
          }; 
        };
      };
      self.data.mainData.sku.push.apply(self.data.mainData.sku,self.data.mainData.skuToday);
      wx.hideLoading();
      self.data.chooseId = self.data.mainData.sku[0].id;
      console.log('labelId',self.data.mainData.label[self.data.mainData.category_id].id)
      self.data.mainData.content = api.wxParseReturn(res.info.data[0].content).nodes;
      self.setData({

        web_chooseId:self.data.mainData.sku[0].id,
        web_skuLabel:self.data.mainData.label[13]['child'],
        web_mainData:self.data.mainData,
        web_labelId:self.data.mainData.label[self.data.mainData.category_id].id
      });  
        console.log(999,self.data.mainData);
       self.getSkuData()  
    };
    api.productGet(postData,callback);
  },

  getLabelData(){
    const self = this;
    const postData = {
      searchItem:{
        thirdapp_id:getApp().globalData.thirdapp_id,
        id:self.data.mainData.sku[0].id
      }
    };
    const callback = (res) =>{
      if(res.info.data.length>0){
        self.data.labelData = res.info.data[0]
      };
      self.setData({
        web_labelData:self.data.labelData
      });
    }
    api.labelGet(postData,callback);
  },

  choose(e){
    const self = this;
    self.data.chooseId = api.getDataSet(e,'id');
    self.data.title = api.getDataSet(e,'title');
    self.setData({
      web_chooseId:self.data.chooseId
    });
    self.getSkuData()
  },

  getSkuData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
      id:self.data.chooseId
    };

    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.skuData = res.info.data[0]
      }else{
        api.showToast('数据错误','none')
      }
      self.setData({
        web_skuData:self.data.skuData,
      });   
    };
    api.skuGet(postData,callback);
  },

  addOrder(){
    const self = this;
    const postData = {
        token:wx.getStorageSync('token'),
        sku:[
          {id:self.data.id,count:1}
        ],
        pay:{wxPay:self.data.skuData.price},
        type:1,
        data:{
          passage1:api.timestampToTime(parseInt(self.data.selectData))+self.data.title,
          labelId:self.data.mainData.label[self.data.mainData.category_id].id,
          timeId:self.data.skuData.sku_item[0]
        }
      };
      console.log(postData)
      const callback = (res)=>{
        self.data.order_id = res.info.id;
        if(res&&res.solely_code==100000){
          api.pathTo('/pages/appoint_detail/appoint_detail?order_id='+self.data.order_id+'&&storeName='+self.data.mainData.label[self.data.mainData.category_id].title,'nav')       
        }else{
          api.showToast(res.msg,'error')
        };
        
      };
      api.addOrder(postData,callback);
     
  },


  bindDateChange: function(e) {
    const self  = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    self.data.selectData = ((new Date(e.detail.value).getTime()));
    console.log(self.data.selectData)
    self.setData({
      web_selectData:self.data.selectData
    })
    self.getMainData()
  },

  onShareAppMessage(res){
    const self = this;
    if(res.from == 'button'){
      self.data.shareBtn = true;
    }else{   
      self.data.shareBtn = false;
    }
    return {
      title: 'VR体验馆',
      path: 'pages/detail/detail?id='+self.data.id,
      success: function (res){
        console.log(res);
        console.log(parentNo)
        if(res.errMsg == 'shareAppMessage:ok'){
          console.log('分享成功')
          if (self.data.shareBtn){
            if(res.hasOwnProperty('shareTickets')){
            console.log(res.shareTickets[0]);
              self.data.isshare = 1;
            }else{
              self.data.isshare = 0;
            }
          }
        }else{
          wx.showToast({
            title: '分享失败',
          })
          self.data.isshare = 0;
        }
      },
      fail: function(res) {
        console.log(res)
      }
    }
  },


  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  intoPathRela(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'rela');
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
 
 
})
