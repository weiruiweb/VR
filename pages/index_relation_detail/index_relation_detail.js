import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();


Page({
  data: {
    currentId:0,
  },
  //事件处理函数

   onLoad(options){
    const self = this;
    self.data.id = options.id;
    self.getMainData();
   
  },

  getMainData(){
    const self = this;
  
    const postData = {};
 
    postData.searchItem = {
      id:self.data.id,
      thirdapp_id:getApp().globalData.thirdapp_id,
    }
  
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0];
        self.data.mainData.content = api.wxParseReturn(res.info.data[0].content).nodes;
      }else{
        self.data.isLoadAll = true;
        api.showToast('数据错误','none');
      };
      self.setData({
        web_mainData:self.data.mainData,
      });  
    };
    api.articleGet(postData,callback);
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

  