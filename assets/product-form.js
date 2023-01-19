if (!customElements.get('product-form')) {
  customElements.define('product-form', class ProductForm extends HTMLElement {
    constructor() {
      super();

      this.form = this.querySelector('form');
      this.form.querySelector('[name=id]').disabled = false;
      this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
      this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
      this.submitButton = this.querySelector('[type="submit"]');
      if (document.querySelector('cart-drawer')) this.submitButton.setAttribute('aria-haspopup', 'dialog');
    }

    onSubmitHandler(evt) {
      evt.preventDefault();
      if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

      this.handleErrorMessage();

      this.submitButton.setAttribute('aria-disabled', true);
      this.submitButton.classList.add('loading');
      if(this.querySelector('.loading-overlay__spinner')) this.querySelector('.loading-overlay__spinner').classList.remove('hidden');
      
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if(screen.width > 1024 || !isMobile) {
        const cart_popup = document.querySelector('.drawer');
        cart_popup.style.visibility = 'visible';
      }

      const config = fetchConfig('javascript');
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      delete config.headers['Content-Type'];

      const formData = new FormData(this.form);
      if (this.cart) {
        formData.append('sections', this.cart.getSectionsToRender().map((section) => section.id));
        formData.append('sections_url', window.location.pathname);
        this.cart.setActiveElement(document.activeElement);
      }
      config.body = formData;

      // 카트에 더하는 함수
      fetch(`${routes.cart_add_url}`, config)
        .then((response) => response.json())
        .then((response) => {
          if (response.status) {
            if(this.querySelector('.product-form__error-message-wrapper')) this.handleErrorMessage(response.description);
            if(this.submitButton.querySelector('.sold-out-message')) {
              const soldOutMessage = this.submitButton.querySelector('.sold-out-message');
              if (!soldOutMessage) return;
            }

            this.submitButton.setAttribute('aria-disabled', true);
            if(this.submitButton.querySelector('span')) {
              this.submitButton.querySelector('span').classList.add('hidden');
              soldOutMessage.classList.remove('hidden');
            }
            this.error = true;
            return;
          } else if (!this.cart) {
            window.location = window.routes.cart_url;
            return;
          }

          this.error = false;
          /*
          const quickAddModal = this.closest('quick-add-modal');
          if (quickAddModal) {
            document.body.addEventListener('modalClosed', () => {
              setTimeout(() => { this.cart.renderContents(response) });
            }, { once: true });
            quickAddModal.hide(true);
          } else {
            this.cart.renderContents(response);
          }*/
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
           // cart count update 함수(updateCart) send fetch request to update cart
 
          fetch('/?view=cartview')
           .then(response => response.text())
           .then(cartData => { 
             console.log('change')
             this.querySelector('cart-drawer-items').innerHTML = cartData; 
          });
    }
    handleErrorMessage(errorMessage = false) {
      this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
      if (!this.errorMessageWrapper) return;
      this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

      this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

      if (errorMessage) {
        this.errorMessage.textContent = errorMessage;
      }
    }
  });
}

document.querySelector('.drawer__close').addEventListener('click', (e) => {
  console.log('clicked')
  document.querySelector('.drawer').style.visibility = 'hidden';
});