import { MainEventBus } from "./MainEventBus.lib.js";
import { View } from "./View.js";
import { Ctrl } from "./Ctrl.js";
export class _front{
  constructor() {
    const _ = this;
    _.componentName = 'front';
    _.view = new View(null);
    _.ctrl = new Ctrl(null, _.view, {
      container: document.querySelector('body')
    });
    _.libs = new Map();
    _.components = new Map();
    _.busEvents= [
      'registerUser', 'frontLogin','frontLogout','chooseLang','createOrder'
    ];
    //
    MainEventBus.add(_.componentName,'createOrder',_.createOrder.bind(_));
    //
    _.init();
  }
  getModule(moduleData){
    const _ = this;
    return new Promise(async function (resolve) {
      let name = moduleData.name.toLowerCase(),
          params = moduleData.params ? moduleData.params : {},
          page = moduleData.page ? moduleData.page : null,
          type = moduleData.type ? moduleData.type : 'lib',
          moduleStr = name.charAt(0).toUpperCase() + name.substr(1),
          path = `/workspace/front/libs/${moduleStr}.lib.js`;
      if (_.components.has(name)) resolve(_.components.get(name));
      if(type !== 'lib'){
        path = `/workspace/front/components/${name}/${moduleStr}.js`;
      }
      const
          module = await import(path),
          modulName = new module[moduleStr](page, params);
      _.components.set(name, modulName);
      resolve(modulName);
    });
  }
  formDataCapture(form){
    return new Promise(function (resolve) {
      let
          outData = {},
          formElements = form.elements;
      for(let element of formElements){
        if(element.type === 'radio'){
          if (element.checked){
            outData[element.name] = element.value;
          }
        }else if (element.name){
          outData[element.name] = element.value;
        }
      }
      resolve(outData);
    });
  }
  async registerUser(submitData){
    const _ = this;
    let
        form = submitData['item'],
        user = await _.getModule({
          name: 'user',
          params: {'container':document.querySelector('body')},
          type:'component'
        }),
        userData =  _.formDataCapture(form),
        response = await user.registerUser(userData);
    if(response['status'] === 'success'){
      _.registerUserSuccess(response);
    }else{
      _.registerUserFail(response);
    }
  }
  registerUserSuccess(response){}
  async frontLogin(e){
    const _ = this;
    let form = e.item,
        auther = await _.getModule('auther',{'container':document.querySelector('body')});
    let authData= _.formDataCapture(form);
    let response = await auther.frontLogin(authData);
    if (response.status == 'success'){
      location.reload();
    }
  }
  async frontLogout(e){
    const _ = this;
    let form = e.item,
        auther = await _.getModule('auther',{'container':document.querySelector('body')});
    let authData= _.formDataCapture(form);
    let response = await auther.logout(authData);
    console.log(response);
    if (response.status == 'success'){
      location.reload();
    }
  }
  chooseLang(clickObj){
    clickObj['event'].preventDefault();
    let pageSelect = document.querySelector('.page-select');
    pageSelect.classList.toggle('open')
  }
  async createOrder(submitData){
    const _ = this;
    let
        form = submitData['item'],
        formData = await _.formDataCapture(form),
        crm = await _.getModule({
          name: 'crm',
          params : {'container':document.querySelector('body')},
          type: 'component'
        });
    let response = await crm.createOrder(formData);
    if(response['status'] === 'success'){
      return MainEventBus.trigger(_.componentName,'createOrderSuccess',response['data']);
    }
    return MainEventBus.trigger(_.componentName,'createOrderFail',response);
  }
  init(){
    const _ = this;
  }

}