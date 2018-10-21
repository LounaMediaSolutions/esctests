/* global AFRAME, THREE */

!function() {
    const BACKGROUND_IMG = '#background-img';
    const CONFIRM_BUTTON = '#purchase-button-short-img';
    const CARD_SIZE = 20;
    const CARD_DISTANCE = 40;
    const CARD_MARGIN = 30;

    const CARDS = {
      'temple': '#wishlist-card-01-img',
      'ski': '#wishlist-card-02-img',
      'avenue-one': '#wishlist-card-03-img'
    };

    AFRAME.registerComponent('wishlist', {
      schema: {},

      init() {
        this.sky = document.createElement('a-sky');
        this.sky.setAttribute('src', BACKGROUND_IMG);

        this.cards = document.createElement('a-entity');

        this.el.appendChild(this.sky);
        this.el.appendChild(this.cards);

        this.el.addEventListener('attach', () => this._attach());
        this.el.addEventListener('detach', () => this._detach());

        this.el.sceneEl.addEventListener('wishlist-add', (event) => {
          this._addCard(event.detail.item);
        });
        this.el.sceneEl.addEventListener('wishlist-remove', (event) => {
          this._removeCard(event.detail.item);
        });
      },

      _attach() {
        this.el.setAttribute('deep-visible', true);
      },

      _detach() {
        this.el.setAttribute('deep-visible', false);
      },

      _purchase() {
        this.el.sceneEl.emit('state-navigate', { state: STATE_PURCHASE, replace: true });
      },

      _addCard(item) {
        if (!this.system.add(item)) {
          return;
        }

        this.cards.appendChild(this._createCard(item));
        this._updateCardPositions();
      },

      _removeCard(item) {
        if (!this.system.remove(item)) {
          return;
        }

        this.cards.removeChild(this._findCard(item));
        this._updateCardPositions();
      },

      _updateCardPositions() {
        const cardEls = this.cards.getChildEntities();
        cardEls.forEach((card, idx) => {
          card.setAttribute('position', { x: CARD_MARGIN * (idx - (cardEls.length - 1) / 2), y: 0, z: 0});
        });
      },

      _findCard(item) {
        return this.cards.querySelector(`[data-item="${item}"]`);
      },

      _createCard(item) {
        const src = CARDS[item];
        const container = document.createElement('a-entity');
        container.setAttribute('data-item', item);

        const card = document.createElement('a-image');
        card.setAttribute('geometry', { width: CARD_SIZE, height: CARD_SIZE });
        card.setAttribute('src', src);

        const cardContainer = document.createElement('a-entity');
        cardContainer.setAttribute('position', { x: 0, y: 8, z: -CARD_DISTANCE });
        cardContainer.appendChild(card);

        const purchaseButton = document.createElement('a-image');
        purchaseButton.setAttribute('src', CONFIRM_BUTTON);
        purchaseButton.classList.add('clickable');
        purchaseButton.setAttribute('mixin', 'clickable');
        purchaseButton.setAttribute('geometry', { width: CARD_SIZE, height: CARD_SIZE / 2 });
        purchaseButton.addEventListener('click', clamp(() => {
          this._purchase();
        }));

        const buttonContainer = document.createElement('a-entity');
        buttonContainer.setAttribute('position', { x: 0, y: -7, z: -CARD_DISTANCE });
        buttonContainer.appendChild(purchaseButton);

        container.appendChild(cardContainer);
        container.appendChild(buttonContainer);

        return container;
      }
    });
}();
