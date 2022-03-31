import { G_Bus } from './G_Bus.js';
let triggerWithEvent = (data, currentAction) => {
	if (!data['item']) return;
	let rawActions = data['item'].dataset[currentAction].split(';');
	rawActions.forEach((action) => {
		G_Bus.trigger(action, data);
	});
};
class _G_Control {
	constructor(params = {}) {
		const _ = this;
		_.container = params?.container ?? document;
		_.handle();
	}
	clickHandler(e) {
		const _ = this;

		let item = e.target;

		if (!item) return;
		while (item != _) {
			if (!item) break;
			if (item.hasAttribute('data-click')) {
				triggerWithEvent({ item: item, event: e }, 'click');
				return;
			}
			item = item.parentNode;
		}
	}
	contextHandler(e) {
		const _ = this;
		//e.preventDefault();
		let item = e.target;
		if (!item) return;
		if (e.which == 3) {
			while (item != _) {
				if (!item) break;
				if ('context' in item.dataset) {
					triggerWithEvent({ item: item, event: e }, 'context');
					return;
				}
				item = item.parentNode;
			}
		}
	}
	focusOutHandler(e) {
		let item = e.target;
		if ('outfocus' in item.dataset) {
			triggerWithEvent({ item: item, event: e }, 'outfocus');
			return;
		}
	}
	changeHandler(e) {
		let item = e.target;
		if (item.hasAttribute('data-change')) {
			triggerWithEvent({ item: item, event: e }, 'change');
			return void 0;
		}
	}
	inputHandler(e) {
		let item = e.target;
		if ('input' in item.dataset) {
			triggerWithEvent({ item: item, event: e }, 'input');
			return;
		}
	}
	keyUpHandler(e) {
		let item = e.target;
		if ('keyup' in item.dataset) {
			triggerWithEvent({ item: item, event: e }, 'keyup');
			return;
		}
	}
	submitHandler(e) {
		//e.preventDefault();
		let item = e.target;
		if ('submit' in item.dataset) {
			triggerWithEvent({ item: item, event: e }, 'submit');
			return;
		}
	}
	scrollHandler(e) {
		let item = e.target;
		if (!item.dataset) return;
		if ('scroll' in item.dataset) {
			triggerWithEvent({ item: item, event: e }, 'scroll');
			return;
		}
	}
	overHandler(e) {
		let item = e.target;
		if ('over' in item.dataset) {
			triggerWithEvent({ item: item, event: e }, 'over');
			return;
		}
	}
	dragStartHandler(e) {
		let item = e.target;
		if ('dragStart' in item.dataset) {
			triggerWithEvent({ item: item, event: e }, 'dragStart');
			return;
		}
	}
	dragHandler(e) {
		let item = e.target;
		if ('drag' in item.dataset) {
			triggerWithEvent({ item: item, event: e }, 'drag');
			return;
		}
	}
	dragEndHandler(e) {
		let item = e.target;
		if ('dragEnd' in item.dataset) {
			triggerWithEvent({ item: item, event: e }, 'dragEnd');
			return;
		}
	}
	dragOverHandler(e) {
		let item = e.target;
		if ('dragOver' in item.dataset) {
			triggerWithEvent({ item: item, event: e }, 'dragOver');
			return;
		}
	}
	dragEnterHandler(e) {
		let item = e.target;
		if ('dragEnter' in item.dataset) {
			triggerWithEvent({ item: item, event: e }, 'dragEnter');
			return;
		}
	}
	dragLeaveHandler(e) {
		let item = e.target;
		if ('dragLeave' in item.dataset) {
			triggerWithEvent({ item: item, event: e }, 'dragLeave');
			return;
		}
	}
	dropHandler(e) {
		let item = e.target;
		if ('drop' in item.dataset) {
			triggerWithEvent({ item: item, event: e }, 'drop');
			return;
		}
	}
	outHandler(e) {
		let item = e.target;
		if ('out' in item.dataset) {
			triggerWithEvent({ item: item, event: e }, 'out');
			return;
		}
	}
	leaveHandler(e) {
		let item = e.target;
		if (!(item instanceof HTMLElement)) return;
		if (!item.hasAttribute('data-leave')) return;
		if ('leave' in item.dataset) {
			triggerWithEvent({ item: item, event: e }, 'leave');
			return;
		}
	}
	mousedownHandler(e) {
		let item = e.target;
		if (!(item instanceof HTMLElement)) return;
		if (!item.hasAttribute('data-mousedown')) return;
		if ('mousedown' in item.dataset) {
			triggerWithEvent({ item: item, event: e }, 'mousedown');
			return;
		}
	}

	handle() {
		const _ = this;
		_.container.addEventListener('focusout', _.focusOutHandler);
		_.container.addEventListener('submit', _.submitHandler);
		_.container.addEventListener('click', _.clickHandler);
		_.container.addEventListener('contextmenu', _.contextHandler);
		_.container.addEventListener('change', _.changeHandler);
		_.container.addEventListener('input', _.inputHandler);
		_.container.addEventListener('keyup', _.keyUpHandler);
		_.container.addEventListener('mouseover', _.overHandler);
		_.container.addEventListener('mouseout', _.outHandler);
		_.container.addEventListener('mouseleave', _.leaveHandler);
		_.container.addEventListener('dragstart', _.dragStartHandler);
		_.container.addEventListener('drag', _.dragHandler);
		_.container.addEventListener('dragend', _.dragEndHandler);
		_.container.addEventListener('dragenter', _.dragEnterHandler);
		_.container.addEventListener('dragleave', _.dragLeaveHandler);
		_.container.addEventListener('dragover', _.dragOverHandler);
		_.container.addEventListener('drop', _.dropHandler);
		_.container.addEventListener('scroll', _.scrollHandler);
		_.container.addEventListener('mousedown', _.mousedownHandler);
	}
}

const G_Control = new _G_Control();

export { G_Control, G_Bus };
