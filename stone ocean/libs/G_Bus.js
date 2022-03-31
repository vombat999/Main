class _G_Bus {
	constructor(flag){
		const _ = this;
		_.flag =  flag;
		_.events = {};
	}
	on(eventName,fn){
		const _ = this;
		if (!_.events[eventName]) {
			this.events[eventName] = []
		}
		this.events[eventName].push(fn)
		if(_.flag === 'dev'){
			console.warn(`Referring to an event: ${eventName}.Handler: ${fn.name}`);
		}
		return _;
	}
	trigger(eventName,data){
		const _ = this;
		return new Promise(function (resolve) {
			if(_.flag === 'dev'){
				console.log(`Trigger event: ${eventName} with data: "${data}" `);
			}
			try{
				if (_.events[eventName]) {
					_.events[eventName].forEach( async (fn) => resolve(await fn(data)))
				}
			} catch (e) {
				if(e.name == 'TypeError'){
					let errObj = {};
					errObj['err'] = e;
					errObj['event'] = eventName;
					errObj['line'] = e.lineNumber;
					console.log('%c%s',`background-color:#3f51b5;`,`!РћР±СЂР°С‰РµРЅРёРµ Рє СЃРѕР±С‹С‚РёСЋ, РєРѕС‚РѕСЂРѕРµ РЅРµ РѕРїСЂРµРґРµР»РµРЅРѕ ${componentName}: ${eventName}\n${e}`);
				}
			}
		})
	}
	remove(eventName,prop){
		const _ = this;
		if (_.events[eventName]) {
			delete _.events[eventName];
		}
	}
	clear(){
		const _ = this;
		for(let prop in _.events) {
			if (prop === 'includeModule' || prop === 'showMenu') continue;
			delete _.events[prop];
		}
	}
	inDev(){
		const _ = this;
		let title = document.createElement('DIV');
		title.textContent = 'Р¤СѓРЅС†РёСЏ РІ СЂР°Р·СЂР°Р±РѕС‚РєРµ';
		_.trigger('Modaler','showModal',{
			type:'object',
			content: title,
			padding: '20px',
			'border-radius':'10px',
			'font-size': '40px'
		});
	}
}
export const G_Bus = new _G_Bus('prod');