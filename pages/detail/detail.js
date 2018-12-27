

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
    chooseId:'',
    buttonCanClick:true,
    orderNum:0
  },
  //事件处理函数
 
  onLoad(options) {
    const self = this;
    self.setData({
      web_buttonCanClick:self.data.buttonCanClick
    });
    self.data.id = options.id;
    wx.showShareMenu({
      withShareTicket: true
    });
    self.data.selectData = new Date(new Date().toLocaleDateString()).getTime();
    console.log('self.data.selectData',self.data.selectData)
    self.getMainData();
    self.data.hour = new Date().getHours();  
    self.data.minutes = new Date().getMinutes();
    console.log('self.data.hour',self.data.hour);
    console.log('self.data.minutes',self.data.minutes);
    console.log(new Date(new Date().toLocaleDateString()).getTime())
    self.setData({
      web_selectData:self.data.selectData,
      web_todayTime:new Date(new Date().toLocaleDateString()).getTime(),
      img:app.globalData.img
    });
  },

  swiperChange(e) {
    const self = this;
    self.setData({
      swiperIndex: e.detail.current,
    })
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
          deadline:['between',[self.data.selectData/1000,(self.data.selectData/1000+86400)]]
        },
      },

    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0]
        console.log(956,self.data.mainData);
        for (var i = 0; i < self.data.mainData.sku.length; i++) {
          for (var j = 0; j < self.data.mainData.skuToday.length; j++) {
            if(self.data.mainData.sku[i]['sku_item'][0]==self.data.mainData.skuToday[j]['sku_item'][0]){
              self.data.mainData.sku.splice(i,1,self.data.mainData.skuToday[j]);
              self.data.mainData.skuToday.splice(j,1)
            };
          }; 
        };
      
      if(!self.data.mainData.sku.length>0){
        api.showToast('数据有误','error');
        setTimeout(function(){
          wx.navigateBack({//返回
            delta:1
          });
        },500);
      };
      self.data.mainData.sku.push.apply(self.data.mainData.sku,self.data.mainData.skuToday);
      wx.hideLoading();
      //self.data.chooseId = self.data.mainData.sku[0].id;
      console.log('labelId',self.data.mainData.label[self.data.mainData.category_id].id)
      self.data.mainData.content = api.wxParseReturn(res.info.data[0].content).nodes;
      self.setData({

        web_chooseId:self.data.chooseId,
        web_skuLabel:self.data.mainData.label[13]['child'],
        web_mainData:self.data.mainData,
        web_labelId:self.data.mainData.label[self.data.mainData.category_id].id
      });  
        console.log(999,self.data.mainData);
       //self.getSkuData()
      }else{
        api.showToast('数据有误','error');
        setTimeout(function(){
          wx.navigateBack({//返回
            delta:1
          });
        },500);
        
      }
    };
    api.productGet(postData,callback);
  },

  getLabelData(){
    const self = this;
    console.log(self.data.skuData.sku_item[0])
    const postData = {
      searchItem:{
        thirdapp_id:getApp().globalData.thirdapp_id,
        id:self.data.skuData.sku_item[0]
      }
    };
    const callback = (res) =>{
      if(res.info.data.length>0){
        self.data.title = res.info.data[0].title
      };
      if(self.data.orderNum==0){
        self.getSkuData();
        self.data.orderNum = 1;
      };
      
    };
    api.labelGet(postData,callback);
  },

  choose(e){
    const self = this;
    
    self.data.title = api.getDataSet(e,'title');
 
    var chooseTime = (self.data.title.split('-')[0]).split(':');
    self.data.chooseHour = parseInt(chooseTime[0]);
    self.data.chooseMinutes = parseInt(chooseTime[1]);
    if(self.data.selectData==new Date(new Date().toLocaleDateString()).getTime()){
      if(self.data.chooseHour<self.data.hour||(self.data.chooseHour==self.data.hour&&self.data.chooseMinutes<self.data.minutes)){
      api.showToast('该场次暂停预约','none');
        return;
      };
    }
    
    self.data.chooseId = api.getDataSet(e,'id');
    console.log('self.data.chooseHour',self.data.chooseHour)
    console.log('self.data.chooseMinutes',self.data.chooseMinutes)
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
    postData.getAfter = {
      order:{
        tableName:'order',
        middleKey:'id',
        key:'express_info',
        searchItem:{
          status:1,
          behavior:1,
          passage1:api.timestampToTime(parseInt(self.data.selectData))+self.data.title
        },
        condition:'='
      }
    }
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.dayLimit = res.info.data[0].order.length;
        self.data.skuData = res.info.data[0]
      }else{
        api.showToast('数据错误','none')
      };
      self.setData({
        web_skuData:self.data.skuData,
      }); 
      if(self.data.orderNum==1){
        self.data.orderNum = 2;
      }else{
        self.getLabelData();  
      };
      
    };
    api.skuGet(postData,callback);
  },

  addOrder(){
    const self = this;
    if(!self.data.chooseId){
      api.showToast('请选择场次','none');
      self.data.buttonCanClick = true ;
      self.setData({
        web_buttonCanClick:self.data.buttonCanClick
      });
      return;
    }
    self.data.buttonCanClick = false;
    self.setData({
      web_buttonCanClick:self.data.buttonCanClick
    });

    if(self.data.dayLimit>=parseInt(self.data.skuData.standard)){
      api.showToast('该时段今日已预约满','none');
      self.data.buttonCanClick = true ;
      self.setData({
        web_buttonCanClick:self.data.buttonCanClick
      });
      return;
    };
    const postData = {
        token:wx.getStorageSync('token'),
        sku:[
          {id:self.data.chooseId,count:1}
        ],
        pay:{wxPay:self.data.skuData.price},
        type:1,
        data:{
          passage1:api.timestampToTime(parseInt(self.data.selectData))+self.data.title,
          labelId:self.data.mainData.label[self.data.mainData.category_id].id,
          timeId:self.data.skuData.sku_item[0],
          express_info:self.data.skuData.id
        }
      };
      console.log(postData)
      const callback = (res)=>{
        self.data.order_id = res.info.id;
        if(res&&res.solely_code==100000){
          self.data.buttonCanClick = true;
          self.setData({
            web_buttonCanClick:self.data.buttonCanClick
          });
          api.pathTo('/pages/appoint_detail/appoint_detail?order_id='+self.data.order_id+'&&storeName='+self.data.mainData.label[self.data.mainData.category_id].title,'nav')       
        }else{
          api.showToast(res.msg,'none')
        };
        self.getMainData();
      };
      api.addOrder(postData,callback);    
  },


  bindDateChange: function(e) {
    const self  = this;
    console.log('picker发送选择改变，携带值为', e.detail.value);
    var timeArr=e.detail.value.replace('-', '/'); 
    timeArr= timeArr.replace('-', '/'); 
    timeArr = e.detail.value.replace(/ |:/g, '-').split('-');
    console.log('timeArr', timeArr)
    self.data.selectData = new Date(timeArr[0],timeArr[1]-1,timeArr[2]).getTime();
    self.data.chooseId = '';
    console.log('bindDateChange',self.data.selectData);
    self.setData({
      webn_chooseId:self.data.chooseId,
      web_selectData:self.data.selectData
    });
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
