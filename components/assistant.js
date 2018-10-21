!function(){
  const TEXT_WIDTH = 20;

  const SPEECH_BOX_HEIGHT = 3;
  const SPEECH_BOX_OPACITY = 0.6;
  const SPEECH_ICON_Z_OFFSET = 0.001;
  const SPEECH_ICON_SIZE = 2 * SPEECH_BOX_HEIGHT / 3;

  const ASSISTANT_ICON = "#assistant-icon-img";
  const USER_ICON = "#user-icon-img";

  const ANSWER_WISHLIST_REDIRECT_SOUND = "#answer-wishlist-redirect-sound";
  const ANSWER_WISHLIST_EMPTY_SOUND = "#answer-wishlist-empty-sound";
  const ANSWER_POPULAR_DESTINATION_SOUND = "#answer-popular-destination-sound";
  const ANSWER_WHERE_SHOULD_I_STAY_SOUND = "#answer-where-should-i-stay-sound";
  const ANSWER_WHERE_ELSE_SOUND = "#answer-where-else-sound";

  AFRAME.registerComponent('assistant', {
    schema: {
      controller: { type: 'selector' }
    },

    init() {
      const sky = document.createElement('a-sky');
      sky.setAttribute('radius', 3);
      sky.setAttribute('color', 'black');
      sky.setAttribute('opacity', SPEECH_BOX_OPACITY);

      const speechBox = this._createSpeechBox();
      speechBox.setAttribute('position', { x: 0, y: -1/2, z: -1 });
      speechBox.setAttribute('scale', { x: 1/20, y: 1/20, z: 1 });

      this.el.appendChild(sky);
      this.el.appendChild(speechBox);
      this.el.setAttribute('visible', false);

      this._initializeCommands();
      this.system.addCommands(this.commands);

      this.data.controller.addEventListener('triggerdown', () => this._toggleAssistant());
      this.el.sceneEl.addEventListener('state-assistant', () => this._toggleAssistant())
      this.el.sceneEl.addEventListener('speech-result-match', () => this._hideAssistant());
      this.el.sceneEl.addEventListener('speech-began', () => this._assistantSpeak('Listening'));
      this.el.sceneEl.addEventListener('speech-transcript', (event) => this._addSentence(event.detail.sentences));
    },

    tick() {
      if (!this.el.object3D.visible) return;

      if (this.speechBoxText.components.text.value === '') {
        return this._setTextWidth(0);
      }

      const geometry = this.speechBoxText.components.text.geometry;
      if (!geometry || !geometry.boundingSphere) return;

      this._setTextWidth(5 + geometry.boundingSphere.radius / 15);
    },

    _setTextWidth(width) {
      this.speechBoxLeftEnd.setAttribute('position', { x: -width / 2, y: 0, z: 0 });
      this.speechBoxIcon.setAttribute('position', { x: -width / 2, y: 0, z: SPEECH_ICON_Z_OFFSET });
      this.speechBoxText.setAttribute('geometry', { width: width, height: SPEECH_BOX_HEIGHT });
      this.speechBoxRightEnd.setAttribute('position', { x: width / 2, y: 0, z: 0 });
    },

    _toggleAssistant() {
      this.el.getAttribute('visible')
        ? this._hideAssistant()
        : this._showAssistant();
    },

    _showAssistant() {
      this.el.setAttribute('visible', true);
      this._assistantSpeak('');
      this.system.start();
    },

    _hideAssistant() {
      this.system.abort();
      this._assistantSpeak('');
      this.el.setAttribute('visible', false);
    },

    _createSpeechBox() {
      const speechBox = document.createElement('a-entity');

      this.speechBoxLeftEnd = document.createElement('a-entity');
      this.speechBoxLeftEnd.setAttribute('material', { color: 'black', opacity: SPEECH_BOX_OPACITY });
      this.speechBoxLeftEnd.setAttribute('geometry', { primitive: 'circle', radius: SPEECH_BOX_HEIGHT / 2, thetaStart: 90, thetaLength: 180 });
      this.speechBoxLeftEnd.setAttribute('position', { x: 0, y: 0, z: 0 });

      this.speechBoxText = document.createElement('a-entity');
      this.speechBoxText.setAttribute('material', { color: 'black', opacity: SPEECH_BOX_OPACITY });
      this.speechBoxText.setAttribute('geometry', { primitive: 'plane', width: 'auto', height: SPEECH_BOX_HEIGHT });
      this.speechBoxText.setAttribute('text', {
        color: 'white',
        align: 'center',
        alphaTest: 0,
        transparent: true,
        opacity: 1,
        zOffset: 0.02,
        width: TEXT_WIDTH * 40,
        wrapCount: 1000,
        value: ""
      });

      this.speechBoxRightEnd = document.createElement('a-entity');
      this.speechBoxRightEnd.setAttribute('material', { color: 'black', opacity: SPEECH_BOX_OPACITY });
      this.speechBoxRightEnd.setAttribute('geometry', { primitive: 'circle', radius: SPEECH_BOX_HEIGHT / 2, thetaStart: -90, thetaLength: 180 });
      this.speechBoxRightEnd.setAttribute('position', { x: 0, y: 0, z: 0 });

      this.speechBoxIcon = document.createElement('a-image');
      this.speechBoxIcon.setAttribute('src', ASSISTANT_ICON);
      this.speechBoxIcon.setAttribute('position', { x: 0, y: 0, z: SPEECH_ICON_Z_OFFSET });
      this.speechBoxIcon.setAttribute('geometry', { width: SPEECH_ICON_SIZE, height: SPEECH_ICON_SIZE });

      // this.speechBox.setAttribute('position', { x: MARGIN / 2, y: DIMENSION * 1.67, z: 0 });
      speechBox.appendChild(this.speechBoxLeftEnd);
      speechBox.appendChild(this.speechBoxText);
      speechBox.appendChild(this.speechBoxRightEnd);
      speechBox.appendChild(this.speechBoxIcon);

      return speechBox;
    },

    _assistantSpeak(text, sound = null) {
      this._updateAssistant('assistant', text, sound);
    },

    _userSpeak(text) {
      this._updateAssistant('user', text);
    },

    _updateAssistant(speaker, text, sound = null) {
      this.speechBoxText.setAttribute('text', 'value', text);

      if (sound) {
        this.speechBoxText.setAttribute('sound', { src: sound, volume: SOUND_VOLUME / 20, maxDistance: 1 });
        this.speechBoxText.components.sound.stopSound();
        this.speechBoxText.components.sound.playSound();
      } else {
        this.speechBoxText.removeAttribute('sound');
      }

      if (speaker === 'assistant') {
        this.speechBoxIcon.setAttribute('src', ASSISTANT_ICON);
      } else {
        this.speechBoxIcon.setAttribute('src', USER_ICON);
      }
    },

    _initializeCommands() {
      this.commands = {
        'assistant-wishlist': {
          regexp: /(what's|what is) in my (wishlist|wish list)/,
          callback: () => {
            const itemCount = this.el.sceneEl.systems.wishlist.itemCount();
            if (itemCount) {
              this._assistantSpeak(
                'One moment, redirecting to your wishlist.',
                ANSWER_WISHLIST_REDIRECT_SOUND
              );
              setTimeout(() =>
                this.el.sceneEl.emit('state-navigate', { state: STATE_WISHLIST })
              , 2000);
            } else {
              this._assistantSpeak(
                'Your wishlist is empty.',
                ANSWER_WISHLIST_EMPTY_SOUND
              );
            }
          }
        },

        'assistant-popular-destination': {
          regexp: /(what's|what is|where) (the)? most popular (destination)/,
          callback: () => {
            this._assistantSpeak(
              '"Pigeon Rocks" is the most popular destination. 53% viewers chose it.',
              ANSWER_POPULAR_DESTINATION_SOUND
            );
          }
        },

        'assistant-where-should-i-stay': {
          regexp: /(where) should (I|we) stay/,
          callback: () => {
            this._assistantSpeak(
              'Hamra neighbourhood, is a great place to get to know Beirut, through the busy street, where locals come and go.',
              ANSWER_WHERE_SHOULD_I_STAY_SOUND
            );
          }
        },

        'assistant-where-else': {
          regexp: /where else can I go/,
          callback: () => {
            this._assistantSpeak(
              'We continue to add locations to Escapar. Stay tuned.',
              ANSWER_WHERE_ELSE_SOUND
            );
          }
        }
      };
    },

    _addSentence(sentences) {
      this._userSpeak(Array.isArray(sentences) ? sentences[0] : sentences);
    }
  })
}();
