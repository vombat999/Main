import { G_Bus } from './libs/G_Control.js';
import { Modaler } from './libs/Modaler.lib.js';
import G_G from './libs/G_G.js';
export default class Front extends G_G {
	constructor() {
		super();
		const _ = this;
		G_Bus.on('createOrderSuccess', _.createOrderSuccess.bind(_))
			.on('toggleInput', _.toggleInput.bind(_))
			.on('outInput', _.outInput.bind(_))
			.on('burger', _.burger.bind(_))
			.on('showMoreReviews', _.showMoreReviews.bind(_))
			.on('formInput', _.formInput.bind(_))
			.on('closePopup', _.closePopup.bind(_))
			.on('submitUserRequest', _.submitUserRequest.bind(_))
			.on('submutUserConsult', _.submutUserConsult.bind(_));
	}
	createOrderSuccess(orderData) {}
	createOrderFail(orderData) {}
	toggleInput(clickData) {
		const button = clickData.item;
		const form = button.closest('.header__form');
		const input = form.querySelector('.header__form-input');
		form.classList.add('active');
		input.focus();
	}
	outInput(inputData) {
		const inputItem = inputData.item;
		const form = inputItem.closest('.header__form.active');
		this.searchFormOnHeader(form);
		form.classList.remove('active');
	}
	burger(clickData) {
		const button = clickData.item;
		const body = document.querySelector('body');
		const menu = document.querySelector('.menu');
		button.classList.toggle('is-active');
		body.classList.toggle('no-scroll');
		menu.classList.toggle('active');
	}
	searchFormOnHeader(form) {
		console.log(form);
	}
	showMoreReviews(clickBtn) {
		const button = clickBtn.item;
		const content = button.previousElementSibling.querySelector('.reviews__content');
		content.classList.toggle('active');
		if (content.classList.contains('active')) {
			button.innerText = 'Меньше';
		} else {
			content.classList.remove('active');
			button.innerText = 'Больше';
		}
	}
	fixedHeaderOnScroll() {
		const header = document.querySelector('.header');
		if (window.pageYOffset > 0) {
			header.classList.add('sticky');
		} else {
			header.classList.remove('sticky');
		}
	}
	submutUserConsult(form) {
		const formItem = form.item;
		const event = form.event;
		event.preventDefault();
		this.formConsultationSend();
	}
	submitUserRequest(form) {
		const formItem = form.item;
		const event = form.event;
		event.preventDefault();
		this.formSend();
	}
	highlightMenuLink() {
		let pathArray = window.location.pathname;
		document.querySelectorAll('.menu__link').forEach((link) => {
			if (link.href.substr(link.href.lastIndexOf('/')) === pathArray || link.href === '') {
				link.classList.add('menu__link--active');
			}
		});
	}
	async formSend() {
		const form = document.querySelector('.contacts__form');
		const formData = new FormData(form);
		let error = this.contactFormValidate(form);
		let response = await fetch('../users.json', {
			method: 'POST',
			body: formData,
		});
		if (error === 0) {
			if (response.ok) {
				this.showPopup('success');
				this.removeFormGroupClass();
				this.removeSuccessCLass();
				form.reset();
			} else {
				this.showPopup();
				this.removeSuccessCLass();
			}
		}
	}
	async formConsultationSend() {
		const form = document.querySelector('.consultation__form');
		const formData = new FormData(form);
		let response = await fetch('../users.json', {
			method: 'POST',
			body: formData,
		});
		let error = this.contactFormValidate(form);
		if (error === 0) {
			if (response.ok) {
				this.showPopup('success');
				this.removeFormGroupClass();
				this.removeSuccessCLass();
				form.reset();
			} else {
				this.showPopup();
				this.removeSuccessCLass();
			}
		}
	}
	removeSuccessCLass() {
		const formGroup = document.querySelectorAll('.contacts__form-group.success');
		formGroup.forEach((item) => item.classList.remove('success'));
	}
	removeFormGroupClass() {
		const formInput = document.querySelectorAll('.contacts__form-input--require');
		formInput.forEach((input) => {
			if (input.value) {
				input.nextElementSibling.classList.remove('hide');
			}
			input.nextElementSibling.classList.remove('hide');
		});
	}
	showPopup(popup) {
		const popupItem = document.querySelector('.popup');
		const popupSuccess = document.querySelector('.popup__success');
		const popupError = document.querySelector('.popup__error');
		popupItem.classList.add('show');
		if (popup === 'success') {
			popupSuccess.classList.add('show');
		} else {
			popupError.classList.add('show');
		}
	}
	contactFormValidate(form) {
		const contactFormName = document.querySelector('.contacts__form-input.name');
		const contactFormPhone = document.querySelector('.contacts__form-input.phone');
		const consultFormPhone = document.querySelector('.consultation__form-input');
		const usernameValue = contactFormName ? contactFormName.value.trim() : '';
		const phoneValue = contactFormPhone ? contactFormPhone.value.trim() : '';
		const consultPhoneValue = consultFormPhone.value.trim();
		let error = 0;

		if (form.getAttribute('data-submit') === 'submutUserConsult') {
			if (consultPhoneValue === '') {
				this.setErrorFor(consultFormPhone, 'Телефон не может быть пустым');
				error++;
			} else {
				this.setSuccessFor(consultFormPhone);
				error = 0;
			}
		}

		if (form.getAttribute('data-submit') === 'submitUserRequest') {
			if (usernameValue === '') {
				this.setErrorFor(contactFormName, 'Имя не может быть пустым');
				error++;
			} else {
				this.setSuccessFor(contactFormName);
				error = 0;
			}

			if (phoneValue === '') {
				this.setErrorFor(contactFormPhone, 'Телефон не может быть пустым');
				error++;
			} else {
				this.setSuccessFor(contactFormPhone);
				error = 0;
			}
		}

		return error;
	}
	setErrorFor(input, message) {
		const formControl = input.parentElement;
		const small = formControl.querySelector('.contacts__form-error');
		formControl.className = 'contacts__form-group error';
		small.innerText = message;
	}

	setSuccessFor(input) {
		const formControl = input.parentElement;
		formControl.className = 'contacts__form-group success';
	}
	formInput(input) {
		const inputItem = input.item;
		if (inputItem.value) {
			inputItem.nextElementSibling.classList.add('hide');
		} else {
			inputItem.nextElementSibling.classList.remove('hide');
		}
	}
	closePopup(popup) {
		const popupItem = popup.item;
		if (popupItem === popupItem) {
			const popup = document.querySelector('.popup');
			popup.classList.remove('show');
		}
	}
	define() {}
	init() {
		const _ = this;
		window.addEventListener('scroll', () => {
			_.fixedHeaderOnScroll();
		});
		_.fixedHeaderOnScroll();
		_.highlightMenuLink();
	}
}
new Front();

const heroSlider = new Swiper('.hero-slider', {
	loop: true,
	pagination: {
		el: '.pagination',
		bulletClass: 'pagination__bullet',
		bulletActiveClass: 'pagination__bullet--active',
		clickable: true,
	},
	slidesPerView: 1,
	on: {
		resize: function () {
			const windowWidth = window.innerWidth;

			if (windowWidth > 1200) {
				heroSlider.changeDirection('vertical');
			} else {
				heroSlider.changeDirection('horizontal');
			}
		},
	},
});

const offerSlider = new Swiper('.offer-slider', {
	loop: true,
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
	breakpoints: {
		320: {
			slidesPerView: 1,
			spaceBetween: 20,
		},
		576: {
			slidesPerView: 2,
			spaceBetween: 20,
		},
		1024: {
			slidesPerView: 3,
			spaceBetween: 20,
		},
	},
});

const partnersSlider = new Swiper('.partners-slider', {
	loop: true,
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
	breakpoints: {
		320: {
			slidesPerView: 1,
		},
		576: {
			slidesPerView: 2,
		},
		1024: {
			slidesPerView: 3,
		},
		1200: {
			slidesPerView: 4,
		},
	},
});

const gallerysSlider = new Swiper('.gallery-slider', {
	loop: true,
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
	centeredSlides: true,
	pagination: {
		el: '.swiper-pagination',
		clickable: true,
	},
	breakpoints: {
		320: {
			slidesPerView: 1,
		},
		1200: {
			spaceBetween: 120,
			loop: true,
		},
	},
});

const productsSlider = new Swiper('.products-slider', {
	loop: true,
	navigation: {
		nextEl: '.products-slider .swiper-button-next',
		prevEl: '.products-slider .swiper-button-prev',
	},
	breakpoints: {
		320: {
			slidesPerView: 1,
			spaceBetween: 20,
		},
		768: {
			slidesPerView: 2,
			spaceBetween: 20,
		},
		1200: {
			slidesPerView: 3,
			spaceBetween: 20,
		},
	},
});

const singleProductSlider = new Swiper('.single-product__slider', {
	loop: true,
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
	breakpoints: {
		320: {
			slidesPerView: 1,
			spaceBetween: 20,
		},
		576: {
			slidesPerView: 2,
			spaceBetween: 0,
		},
		1024: {
			slidesPerView: 1,
			spaceBetween: 0,
		},
	},
});
