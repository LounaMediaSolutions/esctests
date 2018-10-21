/* global AFRAME, THREE */

!function() {
  const RADIUS = 100;
  const ACTIVE_SCALE = 1.2;

  const CARD_SIZE = 18;
  const CARD_DISTANCE = 40;

  const CARD_HEIGHT = CARD_SIZE / 2;
  const CARD_WIDTH = CARD_SIZE;
  const CARD_MARGIN = ACTIVE_SCALE * CARD_SIZE;

  const CARDS = [
    { img: '#home-01-img', src: '#home-01-video' },
    { img: '#home-02-img', src: '#home-02-video' },
    { img: '#home-03-img', src: '#home-03-video' },
    { img: '#home-04-img', src: '#home-04-video' },
  ];
  const INITIAL_CARD_INDEX = 0;
  const DURATION = 20000;
  const FADE_DURATION = 500;

  AFRAME.registerComponent('home', {
    schema: {
    },

    init() {
      this.videosphere = document.createElement('a-videosphere');
      this.videosphere.setAttribute('material', 'side', 'back');
      this.videosphere.setAttribute('radius', RADIUS);
      this.videosphere.setAttribute('animation__fade', {
        startEvents: 'video-fade',
        property: 'material.color',
        dir: 'alternate',
        dur: FADE_DURATION,
        from: '#FFF',
        to: '#000'
      });

      this.cardContainer = document.createElement('a-entity');
      this.cardContainer.setAttribute('position', { x: 0, y: -CARD_DISTANCE/2, z: -CARD_DISTANCE});

      this.cards = [];

      CARDS.forEach((cardInfo, idx) => {
        var card = this._createCard(cardInfo);
        card.setAttribute('position', { x: CARD_MARGIN * (idx - (CARDS.length - 1) / 2), y: 0, z: 0});
        this.cards.push(card);
        this.cardContainer.appendChild(card);
        card.clickHandler = card.addEventListener('click', clamp(() => {
          this.el.sceneEl.emit('state-navigate', { state: STATE_EXPERIENCE });
        }));
      });

      this.el.appendChild(this.videosphere);
      this.el.appendChild(this.cardContainer);

      this.el.addEventListener('attach', () => this._attach());
      this.el.addEventListener('detach', () => this._detach());
      this.el.addEventListener('state-command', (event) =>  {
        if (event.detail.command === COMMAND_PAUSE) {
          this._pause();
        } else if (event.detail.command === COMMAND_PLAY) {
          this._play();
        } else if (event.detail.command === COMMAND_NEXT) {
          this._pause();
          this._setCard(this.cardIndex + 1);
          this._play();
        } else if (event.detail.command === COMMAND_PREV) {
          this._pause();
          this._setCard(this.cardIndex - 1);
          this._play();
          }
      });
    },

    _attach() {
      this.el.setAttribute('deep-visible', true);
      this._setCard(INITIAL_CARD_INDEX);
      this._start();
    },

    _detach() {
      this.el.setAttribute('deep-visible', false);
      this._stop();
    },

    _setCard(cardIndex) {
      this._makeInactive(this.cardIndex);
      this.cardIndex = (cardIndex + this.cards.length) % this.cards.length;
      this.currentCardInfo = CARDS[this.cardIndex];
      this._makeActive(this.cardIndex);
    },

    _makeActive(cardIndex) {
      const card = this.cards[cardIndex];
      if (!card) return;

      card.setAttribute('scale', { x: ACTIVE_SCALE, y: ACTIVE_SCALE, z: 1 });
      const position = card.getAttribute('position');
      card.setAttribute('position', { x: position.x, y: CARD_HEIGHT * (ACTIVE_SCALE - 1) / 2, z: position.z });

      this.videosphere.emit('video-fade');
      setTimeout(() => {
        const cardInfo = CARDS[this.cardIndex];

        this.videosphere.setAttribute('src', cardInfo.src);

        const currentVideo = document.querySelector(cardInfo.src);
        if (currentVideo) {
          currentVideo.currentTime = 0;
          currentVideo.play();
        }
      }, FADE_DURATION);
    },

    _makeInactive(cardIndex) {
      const card = this.cards[cardIndex];
      if (!card) return;

      card.setAttribute('scale', { x: 1, y: 1, z: 1 });
      const position = card.getAttribute('position');
      card.setAttribute('position', { x: position.x, y: 0, z: position.z });

      const cardInfo = CARDS[this.cardIndex];
      const currentVideo = document.querySelector(cardInfo.src);
      currentVideo && currentVideo.pause();
    },

    _createCard(cardInfo) {
      const card = document.createElement('a-image');

      card.classList.add('card', 'clickable');
      card.setAttribute('mixin', 'clickable');
      card.setAttribute('geometry', { height: CARD_HEIGHT, width: CARD_WIDTH });
      // card.setAttribute('material', { color: 'black', opacity: 0.8 });
      card.setAttribute('src', cardInfo.img);
      // card.setAttribute('scale', { x: BUTTON_SCALE, y: BUTTON_SCALE, z: 1 });

      // const title = document.createElement('a-text');
      // title.setAttribute('value', cardInfo.title);
      // title.setAttribute('width', 8);
      // title.setAttribute('baseline', 'top');
      // title.setAttribute('position', { x: -1.4, y: 0.4, z: 0 });

      // const desc = document.createElement('a-text');
      // desc.setAttribute('value', cardInfo.desc);
      // desc.setAttribute('width', 5);
      // desc.setAttribute('baseline', 'bottom');
      // desc.setAttribute('position', { x: -1.4, y: -0.3, z: 0 });

      // card.appendChild(title);
      // card.appendChild(desc);

      const cardContainer = document.createElement('a-entity');
      cardContainer.setAttribute('mixin', 'anim');

      cardContainer.appendChild(card);

      return cardContainer;
    },

    _start() {
      this._play();
    },

    _stop() {
      this._pause();
      this._makeInactive(this.cardIndex);
    },

    _play() {
      this.interval = this.interval || setInterval(() => {
        if (!this.interval) return;
        this._setCard(this.cardIndex + 1);
      }, DURATION);
    },

    _pause() {
      clearInterval(this.interval);
      this.interval = null;
    }
  });
}();
