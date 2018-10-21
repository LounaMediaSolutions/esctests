/* global AFRAME, THREE */

!function() {
  const BACKGROUND_IMG = '#background-img';
  const CONFIRM_BUTTON = '#confirm-button-img';
  const CARD_SIZE = 20;
  const CARD_DISTANCE = 40;

  const SKY_COLOR = 'gray';
  const NOOP = () => {};
  const PURCHASE_CARDS = [
    { src: '#purchase-card-01-img', sound: '#purchase-card-01-sound', action: NOOP },
    { src: '#purchase-card-02-img', sound: null, action: function (src) {
        this.packageVideo = document.querySelector(src);
        this.packageVideo.play();
        this.packageVideo.addEventListener('ended', () => {
          this.packageVideo = null;
          setTimeout(() => this._next(), 3000);
        });
    }},
  ];

  AFRAME.registerComponent('purchase', {
    schema: {},

    init() {
      this.cardIndex = 0;

      this.sky = document.createElement('a-sky');
      this.sky.setAttribute('src', BACKGROUND_IMG);

      this.card = document.createElement('a-image');
      this.card.setAttribute('geometry', { width: CARD_SIZE, height: CARD_SIZE });

      this.cardContainer = document.createElement('a-entity');
      this.cardContainer.setAttribute('position', { x: 0, y: 8, z: -CARD_DISTANCE });
      this.cardContainer.appendChild(this.card);

      this.confirmButton = document.createElement('a-image');
      this.confirmButton.setAttribute('src', CONFIRM_BUTTON);
      this.confirmButton.classList.add('clickable');
      this.confirmButton.setAttribute('mixin', 'clickable');
      this.confirmButton.setAttribute('geometry', { width: CARD_SIZE, height: CARD_SIZE / 2 });
      this.confirmButton.addEventListener('click', clamp(() => {
        this._next();
      }));

      this.buttonContainer = document.createElement('a-entity');
      this.buttonContainer.setAttribute('position', { x: 0, y: -15, z: 0 });
      this.buttonContainer.appendChild(this.confirmButton);
      this.cardContainer.appendChild(this.buttonContainer);

      this.el.appendChild(this.sky);
      this.el.appendChild(this.cardContainer);

      this.el.addEventListener('attach', () => this._attach());
      this.el.addEventListener('detach', () => this._detach());
      this.el.addEventListener('state-command', (event) =>  {
        if (event.detail.command === COMMAND_CONFIRM) {
          this.cardIndex === 0 && this._next()
        }
      });

      this._setCard(0);
    },

    _attach() {
      const cameraRotation = this.el.sceneEl.querySelector('[camera]').getAttribute('rotation');
      this.el.setAttribute('rotation', { x: 0, y: cameraRotation.y, z: 0 });

      this.el.setAttribute('deep-visible', true);
      this._setCard(0);
    },

    _detach() {
      this.el.setAttribute('deep-visible', false);
      if (this.packageVideo) {
        this.packageVideo.pause();
        this.packageVideo.currentTime = 0;
      }
    },

    _setCard(idx) {
      const buttonVisible = idx === 0;
      this.buttonContainer.setAttribute('deep-visible', buttonVisible);
      if (buttonVisible) {
        this.buttonContainer.setAttribute('position', { x: 0, y: -15, z: 0 });
      }

      this.cardIndex = idx;

      const card = this._getCard();

      if (!card) {
        return this.el.sceneEl.emit('state-navigate', { state: STATE_HOME });
      } else {
        card.action.call(this, card.src);
      }

      this.card.setAttribute('src', card.src);
      if (card.sound) {
        this.card.setAttribute('sound', {
          src: card.sound,
          autoplay: true,
          volume: SOUND_VOLUME
        });
      } else {
        this.card.removeAttribute('sound');
      }
    },

    _getCard() {
      return PURCHASE_CARDS[this.cardIndex];
    },

    _next() {
      this._setCard(this.cardIndex + 1);
    }
  });
}();
