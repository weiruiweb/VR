
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
  },
  //事件处理函数
 
  onLoad(options) {
    const self = this;
    this.setData({
      img:app.globalData.img
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

  addOrder(){
    const self = this;

    if(!self.data.order_id){
      const postData = {
        token:wx.getStorageSync('token'),
        product:[
          {id:self.data.id,count:1}
        ],
        pay:{score:self.data.mainData.price},
        type:3,
        data:{
        	balance:self.data.mainData.balance,
	        discount:self.data.mainData.discount,
          ratio:self.data.mainData.ratio,
	        standard:parseInt(Date.parse(new Date()))+parseInt(self.data.mainData.standard),	
        }

      };
      console.log(parseInt(Date.parse(new Date()))+parseInt(self.data.mainData.standard))
      const callback = (res)=>{
        if(res&&res.solely_code==100000){
          setTimeout(function(){
            self.data.buttonClicked = false;
          },1000);
          self.data.order_id = res.info.id
          self.pay(self.data.order_id);         
        }else if(res.msg=="库存不足"){
        	api.showToast('商品库存不足','none')
        }	
      };
      api.addOrder(postData,callback);
    }else{
      self.pay(self.data.order_id);
    };   
  },



  

  pay(order_id){
    const self = this;
    const postData = {
      token:wx.getStorageSync('token'),
      searchItem:{
        id:order_id,
      },
      wxPay:self.data.mainData.price,
      wxPayStatus:0
    };
    const callback = (res)=>{
      wx.hideLoading();
      if(res.solely_code==100000){
        const payCallback=(payData)=>{
          if(payData==1){
            setTimeout(function(){
              api.pathTo('/pages/user_member/user_member','redi');
            },800)  
          };   
        };
        api.realPay(res.info,payCallback);  
      }else{
        api.showToast('发起微信支付失败','none')
      };
    };
    api.pay(postData,callback);
  },


  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },


 
 
})

  