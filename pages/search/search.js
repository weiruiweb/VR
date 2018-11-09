import {Api} from '../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
    sForm:{
      item:''
    },
    searchItem:{
      thirdapp_id:getApp().globalData.thirdapp_id,
      type:3,
    },
    searchItemOr:{

    },
    labelData:[]
  },
  //事件处理函数
 
  onLoad(options) {
    const self = this;
    console.log(options)
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    if(options.item){
      self.data.sForm.item = options.item,
      self.setData({
        web_sForm:self.data.sForm
      })
    };
    self.getLabelData();
    self.setData({
      img:app.globalData.img
    })
  },

  getLabelData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);
    }
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = api.cloneForm(self.data.searchItem);
    postData.searchItemOr = api.cloneForm(self.data.searchItemOr);
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

  changeBind(e){
    const self = this;
    api.fillChange(e,self,'sForm');
    console.log(self.data.sForm);
    if(self.data.sForm.item){
      self.data.searchItem.title = ['LIKE',['%'+self.data.sForm.item+'%']],
      self.data.searchItemOr.description = ['LIKE',['%'+self.data.sForm.item+'%']],
      self.data.labelData = [],
      self.getLabelData(true)
    }else if(self.data.sForm.item==''){
      delete self.data.searchItem.title,
      delete self.data.searchItemOr.description,
      self.data.labelData = [],
      self.getLabelData(true)
    }
  },


  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll){
      self.data.paginate.currentPage++;
      self.getLabelData();
    };
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

  