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
              // this.submitButton.querySelector('span').classList.add('hidden');
              this.submitButton.querySelector('span').style.opacity = .2;
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
          if(screen.width > 1024 || !isMobile) {
            fetch('/?view=cartview')
              .then(response => response.text())
              .then(cartData => {
                this.querySelector('cart-drawer').classList.contains('is-empty') && this.querySelector('cart-drawer').classList.remove('is-empty');
                this.querySelector('cart-drawer').innerHTML = cartData;
                const cart_popup = document.querySelector('.drawer');
                cart_popup.style.visibility = 'visible'; 
                this.cart.renderContents(response);
              })
              .catch((e) => {
                console.error(e);
              })
            }
          })
        .catch((e) => {
          console.error(e);
        })

        this.submitButton.classList.remove('loading');
        if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty');
        if (!this.error) this.submitButton.removeAttribute('aria-disabled');
        if(this.querySelector('.loading-overlay__spinner')) this.querySelector('.loading-overlay__spinner').classList.add('hidden');   
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