import {Api} from '../../utils/api.js';
const api = new Api();
const app = getApp()


Page({
  data: {
    mainData:[],
    addressData:[],
    userInfoData:[],
    cardData:[],
    buttonClicked: false,
    order_id:'',
    index:-1,
    useCard:false,
    pay:{},
    price:0,
    hasPay:0,
    isReserve:false,
    score:{
      score:0,
      ratio:0
    }
  },

  onLoad: function (options) {
    const self = this;
    console.log(options);
    self.data.order_id = options.order_id;
    self.setData({
      web_storeName:options.storeName,
      img:app.globalData.img,
      web_ratio:1
    });
    self.getMainData();
  },

  getMainData(){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('token');
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
      id:self.data.order_id
    };
    postData.getAfter = {
      flowLog:{
        tableName:'FlowLog',
        middleKey:'order_no',
        key:'order_no',
        condition:'=',
        searchItem:{
          status:1
        }
      }
    };


    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0];
        if(JSON.stringify(self.data.mainData.flowLog)=='[]'){
          self.data.isReserve = true;
          self.setData({
            web_isReserve:true
          });
        }else{
          self.data.hasPay = 0;
          for (var i = 0; i < self.data.mainData.flowLog.length; i++) {
            self.data.hasPay += parseFloat(self.data.mainData.flowLog[i].count);
          };
          console.log('self.data.hasPay',self.data.hasPay)
        };
        self.countPrice();
      }else{
        api.showToast('数据错误','none');
      };
      wx.hideLoading();

      
      self.setData({
        web_mainData:self.data.mainData,
      }); 

      self.getCardData(); 

    };
    api.orderGet(postData,callback);

  },

  getLabelData(){

    const self = this;
    const postData = {
      searchItem:{
        thirdapp_id:getApp().globalData.thirdapp_id,
        id:self.data.mainData.sku_item[0]
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



  getCardData(){
    const self = this;
    console.log(Date.parse(new Date()))
    const postData = {
      token:wx.getStorageSync('token'),
      searchItem:{
        type:3,
        pay_status:1,
        standard:['>',Date.parse(new Date())],
        balance:['>',0]
      }
    };
    const callback = (res) =>{
      if(res.info.data.length>0){
        self.data.cardData.push.apply(self.data.cardData,res.info.data)
      }else{
        api.showToast('暂无可用会员卡','none')
      };
      self.setData({
        web_cardData:self.data.cardData,
      }); 
      console.log(self.data.cardData)
    }
    api.orderGet(postData,callback);

  },

  chooseCard(e){
    const self = this;
    var index = api.getDataSet(e,'index');
    if(index==self.data.index){
      self.data.index = -1;
    }else{
      self.data.index = index;
    };
    self.countPrice();      
    
    self.setData({
      web_index:self.data.index,
    }) 
  },



  

  countPrice(){
    const self = this;

    self.data.pay = {};
    if(self.data.index>=0){
      var ratio = self.data.cardData[self.data.index].discount/100;

      if(self.data.isReserve){
        self.data.price = self.data.mainData.products[0].snap_product.reservaPrice;
      }else{
        self.data.price = (self.data.mainData.products[0].snap_product.vipPrice*ratio + self.data.hasPay).toFixed(2);
      };
      
      console.log('countPrice_self.data.price',self.data.price);
      
      if(self.data.cardData[self.data.index].balance>=self.data.price){
        self.data.pay.card = {
          card_no:self.data.cardData[self.data.index].order_no,
          price:self.data.price
        };
        if(!self.data.isReserve){
          self.data.pay.other = {
            price:(self.data.mainData.products[0].snap_product.price - self.data.mainData.products[0].snap_product.vipPrice*ratio).toFixed(2),
            msg:self.data.cardData[self.data.index].order_no+'会员卡折扣'
          };
        };
      }else if(!self.data.isReserve){ 
        
        console.log('555')
        self.data.pay.card = {
          card_no:self.data.cardData[self.data.index].order_no,
          price:self.data.cardData[index].balance,
        };
        self.data.pay.discount = self.data.price;
        self.data.pay.wxPay = self.data.mainData.products[0].snap_product.vipPrice - self.data.pay.card.vipPrice - self.data.pay.discount;
        self.data.pay.wxPayStatus = 0;
      }else{
        self.data.pay.wxPay = self.data.price;
        self.data.pay.wxPayStatus = 0;
      };
      self.setData({
        web_ratio:ratio
      })
    }else{
      
      if(self.data.isReserve){
        self.data.price = self.data.mainData.products[0].snap_product.reservaPrice;
      }else{
        self.data.price = (parseFloat(self.data.mainData.products[0].snap_product.price) + self.data.hasPay).toFixed(2);
      };
      self.data.pay.wxPay = self.data.price;
      self.data.pay.wxPayStatus = 0;
      self.setData({
        web_ratio:1
      })
    };
    console.log('self.data.price',parseFloat(self.data.mainData.products[0].snap_product.price))
    console.log('self.data.price',self.data.hasPay)
    self.setData({    
      web_mainData:self.data.mainData,
      web_pay:self.data.pay,
      web_price:self.data.price
    })

  },


  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },


  pay(order_id){

    const self = this;
    var order_id = self.data.order_id;
    const postData = api.cloneForm(self.data.pay);
    postData.token = wx.getStorageSync('token');
    postData.searchItem = {id:order_id};
    postData.payAfter = [];
    if(self.data.pay.card){
      postData.payAfter.push(
        {
          tableName:'FlowLog',
          FuncName:'add',
          data:{
            count:(self.data.cardData[self.data.index].ratio*self.data.mainData.products[0].snap_product.vipPrice).toFixed(2)/100,
            trade_info:'会员消费返积分',
            user_no:wx.getStorageSync('info').user_no,
            type:2,
            thirdapp_id:getApp().globalData.thirdapp_id
          }
        }
      );
    };
    const callback = (res)=>{
      if(res.solely_code==100000){
        if(res.info){
          const payCallback=(payData)=>{
            if(payData==1){
              setTimeout(function(){
                api.pathTo('/pages/user/user','rela');
              },800)  
            };   
          };
          api.realPay(res.info,payCallback); 
        }else{
          api.showToast('支付成功','none');
          setTimeout(function(){
            api.pathTo('/pages/user/user','rela');
          },800);
        };
      }else{
        api.showToast('支付失败','none')
      }   
    };
    api.pay(postData,callback);
  },






})  

  