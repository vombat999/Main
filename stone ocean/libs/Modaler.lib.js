import {Lib} from './Lib.js';
import {G_Bus} from "./G_Control.js";
import { TweenMax } from './GreenSock.lib.js'

class _Modaler extends Lib{
	constructor (){
		super();
		const _ = this;
		_.body = document.querySelector('body');
		_.modalerAppendPlace = document.querySelector('core') ? document.querySelector('core') : document.querySelector('.set');
		_.zindex = 0;
		_.conts = [];
		_.openedModals = new Map();
		_.int = 0;
		_.allModals = [];
		_.modalCont = '';
		_.gsap = TweenMax;
		_.libName = "Modaler";
		_.coord = {};
		_.presets = {
			'online-consultant' : {"bgc":false,"position":"fixed","bottom":'20px',"right":'20px'},
			'confirm' : {
				'closeBtn':false,
				'cascad':true,
				'modalInner' : {
					'position':'fixed',
					'width':'100%',
					'height':'100%',
					'max-width':'100%',
					'left':0,
					'right':0,
					'top':0,
					'bottom':0,
					'background-color':'rgba(0,0,0,0.3)',
				},
				'inner': {
					'display':'flex',
					'justify-content':'center',
					'align-items':'center',
					'margin':'auto'
				},
				'.modal-confirm' : {
					'position' : 'absolute',
					'background-color' : '#fff',
					'display' : 'flex',
					'flex-wrap' : 'wrap',
					'justify-content' : 'center',
					'align-items' : 'center',
					'padding' : '20px 30px',
					'border-radius' : '5px',
				},
				'.modal-confirm span' : {
					'width' : '100%',
					'text-align' : 'center',
					'margin-bottom' : '20px',
				},
				'.modal-confirm button' : {
					'padding' : '10px 20px',
					'margin' : '0 10px',
				}
			}
		};
		_.animation = {};
		_.animations = {
			'opacity-scale': {
				'start' : {from:{scale:0.7,opacity:0},to:{scale:1,opacity:1,duration:0.5,ease:'back.out(1)'}},
				'end' : {opacity:0,scale:.7,duration: .5,ease:'back.in(1)'}
			}
		};

		G_Bus.on('closeModal',_.closeModal.bind(_))
			.on('closeLastModal',_.closeLastModal.bind(_));
		// MainEventBus.add(_.libName,'showModal', _.showModal.bind(_));
		// MainEventBus.add(_.libName,'none', _.none.bind(_));
		//
		// MainEventBus.add(_.libName,'closeModal', _.closeModal.bind(_));
		// MainEventBus.add(_.libName,'closeAllModals', _.closeAllModals.bind(_));
		// MainEventBus.add(_.libName,'closeLastModal', _.closeLastModal.bind(_));
		//
		// MainEventBus.add(_.libName,'drag', _.drag.bind(_));
		// MainEventBus.add(_.libName,'dragStart', _.dragStart.bind(_));
		// MainEventBus.add(_.libName,'dragEnd', _.drag.bind(_));
		//
		// MainEventBus.add(_.libName,'showConfirm', _.showConfirm.bind(_));
	}

	// Ничего не делает
	none(){
		return;
	}

	// Проверяет есть ли данная модалка в объекте открытых модалок, если нет, то добавляет
	modalOpenedCheck(content){
		const _ = this;

		for(let value of _.openedModals.values()){

			if(value['content'] instanceof HTMLElement){
				if(_.deepEqual(content.textContent,value['content'].textContent)) {
					//console.log('Модальное окно уже открыто');
					return true;
				}
			} else {
				if(_.deepEqual(content,value['content'])) {
					//console.log('Модальное окно уже открыто');
					return true;
				}
			}
		}
		return false;
	}

	// Проверяет контент и тип на соответствие
	innerDataCheck(data){
		let answer = false;
		let type = data.contentType = data.type,
			content = data.content;

		if(!content) {
			console.log('Предупреждение: content не передан');
		} else {
			if(type && ((type !== 'html') && (type !== 'string') && (type !== 'object'))) {
				console.log('Предупреждение: Type указан не верно');
			} else if ((type === 'object' && (type !== typeof content)) || (type === 'string' && (type !== typeof content)) || (type === 'html' && typeof content !== 'string')){
				console.log('Предупреждение: Type не соответствует Content')
			} else {
				answer = true;
			}
		}

		return answer;
	}
	defineType(data){
		if(data['type']){
			return;
		} else if(!data['type'] && data['contentType']){
			data['type'] = data['contentType'];
			return data;
		} else {
			let type = typeof data['content'];
			if(type === 'string'){
				data['content'].trim();
				if(data['content'][0] === '.' || data['content'][0] === '#'){
					type = 'html';
				}
			}
			data.contentType = data.type = type;
			return data
		}
	}

	getModalParams(data){
		let modalParams;
		if(data['content']){
			modalParams = data;
		} else {
			modalParams = JSON.parse(data['item'].dataset.object);
		}
		modalParams['name'] = 'modal-' + this.int;
		return modalParams;
	}

	// Главный метод который обрабатывает входящие данные и запускает нужные методы
	showModal(rawData){
		const _ = this;

		if(rawData['content'] && (rawData['type'] != 'html') && rawData['content'].nodeName != '#document-fragment'){
			let append = rawData['content'].getAttribute('data-append');
			if(append == 'true'){
				rawData['append'] = true;
			}
		}
		let modalParams = _.getModalParams(rawData);
		if(!_.innerDataCheck(modalParams)) return;
		_.defineType(modalParams);

		if(_.modalOpenedCheck(modalParams['content']) && modalParams.append) return;

		if(modalParams['preset']){
			for(let key in _.presets[modalParams['preset']]){
				modalParams[key] = _.presets[modalParams['preset']][key];
			}
		}

		if(modalParams['cascad'] === false) _.closeAllModals();

		if(!modalParams['scroll']) modalParams['scroll'] = false;

		let modalInner = _.getModalInner(modalParams);

		_.openedModals.set(modalParams['name'],{'inner':modalInner,'content':modalParams['content']});

		_.modalInnerFilling({'inner':modalInner,'data':modalParams});
		_.addToPage({'inner':modalInner,'data':modalParams});

		_.int += 1;
		if(modalParams['animation'] !== false){
			if(modalParams['animation']){
				_.animation[modalParams['name']] = modalParams['animation'];
			} else if (modalParams['animation'] === undefined){
				_.animation[modalParams['name']] = 'opacity-scale';
			}
			_.animationStart(modalInner,_.animations[_.animation[modalParams['name']]]['start'])
		}
	}

	// Добавляет modalInner на страницу в modalCont или в body в зависимости от настроек
	addToPage(data){
		const _ = this;
		let modalParams = data['data'],
			modalInner = data['inner'];
		if(modalParams['bgc'] !== false){
			_.createModalCont();
			_.modalerAppendPlace.append(_.modalCont);
			_.modalCont.append(modalInner);
		} else {
			_.modalerAppendPlace.append(modalInner);
		}
	}

	// Создает контейнер модалок
	createModalCont(){
		const _ = this;

		if(!_.modalCont){
			_.modalCont = _.el('MODALCONT',{
				'data-mousedown' : `closeLastModal`,
				'childes' : [
					_.el('STYLE',{
						'text' : `
              modalcont{top:0;left:0;right:0;z-index:10000;width:100vw;display:flex;align-items:center;justify-content:center;}
              button{cursor:pointer}
            `
					})
				]
			});
		}
	}

	// Проверяет создан ли modalInner или создает его и возвращает
	getModalInner(modalParams){
		const _ = this;

		let savedModal = false;
		_.allModals.forEach(function (el) {
			let data = el['data'];
			if(data['content'] instanceof HTMLElement){
				if(_.deepEqual(modalParams['content'].textContent,data['content'].textContent)) {
					savedModal = el;
				}
			} else {
				if(_.deepEqual(modalParams['content'],data['content'])) {
					savedModal = el;
				}
			}
		});

		let modalInner;

		if(!savedModal){
			modalInner = _.createModalInner(modalParams);
			_.createCloseBtn(modalParams,modalInner);
			_.allModals.push({'inner':modalInner,'data':modalParams});
		} else {
			modalInner = savedModal['inner'];
			modalInner.setAttribute('inner-name',`${modalParams['name']}`);
		}
		return modalInner;
	}

	// Создает обертку для модалки
	createModalInner(data){
		const _ = this;
		if(data == undefined) data = {}
		let modalInner = _.el('MODALINNER',{
			'class' : data['name'],
			'inner-name' : data['name'],
			'data-click' : 'none',
			'data-bg-scroll' : data['scroll'],
			'childes' : [_.el('INNER')]
		});

		if(data['draggable'] === true){
			modalInner.setAttribute('data-drag-start',`dragStart`);
			modalInner.setAttribute('data-drag',`drag`);
			modalInner.setAttribute('data-drag-end',`dragEnd`);
			modalInner.setAttribute('draggable','true');
		}

		let fixed = 'fixed';
		let height = '100vh';
		if(data['fixed'] === false){
			fixed = 'absolute';
			height = '100%'
		}

		let styleSubText = '';
		let styleText = `
            modalcont{
                background-color: ${data['contBgc'] ? data['contBgc'] : 'rgba(0,0,0,.5)'};
                position: ${fixed};
                height: ${height};
            }
            inner>img{
                display:block;
            }
            inner{
                width: 100%;
                height: 100%;
                max-width: 90vw;
                max-height: 90vh;
                overflow: auto;
                display:block;
            }

            .${modalInner.className}{
                max-width: calc(100% - 40px);
                position: ${data['position'] ? data['position'] : 'absolute'};
                z-index: ${_.zindex += 1};
                background-color: ${data['background-color'] ? data['background-color'] : '#fff'};
                box-shadow: ${data['box-shadow'] ? data['box-shadow'] : '0 0 15px rgba(0,0,0,.6)'};
        `;

		for(let key in data){
			if(!_.checkMainProp(key)){
				let value = data[key];
				if(typeof value !== 'object' || key === 'modalInner'){
					if(key === 'modalInner'){
						for (let k in value){
							styleText += `${k} : ${value[k]};`
						}
					} else styleText += `${key} : ${value};`;
				} else if(typeof value === 'object' && key !== 'modalInner'){
					styleSubText += `.${modalInner.className} ${key}{`;
					for(let k in value){
						styleSubText += `${k} : ${value[k]};`
					}
					styleSubText += '}'
				}
			}
		}

		styleText+=`}${styleSubText}`;

		if(data['responsive'] && typeof data['responsive'] === "object"){
			let responsive = data['responsive'] ? data['responsive'] : {};
			let str = '';
			for (let key in responsive){
				let value = responsive[key];
				str += `
                    @media screen and (min-width: ${key}px){
                        .${modalInner.className}{`;
				for (let k in value){
					str += `${k} : ${value[k]};`
				}
				str += `}}`
			}
			styleText += str;
		}

		if(!data['closeBtn'] || data['closeBtn'] === true){
			styleText += `
                .closeModal{transition:.35s ease;border:none;z-index:10;border-radius:100%;background-color:#fff;width:30px;height:30px;padding:1px 5px 3px;position:absolute;top:-15px;right:-15px;box-shadow: 0 0 3px rgba(0,0,0,.5);outline:0;}
                .closeModal:before,.closeModal:after{width:20px;height:2px;background-color:#000;display:block;content:'';}
                .closeModal:before{transform: rotate(45deg) translate(1.5px,1.5px);}
                .closeModal:after{transform:rotate(-45deg)}
                @media screen and (min-width:768px) {
                    .closeModal:hover{transform:rotate(180deg)}
                }
            `
		}

		if(data['id']) modalInner.setAttribute('id', data['id']);

		modalInner.append(_.el('STYLE',{
			'text' : styleText,
			'class' : 'modalStyle'
		}));

		return modalInner;
	}

	// Наполняет модалку контентом
	modalInnerFilling(data){
		const _ = this;

		let modalInner = data['inner'],
			modalParams = data['data'],
			inner = modalInner.querySelector('inner');
		if (modalParams['type'] === 'object' ) {
			if(modalParams.append === false){
				inner.append(modalParams['content'].cloneNode(true));
			}else{
				let innerParent = modalParams['content'].parentElement;
				_.conts.push(innerParent);
				modalInner.setAttribute(`data-conts-number`,`${_.conts.length - 1}`);
				inner.append(modalParams['content']);
			}
		} else if (modalParams['type'] === 'html') {
			let innerParent = document.querySelector(`${modalParams['content']}`).parentElement;
			if(modalParams.append === false){
				let clone = _.body.querySelector(`${modalParams['content']}`).cloneNode(true);
				for(let value of _.openedModals.values()){
					if(value === _.body.querySelector(`${modalParams['content']}`)){
						value = clone;
					}
				}
				inner.append(clone);
			} else {
				_.conts.push(innerParent);
				modalInner.setAttribute(`data-conts-number`,`${_.conts.length - 1}`);
				inner.append(_.body.querySelector(`${modalParams['content']}`));
			}
		} else {
			inner.innerHTML += modalParams['content'];
		}
	}

	// Проверяет соответствие свойства на наличие в массиве
	checkMainProp(prop){
		let arr = [
			'box-shadow',
			'background-color',
			'position',
			'fixed',
			'draggable',
			'responsive',
			'contBgc',
			'content',
			'scroll',
			'type',
			'contentType',
			'bgc',
			'animation',
			'preset',
			'name',
			'id',
			'closeBtn',
			'cascad',
			'append'
		];
		return arr.indexOf(prop) >= 0;
	}

	// Задает анимацию открытия модалки
	animationStart(selector,params){
		this.gsap.fromTo(selector,params.from,params.to);
	}

	// Задает анимацию закрытия модалки
	animationEnd(selector,params){
		if(params == undefined) params = {};
		this.gsap.to(selector,params);
	}

	// Создает кнопку закрытия модального окна
	createCloseBtn(data,modalInner){
		const _ = this;

		if(data['closeBtn'] === false)  return false;

		let closeButton;

		if(!data['closeBtn'] || data['closeBtn'] === true){
			closeButton = _.el('BUTTON',{'data-click':`closeModal`,'class' : 'closeModal'});
			modalInner.append(closeButton);
		}

		else if (data['closeBtn']){
			if(typeof data['closeBtn'] === 'string'){
				if(data['closeBtn'][0] === '.'){
					closeButton = _.body.querySelector(`${data['closeBtn']}`).cloneNode(true);
					closeButton.setAttribute('data-click',`closeModal`);
					modalInner.append(closeButton);
				} else{
					closeButton = data['closeBtn'];
					modalInner.innerHTML += closeButton;
					modalInner.children[1].setAttribute('data-click-action',`${_.libName}:closeModal`)
				}
			} else if(typeof data['closeBtn'] === 'object'){
				closeButton = data['closeBtn'];
				closeButton.setAttribute('data-click',`closeModal`);
				modalInner.append(closeButton);
			}
		}

		else {
			console.warn('Предупреждение: неверные данные переданы для кнопки закрытия');
		}
	}

	// Удаляет со страницы контейнер модалки
	removeModalCont(){
		const _ = this;
		if(_.modalCont.childElementCount <= 1) {
			_.modalCont.remove();
			_.zindex = 0;
		}
	}

	// Закрывает все модалки
	closeAllModals(){
		const _ = this;
		if(_.openedModals.size > 0){
			for(let value of _.openedModals.values()){
				_.closeModal({'item':value['inner']})
			}
		}
	}

	// Закрывает последнее открытое окно
	closeLastModal(){
		const _ = this;

		if(_.openedModals.size > 0){
			let lastOpenedNumber = 0;
			for(let key of _.openedModals.keys()){
				let
					clsParts = key.split('-'),
					openedModalNumber = clsParts[clsParts.length - 1];

				if(openedModalNumber > lastOpenedNumber){
					lastOpenedNumber = openedModalNumber;
				}
			}

			let lastModal = _.openedModals.get(`modal-${lastOpenedNumber}`);
			_.closeModal({'item':lastModal['inner']})
		}
	}

	// Закрывает модальное окно и удаляет контейнер, если все модалки закрыты
	// clickData может быть как событием клика так и selector-ом
	closeModal(clickData){
		const _ = this;

		let modalObject,
			modalInner;

		if(clickData['item']){
			let elem = clickData['item'];
			modalInner = elem.closest('modalinner');
		}
		if(clickData['id']){
			_.allModals.forEach(function (el) {
				if(el['inner'].getAttribute('id') === clickData['id']) modalInner = el['inner'];
			})
		}

		for(let i = 0; i < modalInner.children.length; i++){
			let el = modalInner.children[i];
			if((el.className !== 'closeModal') && (el.tagName !== 'STYLE')){
				modalObject = el.children[0];
			}
		}

		let modalsName = modalInner.getAttribute('inner-name');
		_.openedModals.delete(modalsName);

		let end = function () {

			if(modalInner.hasAttribute('data-conts-number')){
				let modalObjectCont = _.conts[modalInner.dataset.contsNumber];
				modalObjectCont.append(modalObject);
			} else modalObject.remove();
			modalInner.remove();
			_.removeModalCont();
		};

		if(_.animation[modalsName]){
			_.animations[_.animation[modalsName]]['end']['onComplete'] = end;
			_.animationEnd(modalInner,_.animations[_.animation[modalsName]]['end']);
		} else end();
		delete(_.animation[modalsName]);

		let bgscroll = true;
		if(_.openedModals.size){
			_.openedModals.forEach(function (el) {
				let scroll = el['inner'].getAttribute('data-bg-scroll');
				if(scroll === false) bgscroll = false;
			})
		}
		if(bgscroll) _.modalerAppendPlace.style.overflow = 'auto';

		G_Bus.trigger('closeEvent',clickData);
	}

	// Создает окно confirm
	showConfirm(data){
		const _ = this;
		return new Promise(function (resolve) {
			let text = data['text'];
			let layout = _.el('DIV',{
				'class':'modal-confirm',
				'data-click-action':'',
				'childes':[
					_.el('span',{'text':text}),
					_.el('BUTTON',{'class':'btn bg-green modal-success','text':'OK','data-click':`:closeModal`}),
					_.el('BUTTON',{'class':'btn bg-red modal-cancel','text':'CANCEL','data-click':`closeModal`})
				]});
			let
				successBtn = layout.querySelector('.modal-success'),
				cancelBtn = layout.querySelector('.modal-cancel');
			_.showModal({
				'preset' : 'confirm',
				'content': layout
			});
			successBtn.addEventListener('click',function (e) {
				resolve(true);
			});
			cancelBtn.addEventListener('click',function (e) {
				resolve(false);
			});
		})
	}

	dragStart(dragData){
		const _ = this;
		let e = dragData['event'];
		let item = dragData['item'];

		let data = e.dataTransfer;
		let img = document.createElement('IMG');
		data.setDragImage(img,0,0);

		let name = item.className;
		_.coord[name] = {'x':e.pageX, 'y':e.pageY};
		let transform = item.style.transform;
		if(transform.indexOf('translate') >= 0){
			let str = transform.substring(transform.indexOf('(') + 1,transform.lastIndexOf(')'));
			str = str.split(',');
			_.coord[name]['trX'] = parseInt(str[0]);
			_.coord[name]['trY'] = parseInt(str[1]);
		}
	}
	drag(dragData){
		const _ = this;
		let
			e = dragData['event'],
			item = dragData['item'];

		let name = item.className;

		let posX = _.coord[name]['trX'] + (e.pageX - _.coord[name]['x']);
		let posY = _.coord[name]['trY'] + (e.pageY - _.coord[name]['y']);

		_.gsap.to(item,0,{x:posX,y:posY})
	}
}

export const Modaler = new _Modaler();
