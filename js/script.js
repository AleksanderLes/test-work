/*  swiper reviews */
new Swiper('.reviews__swiper', {

    speed: 500,
    loop: true,
    navigation: {
        nextEl: '.reviews__btn-next',
        prevEl: '.reviews__btn-prev',
    },

    slidesPerView: 1,
    spaceBetween: 0,

    // Дальнейшие надстройки делают слайды вне области видимости не фокусируемыми
    watchSlidesProgress: true,
    watchSlidesVisibility: true,
    slideVisibleClass: "slide-visible",

});


/* burger */
let burger = document.querySelector('.burger');
let menu = document.querySelector('.header__nav');
let menulinks = menu.querySelectorAll('.nav__link');

burger.addEventListener('click', function() {

    burger.classList.toggle('burger--active');

    menu.classList.toggle('header__nav--active');

    document.body.classList.toggle('stop-scroll');
})

menulinks.forEach(function(el) {
    el.addEventListener('click', function() {

        burger.classList.remove('burger--active');

        menu.classList.remove('header__nav--active');

        document.body.classList.remove('stop-scroll');
    })
})

/* modal */

class Modal {
    constructor(options) {
        let defaultOptions = {
            isOpen: () => {},
            isClose: () => {},
        }
        this.options = Object.assign(defaultOptions, options);
        this.modal = document.querySelector('.modal');
        this.speed = false;
        this.animation = false;
        this.isOpen = false;
        this.modalContainer = false;
        this.previousActiveElement = false;
        this.fixBlocks = document.querySelectorAll('.fix-block');
        this.focusElements = [
            'a[href]',
            'input',
            'button',
            'select',
            'textarea',
            '[tabindex]'
        ];
        this.events();
    }
    events() {
        if (this.modal) {
            document.addEventListener('click', function(e) {
                const clickedElement = e.target.closest('[data-path]');
                if (clickedElement) {
                    let target = clickedElement.dataset.path;
                    let animation = clickedElement.dataset.animation;
                    let speed = clickedElement.dataset.speed;
                    this.animation = animation ? animation : 'fade';
                    this.speed = speed ? parseInt(speed) : 300;
                    this.modalContainer = document.querySelector(`[data-target="${target}"]`);
                    this.open();
                    return;
                }
                if (e.target.closest('.modal-close')) {
                    this.close();
                    return;
                }

            }.bind(this));

            window.addEventListener('keydown', function(e) {
                if (e.keyCode == 27) {
                    if (this.isOpen) {
                        this.close();
                    }
                }

                if (e.keyCode == 9 && this.isOpen) {
                    this.focusCatch(e);
                    return;
                }

            }.bind(this));

            this.modal.addEventListener('click', function(e) {
                if (!e.target.classList.contains('modal__container') && !e.target.closest('.modal__container') && this.isOpen) {
                    this.close();
                }
            }.bind(this));
        }
    }
    open() {
        this.previousActiveElement = document.activeElement;

        this.modal.style.setProperty('--transition-time', `${this.speed / 1000}s`);
        this.modal.classList.add('is-open');
        this.disableScroll();

        this.modalContainer.classList.add('modal-open');
        this.modalContainer.classList.add(this.animation);

        setTimeout(() => {
            this.options.isOpen(this);
            this.modalContainer.classList.add('animate-open');
            this.isOpen = true;
            this.focusTrap();
        }, this.speed);
    }
    close() {
        if (this.modalContainer) {
            this.modalContainer.classList.remove('animate-open');
            this.modalContainer.classList.remove(this.animation);
            this.modal.classList.remove('is-open');
            this.modalContainer.classList.remove('modal-open');

            this.enableScroll();
            this.options.isClose(this);
            this.isOpen = false;
            this.focusTrap();
        }
    }
    focusCatch(e) {
        const focusable = this.modalContainer.querySelectorAll(this.focusElements);
        const focusArray = Array.prototype.slice.call(focusable);
        const focusedIndex = focusArray.indexOf(document.activeElement);

        if (e.shiftKey && focusedIndex === 0) {
            focusArray[focusArray.length - 1].focus();
            e.preventDefault();
        }

        if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
            focusArray[0].focus();
            e.preventDefault();
        }
    }

    focusTrap() {
        const focusable = this.modalContainer.querySelectorAll(this.focusElements);
        if (this.isOpen) {
            focusable[0].focus();
        } else {
            this.previousActiveElement.focus();
        }
    }
    disableScroll() {
        let pagePosition = window.scrollY;
        this.lockPadding();
        document.body.classList.add('disable-scroll');
        document.body.dataset.position = pagePosition;
        document.body.style.top = -pagePosition + 'px';
    }

    enableScroll() {
        let pagePosition = parseInt(document.body.dataset.position, 10);
        this.unlockPadding();
        document.body.style.top = 'auto';
        document.body.classList.remove('disable-scroll');
        window.scroll({ top: pagePosition, left: 0 });
        document.body.removeAttribute('data-position');
    }
    lockPadding() {
        let paddingOffset = window.innerWidth - document.body.offsetWidth + 'px';
        this.fixBlocks.forEach((el) => {
            el.style.paddingRight = paddingOffset;
        });
        document.body.style.paddingRight = paddingOffset;
    }

    unlockPadding() {
        this.fixBlocks.forEach((el) => {
            el.style.paddingRight = '0px';
        });
        document.body.style.paddingRight = '0px';
    }
}
const modal = new Modal({
    isOpen: (modal) => {
        console.log(modal);
        console.log('opened');
    },
    isClose: () => {
        console.log('closed');
    },
});

// Validation
/*
new JustValidate('.modal__form', {
    rules: {
        name: {
            required: true,
            minLength: 2,
            maxLength: 30,
        },
        mail: {
            required: true,
            email: true,
        },
    },

});*/

let validateForms = function(selector, rules, successModal, yaGoal) {
    new window.JustValidate(selector, {
        rules: rules,
        messages: {
            name: {
                required: 'You did not enter a name',
                minLength: 'The name must contain 2 characters'
            },
            mail: {
                required: 'You have not entered an e-mail',
                email: 'Incorrect e-mail entry'
            },
        },

        submitHandler: function(form) {
            let formData = new FormData(form);

            let xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        console.log('Отправлено');
                    }
                }
            }

            xhr.open('POST', 'mail.php', true);
            xhr.send(formData);

            form.reset();

            fileInput.closest('label').querySelector('span').textContent = 'Прикрепить файл';
        }
    })
}

validateForms('.modal__form', { mail: { required: true, email: true }, name: { required: true, minLength: 2, maxLength: 30, }, }, '.thanks-popup', 'send goal');
