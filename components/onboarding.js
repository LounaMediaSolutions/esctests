/* global AFRAME, THREE */

!function() {
  const CARD_DISTANCE = 35;

  const BACKGROUND_IMG = '#background-img';
  const NEXT_BUTTON = '#button-next';
  const BEGIN_BUTTON = '#button-begin';
  const ONBOARDING_CARDS = [
    { src: '#onboard-01-img', sound: '#onboard-01-sound', button: NEXT_BUTTON },
    { src: '#onboard-02-img', sound: '#onboard-02-sound', button: NEXT_BUTTON },
    { src: '#onboard-03-img', sound: '#onboard-03-sound', button: NEXT_BUTTON },
    { src: '#onboard-04-img', sound: '#onboard-04-sound', button: BEGIN_BUTTON }
  ];
  const LETS_BEGIN_SOUND = '#lets-begin-sound';

  AFRAME.registerComponent('onboarding', {
    schema: {
    },

    init() {
      this.currentIndex = -1;

      this.sky = document.createElement('a-sky');
      this.sky.setAttribute('src', BACKGROUND_IMG);

      const card = ONBOARDING_CARDS[this.currentIndex];

      this.card = document.createElement('a-image');
      this.card.setAttribute('geometry', { width: 20, height: 20 });

      this.cardContainer = document.createElement('a-entity');
      this.cardContainer.setAttribute('position', { x: 0, y: 8, z: -CARD_DISTANCE });
      this.cardContainer.appendChild(this.card);

      this.nextButton = document.createElement('a-image');
      this.nextButton.classList.add('clickable');
      this.nextButton.setAttribute('mixin', 'clickable');
      this.nextButton.setAttribute('geometry', { width: 20, height: 5 });

      this.nextContainer = document.createElement('a-entity');
      this.nextContainer.setAttribute('position', { x: 0, y: -4.5, z: -CARD_DISTANCE });
      this.nextContainer.appendChild(this.nextButton);

      this.nextButton.addEventListener('click', clamp(() => this._next()));

      this.el.addEventListener('attach', () => this._attach());
      this.el.addEventListener('detach', () => this._detach());
      this.el.addEventListener('state-command', (event) =>  {
        if (event.detail.command === COMMAND_NEXT) {
          this.currentIndex < 3 && this._next();
        } else if (event.detail.command === COMMAND_LETS_BEGIN) {
          this.currentIndex === 3 && this._next();
        }
      });

      this.el.appendChild(this.sky);
      this.el.appendChild(this.cardContainer);
      this.el.appendChild(this.nextContainer);
    },

    _attach() {
      this._next();
      this.el.setAttribute('deep-visible', true);
    },

    _detach() {
      this.el.setAttribute('deep-visible', false);
    },

    _next() {
      this.currentIndex = this.currentIndex + 1;
      const card = ONBOARDING_CARDS[this.currentIndex];

      if (!card) {
        this.card.setAttribute('sound', {
          src: LETS_BEGIN_SOUND,
          autoplay: true,
          volume: SOUND_VOLUME
        });

        return setTimeout(() => {
          this.el.sceneEl.emit('state-navigate', { state: STATE_HOME, replace: true });
          this.el.sceneEl.emit('navbar-activate');
        }, 2500);
      }

      this.card.setAttribute('src', card.src);
      this.card.setAttribute('sound', {
        src: card.sound,
        autoplay: true,
        volume: SOUND_VOLUME
       });
      this.nextButton.setAttribute('src', card.button);
    }
  });
}();
