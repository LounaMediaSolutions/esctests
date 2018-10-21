/* global AFRAME, THREE */

!function() {
    const BACKGROUND_IMG = '#background-img';
    const ADDED_OVERLAY_IMG = '#purchase-added-overlay-img'
    const PURCHASE_BUTTON = '#purchase-button-img';
    const ADD_TO_WISHLIST_BUTTON = '#add-wishlist-button-img';
    const REMOVE_FROM_WISHLIST_BUTTON = '#remove-wishlist-button-img'
    const CARD_WIDTH = 20;
    const CARD_HEIGHT = CARD_WIDTH / 2;
    const CARD_DISTANCE = 30;
    const CARD_MARGIN = 20;

    const CARDS = {
      'temple': '#package-card-01-img',
      'ski':    '#package-card-02-img'
    };

    AFRAME.registerComponent('packages', {
      schema: {},

      init() {
        this.sky = document.createElement('a-sky');
        this.sky.setAttribute('src', BACKGROUND_IMG);

        this.cards = document.createElement('a-entity');
        Object.keys(CARDS).forEach(item => {
          this.cards.appendChild(this._createCard(item));
        });
        this._updateCardPositions();

        this.el.appendChild(this.sky);
        this.el.appendChild(this.cards);

        this.el.addEventListener('attach', () => this._attach());
        this.el.addEventListener('detach', () => this._detach());

        this.el.sceneEl.addEventListener('wishlist-added', (event) => {
          this._updateCard(event.detail.item);
        });
        this.el.sceneEl.addEventListener('wishlist-removed', (event) => {
          this._updateCard(event.detail.item);
        });
      },

      _attach() {
        const cameraRotation = this.el.sceneEl.querySelector('[camera]').getAttribute('rotation');
        this.el.setAttribute('rotation', { x: 0, y: cameraRotation.y, z: 0 });

        this.el.setAttribute('deep-visible', true);
      },

      _detach() {
        this.el.setAttribute('deep-visible', false);
      },

      _purchase() {
        this.el.sceneEl.emit('state-navigate', { state: STATE_PURCHASE });
      },

      _wishlistAction(item) {
        if (this._isInWishlist(item)) {
          this.el.sceneEl.emit('wishlist-remove', { item: item })
        } else {
          this.el.sceneEl.emit('wishlist-add', { item: item });
        }
      },

      _updateCardPositions() {
        const cardEls = this.cards.getChildEntities();
        cardEls.forEach((card, idx) => {
          card.setAttribute('position', { x: CARD_MARGIN * (idx - (cardEls.length - 1) / 2), y: 0, z: 0});
        });
      },

      _updateCard(item) {
        const inList = this._isInWishlist(item);
        const container = this._findCard(item);

        if (!container) { return; }

        const button = container.querySelector('.button.wishlist');
        const overlay = container.querySelector('.overlay');

        button.setAttribute('src', inList ? REMOVE_FROM_WISHLIST_BUTTON : ADD_TO_WISHLIST_BUTTON);
        overlay.setAttribute('visible', inList);
      },

      _findCard(item) {
        return this.cards.querySelector(`[data-item="${item}"]`);
      },

      _isInWishlist(item) {
        return this.el.sceneEl.systems.wishlist.has(item);
      },

      _createCard(item) {
        const src = CARDS[item];
        const container = document.createElement('a-entity');
        container.setAttribute('data-item', item);

        const card = document.createElement('a-image');
        card.setAttribute('geometry', { width: CARD_WIDTH, height: CARD_HEIGHT });
        card.setAttribute('src', src);

        const overlay = document.createElement('a-image');
        overlay.classList.add('overlay');
        overlay.setAttribute('geometry', { width: CARD_WIDTH, height: CARD_HEIGHT });
        overlay.setAttribute('visible', false);
        overlay.setAttribute('src', ADDED_OVERLAY_IMG);

        const cardContainer = document.createElement('a-entity');
        cardContainer.setAttribute('position', { x: 0, y: CARD_HEIGHT / 2, z: -CARD_DISTANCE });
        cardContainer.appendChild(card);
        cardContainer.appendChild(overlay);

        const purchaseButton = document.createElement('a-image');
        purchaseButton.setAttribute('src', PURCHASE_BUTTON);
        purchaseButton.classList.add('clickable');
        purchaseButton.setAttribute('mixin', 'clickable');
        purchaseButton.setAttribute('geometry', { width: CARD_WIDTH, height: CARD_HEIGHT / 2 });
        purchaseButton.addEventListener('click', clamp(() => {
          this._purchase(item);
        }));

        const purchaseButtonContainer = document.createElement('a-entity');
        purchaseButtonContainer.setAttribute('position', { x: 0, y: - 3 * CARD_HEIGHT / 4, z: -CARD_DISTANCE });
        purchaseButtonContainer.appendChild(purchaseButton);

        const wishlistButton = document.createElement('a-image');
        wishlistButton.classList.add('button', 'wishlist');
        wishlistButton.setAttribute('src', ADD_TO_WISHLIST_BUTTON);
        wishlistButton.classList.add('clickable');
        wishlistButton.setAttribute('mixin', 'clickable');
        wishlistButton.setAttribute('geometry', { width: CARD_WIDTH, height: CARD_HEIGHT / 2 });
        wishlistButton.addEventListener('click', clamp(() => {
          this._wishlistAction(item);
        }));

        const wishlistButtonContainer = document.createElement('a-entity');
        wishlistButtonContainer.setAttribute('position', { x: 0, y: -CARD_HEIGHT / 4, z: -CARD_DISTANCE });
        wishlistButtonContainer.appendChild(wishlistButton);

        container.appendChild(cardContainer);
        container.appendChild(purchaseButtonContainer);
        container.appendChild(wishlistButtonContainer);

        return container;
      }
    });
}();
