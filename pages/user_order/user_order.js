import {Api} from '../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();



Page({
  data: {
    num:0,
    mainData:[],
    searchItem:{
      pay_status:'1',
      type:1
    },
    getBefore:{}
  },
  onLoad(options){
    const self = this;
    if(!wx.getStorageSync('token')){
      var token = new Token();
      token.getUserInfo();
    };
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.getMainData();
    self.setData({
      img:app.globalData.img
    })
  },


  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);  
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    if(JSON.stringify(self.data.getBefore)!='{}'){
      postData.getBefore = api.cloneForm(self.data.getBefore);
    };
    postData.token = wx.getStorageSync('token');
    postData.searchItem = api.cloneForm(self.data.searchItem)
    postData.searchItem.thirdapp_id = api.cloneForm(getApp().globalData.thirdapp_id);
    postData.order = {
      create_time:'desc'
    };
    postData.getAfter = {
      store:{
        tableName:'label',
        middleKey:'labelId',
        key:'id',
        searchItem:{
          status:1
        },
        condition:'='
      },
      time:{
        tableName:'label',
        middleKey:'timeId',
        key:'id',
        searchItem:{
          status:1
        },
        condition:'='
      }

    };
    const callback = (res)=>{
      if(res.solely_code==100000){
        if(res.info.data.length>0){

          self.data.mainData.push.apply(self.data.mainData,res.info.data);
          for (var i = 0; i < self.data.mainData.length; i++) {
            if(self.data.mainData[i].passage1==''){
              self.data.mainData.splice(i,1)
            };
          };

        }else{
          self.data.isLoadAll = true;
          api.showToast('没有更多了','none');
        };
        wx.hideLoading();
        self.setData({
          web_mainData:self.data.mainData,
        });  
      }else{
        api.showToast('网络故障','none')
      }

    };
    api.orderGet(postData,callback);
  },








  deleteOrder(e){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('token');
    postData.searchItem = {};
    postData.searchItem.id = api.getDataSet(e,'id');
    const callback  = res=>{
      api.dealRes(res);
      self.getMainData(true);
    };
    api.orderDelete(postData,callback);
  },

  orderUpdate(e){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('token');
    postData.data ={
      order_step:1
    }
    postData.searchItem = {};
    postData.searchItem.id = api.getDataSet(e,'id');
    const callback  = res=>{
      api.showToast('申请成功','none');
      self.getMainData(true);
    };
    api.orderUpdate(postData,callback);
  },


  menuClick: function (e) {
    const self = this;
    const num = e.currentTarget.dataset.num;
    self.changeSearch(num);
  },

  changeSearch(num){
    const self = this;
    self.setData({
      num: num
    });
    self.data.searchItem = {};
    self.data.getBefore = {};
    if(num=='0'){
      self.data.searchItem.pay_status='1',
      self.data.searchItem.transport_status = '0';
      self.data.searchItem.order_step = '0';
    }else if(num=='1'){
      self.data.searchItem.pay_status='1',
      self.data.searchItem.transport_status = '1';
      self.data.searchItem.order_step = '0';
    }else if(num=='2'){
      self.data.searchItem.pay_status='1',
      self.data.searchItem.transport_status = '0';
      self.data.searchItem.order_step = '1';
    }else if(num=='3'){
      self.data.getBefore = {
        hasPay:{
          tableName:'FlowLog',
          middleKey:'order_no',
          key:'order_no',
          condition:'in',
          searchItem:{
            user_no:['=',[wx.getStorageSync('info').info.user_no]],
            status:['=',[1]]
          }
        }
      };
      self.data.searchItem.pay_status='0';
      
    }
    self.setData({
      web_mainData:[],
    });
    self.getMainData(true);
  },

  
  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll){
      self.data.paginate.currentPage++;
      self.getMainData();
    };
  },

  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  },

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),api.getDataSet(e,'nav_type'));
  }, 

})

  