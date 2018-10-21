/* global AFRAME, THREE */

!function() {
  const BUTTON_SCALE = 1;
  const LARGE_BUTTON_SCALE = 1.4;
  const HOVER_SCALE = 1.1;
  const DIMENSION = 4.5;
  const MARGIN = 10;
  const TEXT_WIDTH = 28;
  const TEXT_OFFSET = DIMENSION - 1;

  const OFFSET_Z = 40;
  const ROTATION_X = -45;

  const DISABLED_OPACITY = 0.2;
  const NORMAL_OPACITY = 1;

  const ASSISTANT_ICON = "#assistant-icon-img";
  const USER_ICON = "#user-icon-img";

  const WISHLIST_TEXT = (count) => `WISHLIST (${count})`;

  const BUTTON_HOME = 'home';
  const BUTTON_ASSISTANT = 'assistant';
  const BUTTON_BACK = 'back';
  const BUTTON_WISHLIST = 'wishlist';

  const BUTTONS = [
    { type: BUTTON_BACK,
      text: 'BACK',
      img: '#back-button-img',
      scale: BUTTON_SCALE,
      action: function(btn) {
        this.el.sceneEl.emit('state-return');
      }
    },
    { type: BUTTON_HOME,
      text: 'HOME',
      img: '#home-button-img',
      scale: BUTTON_SCALE,
      action: function (btn) {
        this.el.sceneEl.emit('state-navigate', { state: STATE_HOME });
      }
    },
    { type: BUTTON_WISHLIST,
      text: WISHLIST_TEXT(0),
      img: '#wishlist-button-img',
      scale: BUTTON_SCALE,
      action: function(btn) {
        if (btn.is('disabled')) {
          return;
        }
        this.el.sceneEl.emit('state-navigate', { state: STATE_WISHLIST });
      }
    },
    { type: BUTTON_ASSISTANT,
      text: 'ASSISTANT',
      img: '#assistant-button-img',
      scale: BUTTON_SCALE,
      action: function(btn) {
        this.el.sceneEl.emit('state-assistant');
      }
    },
  ];

  AFRAME.registerComponent('nav-bar', {
    schema: {
      rotateWithCamera: { type: 'boolean', default: false },
      showAssistant: { type: 'boolean', default: true }
    },

    init() {
      var data = this.data;
      var el = this.el;

      this.wishlist = [];
      this.sentences = [];

      this.container = document.createElement('a-entity');
      this.container.setAttribute('position', { x: 0, y: 0, z: -OFFSET_Z });
      this.container.setAttribute('material', { color: '#000', transparent: true, opacity: 0.4 });
      this.container.setAttribute('geometry', { width: BUTTONS.length * MARGIN, height: 2 * DIMENSION });
      this.container.setAttribute('look-at', '[camera]');

      this.buttonContainer = document.createElement('a-entity');
      this.buttonContainer.setAttribute('position', { x: 0, y: 1, z: 0 });

      this.buttonLookup = {};
      BUTTONS.forEach((btn, idx) => {
        const button = this._createButton(btn.text, btn.img, btn.scale);
        this.buttonLookup[btn.type] = button;
        button.addEventListener('mouseenter', () => this._hover(button));
        button.addEventListener('mouseleave', () => this._unhover(button));
        button.addEventListener('click', clamp(() => btn.action.call(this, button)));

        if (this.data.showAssistant || btn.type !== BUTTON_ASSISTANT) {
          this.buttonContainer.appendChild(button);
        }
      });

      this._layoutContainers();
      this.container.appendChild(this.buttonContainer);

      this.el.appendChild(this.container);
      this.el.setAttribute('rotation', 'x', ROTATION_X);

      this.el.sceneEl.addEventListener('wishlist-added', (event) => {
        this._updateWishlist();
      });
      this.el.sceneEl.addEventListener('wishlist-removed', (event) => {
        this._updateWishlist();
      });

      this._updateWishlist();
      this.camera = this.el.sceneEl.querySelector('[camera]');

      this.el.setAttribute('deep-visible', false);
      this.el.sceneEl.addEventListener('navbar-activate', () => {
        this._attach();
      });
    },

    update() {
      var assistantButton = this.buttonLookup[BUTTON_ASSISTANT];

      if (this.data.showAssistant) {
        if (assistantButton.parentNode !== this.buttonContainer) {
          this.buttonContainer.appendChild(assistantButton);
        }
      } else {
        if (assistantButton.parentNode === this.buttonContainer) {
          this.buttonContainer.removeChild(assistantButton);
        }
      }

      this._layoutContainers();
    },

    tick() {
      if (this.data.rotateWithCamera) {
        const cameraRotation = this.camera.getAttribute('rotation');
        this.el.setAttribute('rotation', {
          x: ROTATION_X,
          y: this.camera.getAttribute('rotation').y,
          z: 0
        });
      }
    },

    _attach() {
      this.el.setAttribute('deep-visible', true);
    },

    _layoutContainers() {
      const buttonEls = this.buttonContainer.getChildEntities();
      buttonEls.forEach((button, idx) => {
        button.setAttribute('position', { x: MARGIN * (idx - (buttonEls.length - 1) / 2), y: 0, z: 0});
      });
      this.container.setAttribute('geometry', 'width', buttonEls.length * MARGIN);
    },

    _hover(el) {
      if (el.is('disabled')) {
        return;
      }
      el.setAttribute('scale', { x: HOVER_SCALE, y: HOVER_SCALE, z: 1 })
    },

    _unhover(el) {
      if (el.is('disabled')) {
        return;
      }
      el.setAttribute('scale', { x: 1, y: 1, z: 1 })
    },

    _createButton(name, src, scale) {
      var container = document.createElement('a-entity');
      container.setAttribute( 'position', { x: 0, y: (DIMENSION * scale - DIMENSION)/ 2, z: 0 });

      var btn = document.createElement('a-image');
      btn.classList.add('clickable');
      btn.setAttribute('mixin', 'clickable');
      btn.setAttribute('src', src );
      btn.setAttribute('geometry', { width: DIMENSION, height: DIMENSION });
      btn.setAttribute('scale', { x: scale, y: scale, z: scale });

      var text = document.createElement('a-entity');
      text.setAttribute('text', {
        align: 'center',
        alphaTest: 0,
        width: TEXT_WIDTH,
        transparent: true,
        opacity: 1,
        value: name
      });
      text.setAttribute('position', { x: 0, y: -TEXT_OFFSET, z: 0 });

      container.appendChild(btn);
      container.appendChild(text);

      return container;
    },

    _updateWishlist() {
      const itemCount = this.el.sceneEl.systems.wishlist.itemCount();
      const wishlistButton = this.buttonLookup[BUTTON_WISHLIST];
      wishlistButton.lastElementChild.setAttribute('text', 'value', WISHLIST_TEXT(itemCount));

      (itemCount === 0)
        ? this._disableButton(wishlistButton)
        : this._enableButton(wishlistButton);
    },

    _disableButton(btn) {
      btn.addState('disabled');
      btn.firstElementChild.setAttribute('material', 'opacity', DISABLED_OPACITY);
    },

    _enableButton(btn) {
      btn.removeState('disabled');
      btn.firstElementChild.setAttribute('material', 'opacity', NORMAL_OPACITY);
    }
  });
}();
