import {MainEventBus} from "./MainEventBus.lib.js";
let triggerWithEvent = function(data,currentAction){
  if (!data['item'])  return;
  let
      rawActions = data['item'].dataset[currentAction].split(';');
  for (let rAction of rawActions){
    let rawAction = rAction.split(':'),
        component = rawAction[0],
        action = rawAction[1];
    MainEventBus.trigger(component,action,data);
  }
};
export class Ctrl{
  constructor(model,view,params={}){
    const _ = this;
    _.container = params.container ?  params.container : document.querySelector('body');
    _.fill(model, 'model');
    _.fill(view, 'view');
    _.actions = [];
    _.handle();
    setTimeout(_.fillBusEvents.bind(_))
    _.busEvents = [];
  }

  fillBusEvents() {
    const _ = this;
    if (!_.busEvents) return;
    try {
      for (let event of _.busEvents) {
        if (typeof event == 'string') {
          if (_[event]) MainEventBus.add(_.componentName, event, _[event].bind(_), `${_.componentName}Ctrl`);
        } else {
          let componentName = _.componenName,
              eventName
              , eventHandler, eventProp = `${_.componentName}Ctrl`;
          if (event['componentName']) {
            componentName = event['componentName'];
          }
          if (event['eventName']) {
            eventName = event['eventName'];
          }
          eventHandler = eventName;
          if (event['handler']) {
            eventHandler = event['handler'];
          }
          if (event['prop']) {
            eventProp = event['prop'];
          }
          MainEventBus.add(componentName, eventName, eventHandler, eventProp);
        }
      }
    } catch (e) {

    }
  }

  clearLoop(){
    const _ = this;
    clearInterval(_[`${_.componentName}notifies`]);
  }
  fill(elem,elemVal){
    const _ = this;
    if (typeof elem ==  'object'){
      if((elem instanceof Array) || (elem instanceof Map)){
        _[elemVal] = new Map();
        elem.forEach(function (p) {
          _[elemVal].set(p['name'],p['value'])
        })
      }else{
        _[elemVal] = elem;
      }
    }
  }
  clickHandler(e){
    const _ = this;
    let item = e.target;
    if(!item) return;
    while(item != _) {
      if( ('clickAction' in item.dataset) ){
        triggerWithEvent({'item':item,'event':e},'clickAction');
        return;
      }
      item = item.parentNode;
    }
  }
  contextHandler(e){
    const _ = this;
    e.preventDefault();
    let item = e.target;
    if(!item) return;
    if(e.which == 3){
      while(item != _) {
        if( ('contextAction' in item.dataset) ){
          triggerWithEvent({'item':item,'event':e},'contextAction');
          return;
        }
        item = item.parentNode;
      }
    }
  }
  focusOutHandler(e){
    let item = e.target;
    if( ('outfocusAction' in item.dataset) ){
      triggerWithEvent({item:item,event:e},'outfocusAction');
      return;
    }
  }
  changeHandler(e){
    let item = e.target;
    if( ('changeAction' in item.dataset) ){
      triggerWithEvent({'item':item,'event':e},'changeAction');
      return;
    }
  }
  inputHandler(e){
    let item = e.target;
    if( ('inputAction' in item.dataset) ){
      triggerWithEvent({'item':item,'event':e},'inputAction');
      return;
    }
  }
  keyUpHandler(e){
    let item = e.target;
    if( ('keyupAction' in item.dataset) ){
      triggerWithEvent({'item':item,'event':e},'keyupAction');
      return;
    }
  }
  submitHandler(e){
    e.preventDefault();
    let item = e.target;
    if( ('submitAction' in item.dataset) ){
      triggerWithEvent({'item':item,'event':e},'submitAction');
      return;
    }
  }
  scrollHandler(e){
    let item = e.target;
    if( ('scrollAction' in item.dataset) ){
      triggerWithEvent({'item':item,'event':e},'scrollAction');
      return;
    }
  }
  overHandler(e){
    let item = e.target;
    if( ('overAction' in item.dataset) ){
      triggerWithEvent({'item':item,'event':e},'overAction');
      return;
    }
  }
  dragStartHandler(e){
    let item = e.target;
    if( ('dragStartAction' in item.dataset) ){
      triggerWithEvent({'item':item,'event':e},'dragStartAction');
      return;
    }
  }
  dragOverHandler(e){
    let item = e.target;
    if( ('dragOverAction' in item.dataset) ){
      triggerWithEvent({'item':item,'event':e},'dragOverAction');
      return;
    }
  }
  dragEnterHandler(e){
    let item = e.target;
    if( ('dragEnterAction' in item.dataset) ){
      triggerWithEvent({'item':item,'event':e},'dragEnterAction');
      return;
    }
  }
  dragLeaveHandler(e){
    let item = e.target;
    if( ('dragLeaveAction' in item.dataset) ){
      triggerWithEvent({'item':item,'event':e},'dragLeaveAction');
      return;
    }
  }
  dropHandler(e){
    let item = e.target;
    if( ('dropAction' in item.dataset) ){
      triggerWithEvent({'item':item,'event':e},'dropAction');
      return;
    }
  }
  outHandler(e){
    let item = e.target;
    if( ('outAction' in item.dataset) ){
      triggerWithEvent({'item':item,'event':e},'outAction');
      return;
    }
  }
  handle(){
    const _  = this;
    _.container.addEventListener('focusout',_.focusOutHandler);
    _.container.addEventListener('submit',_.submitHandler);
    _.container.addEventListener('click', _.clickHandler);
    _.container.addEventListener('contextmenu', _.contextHandler);
    _.container.addEventListener('change',_.changeHandler);
    _.container.addEventListener('input',_.inputHandler);
    _.container.addEventListener('keyup',_.keyUpHandler);
    _.container.addEventListener('mouseover',_.overHandler);
    _.container.addEventListener('mouseout',_.outHandler);
    _.container.addEventListener('dragstart',_.dragStartHandler);
    _.container.addEventListener('dragenter',_.dragEnterHandler);
    _.container.addEventListener('dragleave',_.dragLeaveHandler);
    _.container.addEventListener('dragover',_.dragOverHandler);
    _.container.addEventListener('drop',_.dropHandler);
    if(_.container.querySelector('core-content')){
      _.container.querySelector('.page-body').addEventListener('scroll',_.scrollHandler);
    }else{
      _.container.addEventListener('scroll',_.scrollHandler);
    }
  }
  /**/
  createFullFormData(form){
    let formData = {};
    for(let element of  form.elements){
      if(!element.name) continue;
      let property =  {
            'elem'  : element,
            'name' : element.name,
            'required'  : element.required,
            'value': element.value},
          list = element['list'];
      if(list) {
        if (list.options[0]) {
          property['value'] = list.options[0].textContent;
        }
      }
      formData[element.name] = property;
    }
    return formData;
  }
  createFormData(form){
    let formData = {};
    for(let element of  form.elements){
      if(!element.name) continue;
      if (formData[element.name]){
        if ( !(formData[element.name] instanceof Array)){
          let temp = formData[element.name];
          formData[element.name] = [];
          formData[element.name].push(temp);
          formData[element.name].push(element.value);
        }
        formData[element.name].push(element.value);
      }else{
        formData[element.name] = element.value;
      }
      let list = element['list'];
      if(list) {
        if(list.options[0]) data[element.name] =list.options[0].textContent;
      }
    }
    return formData;
  }
}