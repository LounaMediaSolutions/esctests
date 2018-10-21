/* global AFRAME, THREE */

!function() {
  const LOGO_VIDEO = '#logo';

  AFRAME.registerComponent('splash', {
    schema: {},
    clicked: false,
    init() {
      var self = this;
      this.sky = document.createElement('a-sky');
      this.sky.setAttribute('material', { color: 'black' });
      this.videoElement = document.createElement('a-video');
      this.videoElement.setAttribute('src', LOGO_VIDEO);
      this.videoElement.setAttribute('width', 16);
      this.videoElement.setAttribute('height', 9);
      this.videoElement.setAttribute('position', { x: 0, y: 0, z: -10 });
      this.video = document.querySelector(LOGO_VIDEO);
      this.video.addEventListener('ended', () => {
        this.el.sceneEl.emit('state-navigate', { state: STATE_ONBOARDING, replace: true });
      });
      this.el.appendChild(self.videoElement);

      document.body.addEventListener('click', function () {
        if(self.clicked) return;
        self.clicked = true;
        self.video.play();
        document.body.removeEventListener('click', this, false);
        document.getElementById('click_to_start').remove();
      });

      this.el.appendChild(this.sky);

      this.el.addEventListener('attach', () => this._attach());
      this.el.addEventListener('detach', () => this._detach());
    },

    _attach() {
      if(self.clicked) {
        this.video.play();
      }
      this.el.setAttribute('deep-visible', true);
    },

    _detach() {
      this.el.setAttribute('deep-visible', false);
    },
  });
}();
