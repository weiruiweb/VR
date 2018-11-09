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
    pay:{}
  },

  onLoad: function (options) {
    const self = this;
    console.log(options);
    self.setData({
      web_passage1:options.passage1,
      web_storeName:options.storeName,
      img:app.globalData.img,
      web_ratio:1
    });
    self.data.passage1 = options.passage1;
    self.data.labelId = options.labelId
    self.data.id = options.id;
    self.getMainData();

  },





  getMainData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
      id:self.data.id
    };

    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0]
      }else{
        api.showToast('数据错误','none')
      }
      wx.hideLoading();

      self.data.pay = {
        wxPay : self.data.mainData.price,
        wxPayStatus : 0
      };



      self.data.paidMoney = self.data.mainData.price;
      self.setData({
        web_paidMoney:self.data.paidMoney,
        web_mainData:self.data.mainData,
      }); 
      self.getLabelData();
      self.getCardData()    
    };
    api.skuGet(postData,callback);
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
    api.orderGet(postData,callback)
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
      web_index:self.data.index
    }) 
  },

  test(){
    const self = this;
    console.log('pay');


    const postData = {
      token:wx.getStorageSync('token'),
      wxPay:0.01,
    };
    const callback = (res)=>{
      console.log(res);
      if(res.solely_code==100000){
         const payCallback=(payData)=>{
          if(payData==1){
            console.log('ok')
          };   
        };
        api.realPay(res.info,payCallback);   
      }else{
        api.showToast('支付失败','none')
      }
    };
    api.directPay(postData,callback);   
  },

  

  countPrice(){
    const self = this;

    self.data.pay = {};
    if(self.data.index>=0){
      
      var ratio = self.data.cardData[self.data.index].discount/100;
      
      if(self.data.cardData[self.data.index].balance>=self.data.mainData.price*ratio){
        self.data.pay.card = {
          card_no:self.data.cardData[self.data.index].order_no,
          price:self.data.mainData.price*ratio
        };
        self.data.pay.discount = self.data.mainData.price-self.data.mainData.price*ratio;
      
      }else{ 
        self.data.pay.card = {
          card_no:self.data.cardData[self.data.index].order_no,
          price:self.data.cardData[index].balance,
        };
        self.data.pay.discount = self.data.mainData.price*ratio;
        self.data.pay.wxPay = self.data.mainData.price - self.data.pay.card.price - self.data.pay.discount;
        self.data.pay.wxPayStatus = 0;
      };
      self.setData({
        web_ratio:ratio
      })
    }else{
      self.data.pay.wxPay = self.data.mainData.price;
      self.data.pay.wxPayStatus = 0;
      self.setData({
        web_ratio:1
      })
    };

    self.setData({    
      web_mainData:self.data.mainData,
    })

  },


  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  addOrder(){
    const self = this;
     if(!self.data.order_id){
      self.setData({
        buttonClicked: true
      });
      const postData = {
        token:wx.getStorageSync('token'),
        sku:[
          {id:self.data.id,count:1}
        ],
        pay:{wxPay:self.data.mainData.price},
        type:1,
        data:{
          passage1:self.data.passage1,
          labelId:self.data.labelId,
          timeId:self.data.mainData.sku_item[0]
        }
      };
      const callback = (res)=>{
        if(res&&res.solely_code==100000){
          setTimeout(function(){
            self.setData({
              buttonClicked: false
            })
          }, 1000)         
        }else if(res.msg=="库存不足"){
          api.showToast('商品库存不足','none')
        };
        self.data.order_id = res.info.id
        self.pay(self.data.order_id);     
      };
      api.addOrder(postData,callback);
    }else{
      self.pay(self.data.order_id)
    }   
  },



  pay(order_id){
    const self = this;
    var order_id = self.data.order_id;
    const postData = api.cloneForm(self.data.pay);
    postData.token = wx.getStorageSync('token');
    postData.searchItem = {id:order_id};

 
    const callback = (res)=>{
      if(res.solely_code==100000){
        if(res.info){
          const payCallback=(payData)=>{
          if(payData==1){
              setTimeout(function(){
                api.pathTo('/pages/user_order/user_order','redi');
              },800)  
            };   
          };
          api.realPay(res.info,payCallback); 
        }else{
          api.showToast('支付成功','none')
        };
         
      }else{
        api.showToast('支付失败','none')
      }   
    };
    api.pay(postData,callback);
  },






})  

  