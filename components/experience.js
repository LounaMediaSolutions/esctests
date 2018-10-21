/* global AFRAME, THREE */

/**
 * Component that listens to an event, fades out an entity, swaps the texture, and fades it
 * back in.
 */
(function() {
  const RADIUS = 100;
  const POI_ORDINATE = Math.trunc((RADIUS - 10) / Math.sqrt(2));
  const INFO_DISTANCE_SCALE = 2;
  const INFO_ORDINATE = POI_ORDINATE / INFO_DISTANCE_SCALE;
  const INFO_WIDTH = 36;
  const INFO_Y_OFFSET = 7;
  const BUTTON_SCALE = 12;

  const DISMISS_BUTTON = 'dismiss';
  const ADD_TO_WISHLIST_BUTTON = 'add-to-wishlist';
  const ADDED_OVERLAY_IMG = '#purchase-added-overlay-img';

  const EXPERIENCE_VIDEO = '#experience-video';
  const POINTS_OF_INTEREST = [
    {
      marker: '#poi-02-img',
      position: { x:POI_ORDINATE, y: 0, z: POI_ORDINATE },
      rotation: { x:0, y: -135, z: 0 },
      card: '#info-card-02-img',
      wishlistItem: 'avenue-one',
      srcVideo: 'footage/files/POI1-Winery.mp4'
    },
    {
      marker: '#poi-02-img',
      position: { x: -POI_ORDINATE, y: 0, z: POI_ORDINATE },
      rotation: { x: 0, y: 135, z: 0 },
      card: '#info-card-02-img',
      wishlistItem: 'avenue-one',
      srcVideo: 'footage/files/POI3-LakesAndPark.mp4'
    },

    {
      marker: '#poi-02-img',
      position: { x: POI_ORDINATE, y: 0, z: -POI_ORDINATE },
      rotation: { x: 0, y: -35, z: 0 },
      card: '#info-card-02-img',
      wishlistItem: 'avenue-one',
      srcVideo: 'footage/files/POI2-AncientCity.mp4'
    },
  ];
  const DISMISS_BUTTON_IMAGE = '#dismiss-button-img';
  const ADD_TO_WISHLIST_BUTTON_IMAGE = '#add-to-wishlist-button-img'
  const REMOVE_FROM_WISHLIST_BUTTON_IMAGE = '#remove-wishlist-button-img';

  AFRAME.registerComponent('experience', {
    schema: {
    },

    init() {
      var self = this;
      this.markers = [];

      this.video = document.querySelector(EXPERIENCE_VIDEO);
      this.video.pause();

      this.videosphere = document.createElement('a-videosphere');
      this.videosphere.setAttribute('material', 'side', 'back');
      this.videosphere.setAttribute('src', EXPERIENCE_VIDEO);
      this.videosphere.setAttribute('radius', RADIUS);

      this.markerContainer = document.createElement('a-entity');
      this.markerContainer.setAttribute('rotation', { x: 0, y: 105, z: 0 });

      POINTS_OF_INTEREST.forEach((poi, index) => {
        const marker = this._createMarker(poi, index);
        marker.__poi = poi;
        this.markerContainer.appendChild(marker);
        marker.addEventListener('click', clamp(() => {
          this._pauseVideo();
          this._showCard(marker);
        }));
      });

      this.infoCardContainer = this._createInfoCard();
      this.markerContainer.appendChild(this.infoCardContainer);
      this.infoCard.classList.add('marker', 'clickable');
      this.infoCard.addEventListener('click', function ( e ) {
        self.videosphere.setAttribute('src', e.srcElement.__marker.__poi.srcVideo);
        self.videosphere.components.material.material.map.image.play();
      });

      this.el.appendChild(this.videosphere);
      this.el.appendChild(this.markerContainer);

      this.video.addEventListener('ended', () => {
        this.el.sceneEl.emit('state-navigate', { state: STATE_PACKAGES, replace: true });
      });

      this.el.addEventListener('attach', () => this._attach());
      this.el.addEventListener('detach', () => this._detach());
      this.el.addEventListener('state-command', (event) =>  {
        if (event.detail.command === COMMAND_PAUSE) {
          this._pauseVideo();
        } else if (event.detail.command === COMMAND_PLAY) {
          this._playVideo();
        } else if (event.detail.command === COMMAND_CLOSE) {
          this._hideCard();
          this._playVideo();
        }
      });

      this.el.sceneEl.addEventListener('wishlist-added', (event) => {
        this._updateCard(event.detail.item);
      });
      this.el.sceneEl.addEventListener('wishlist-removed', (event) => {
        this._updateCard(event.detail.item);
      });
    },

    _attach() {
      this.el.setAttribute('deep-visible', true);
      this._start();
    },

    _detach() {
      this.videosphere.setAttribute('src', EXPERIENCE_VIDEO);
      this._stop();
      this.el.setAttribute('deep-visible', false);
    },

    _hideCard() {
      this.infoCard.__marker = null;
      this.infoCard.components.sound && this.infoCard.components.sound.stopSound();
      this.infoCardContainer.setAttribute('deep-visible', false);
    },

    _showCard(marker) {
      if (this.infoCard.__marker === marker) return;

      this.infoCardContainer.setAttribute('deep-visible', true);
      this._updateInfoCardLayout(marker.__poi);
      this.infoCard.__marker = marker;
    },

    _updateInfoCardLayout(poi) {
      this.infoCardContainer.setAttribute('position', {
        x: poi.position.x / INFO_DISTANCE_SCALE,
        y: INFO_Y_OFFSET,
        z: poi.position.z / INFO_DISTANCE_SCALE
      });

      this.infoCard.setAttribute('src', poi.card);

      if (poi.sound) {
        this.infoCard.setAttribute('sound', { src: poi.sound, maxDistance: 1, volume: SOUND_VOLUME });
        this.infoCard.components.sound.playSound();
      } else {
        this.infoCard.removeAttribute('sound');
      }

      if (poi.wishlistItem) {
        this.wishlistButtonContainer.setAttribute('deep-visible', true);
        this.wishlistButtonContainer.setAttribute('position', { x: 0, y: 8, z: 0 });
        this.infoCardEntity.setAttribute('position', { x: 0, y: 21, z: 0 });
        this._updateCard(poi.wishlistItem);
      } else {
        this.wishlistButtonContainer.setAttribute('deep-visible', false);
        this.infoCardEntity.setAttribute('position', { x: 0, y: 13, z: 0 });
        this.overlay.setAttribute('visible', false);
      }
    },

    _isInWishlist(item) {
      return this.el.sceneEl.systems.wishlist.has(item);
    },

    _updateCard(item) {
      const inList = this._isInWishlist(item);

      const button = this.wishlistButtonContainer.firstElementChild;
      const overlay = this.overlay;

      button.setAttribute('src', inList ? REMOVE_FROM_WISHLIST_BUTTON_IMAGE : ADD_TO_WISHLIST_BUTTON_IMAGE);
      overlay.setAttribute('visible', inList);
    },

    _createInfoCard() {
      const container = document.createElement('a-entity');
      container.setAttribute('look-at', '[camera]');
      container.setAttribute('position', { x: INFO_ORDINATE, y: INFO_Y_OFFSET, z: INFO_ORDINATE });

      this.infoCardEntity = document.createElement('a-entity');
      this.infoCardEntity.setAttribute('position', { x: 0, y: 21, z: 0 });

      this.infoCard = document.createElement('a-image');
      this.infoCard.setAttribute('geometry', { width: INFO_WIDTH, height: INFO_WIDTH / 2 });
      this.infoCard.setAttribute('position', { x: 0, y: 0, z: 0 });

      this.overlay = document.createElement('a-image');
      this.overlay.setAttribute('geometry', { width: INFO_WIDTH, height: INFO_WIDTH / 2 });
      this.overlay.setAttribute('position', { x: 0, y: 0, z: 0.1 });
      this.overlay.setAttribute('visible', false);
      this.overlay.setAttribute('src', ADDED_OVERLAY_IMG);

      this.infoCardEntity.appendChild(this.infoCard);
      this.infoCardEntity.appendChild(this.overlay);

      const wishlistButton = document.createElement('a-image');
      wishlistButton.setAttribute('src', ADD_TO_WISHLIST_BUTTON_IMAGE);
      wishlistButton.classList.add('marker', 'clickable');
      wishlistButton.setAttribute('geometry', { width: INFO_WIDTH, height: INFO_WIDTH / 4 });
      wishlistButton.setAttribute('position', { x: 0, y: 0, z: 0 });
      wishlistButton.addEventListener('click', clamp(() => {
        const item = this.infoCard.__marker.__poi.wishlistItem;
        if (this._isInWishlist(item)) {
          this.el.sceneEl.emit('wishlist-remove', { item: item })
        } else {
          this.el.sceneEl.emit('wishlist-add', { item: item });
        }
      }));
      this.wishlistButtonContainer = document.createElement('a-entity');
      this.wishlistButtonContainer.setAttribute('position', { x: 0, y: 8, z: 0 });
      this.wishlistButtonContainer.appendChild(wishlistButton);

      const dismissButton = document.createElement('a-image');
      dismissButton.setAttribute('src', DISMISS_BUTTON_IMAGE);
      dismissButton.classList.add('marker', 'clickable');
      dismissButton.setAttribute('geometry', { width: INFO_WIDTH, height: INFO_WIDTH / 4 });
      dismissButton.setAttribute('position', { x: 0, y: 0, z: 0 });
      dismissButton.addEventListener('click', clamp(() => {
        this._hideCard();
        this._playVideo();
      }));
      this.dismissButtonContainer = document.createElement('a-entity');
      this.dismissButtonContainer.setAttribute('position', { x: 0, y: 0, z: 0 });
      this.dismissButtonContainer.appendChild(dismissButton);

      container.appendChild(this.infoCardEntity);
      container.appendChild(this.wishlistButtonContainer);
      container.appendChild(this.dismissButtonContainer);

      return container;
    },

    _createMarker(poi) {
      const marker = document.createElement('a-image');

      marker.classList.add('marker', 'clickable');
      marker.setAttribute('src', poi.marker);
      marker.setAttribute('position', poi.position);
      marker.setAttribute('rotation', poi.rotation);
      marker.setAttribute('scale', { x: 2 * BUTTON_SCALE, y: BUTTON_SCALE, z: 1 });

      return marker;
    },

    _start() {
      this._hideCard();
      this.video.currentTime = 0;
      this.video.play();
    },

    _stop() {
      this.video.pause();
    },

    _playVideo() {
      this.video.play();
    },

    _pauseVideo() {
      this.video.pause();
    }
  });
})();

        // <a-videosphere
        //   id="experience-player"
        //   src="#experience-video"
        //   radius="100"
        // ></a-videosphere>
        // <a-entity id="markers">
        //   <a-image src="https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Finfo-icon.png?1516819575267"
        //            class="marker clickable"
        //            position="70 0 70"
        //            rotation="0 -135 0"
        //            scale="8 8 1"
        //            sound="src: #audio-1; volume: 70"
        //            play-audio-on-hover=""
        //   ></a-image>
        //   <a-image src="https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Finfo-icon.png?1516819575267"
        //            class="marker clickable"
        //            position="-70 0 70"
        //            rotation="0 135 0"
        //            scale="8 8 1"
        //            sound="src: #audio-2; volume: 70"
        //            play-audio-on-hover=""
        //   ></a-image>
        // </a-entity>
