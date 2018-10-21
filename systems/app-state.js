/* global AFRAME, THREE */

const STATE_SPLASH = 'splash';
const STATE_ONBOARDING = 'onboarding';
const STATE_HOME = 'home';
const STATE_EXPERIENCE = 'experience';
const STATE_PACKAGES = 'packages';
const STATE_WISHLIST = 'wishlist';
const STATE_PURCHASE = 'purchase';

const COMMAND_PLAY = 'play';
const COMMAND_PAUSE = 'pause';
const COMMAND_NEXT = 'next';
const COMMAND_PREV = 'prev';
const COMMAND_CLOSE = 'close';
const COMMAND_CONFIRM = 'confirm';
const COMMAND_LETS_BEGIN = 'lets-begin';

const SOUND_VOLUME = 40;

!function(){
  const INITIAL_STATE = STATE_SPLASH;

  AFRAME.registerSystem('app-state', {
    init() {
      this.states = {
        [STATE_SPLASH]: this.el.querySelector('[splash]'),
        [STATE_ONBOARDING]: this.el.querySelector('[onboarding]'),
        [STATE_HOME]: this.el.querySelector('[home]'),
        [STATE_EXPERIENCE]: this.el.querySelector('[experience]'),
        [STATE_PACKAGES]: this.el.querySelector('[packages]'),
        [STATE_WISHLIST]: this.el.querySelector('[wishlist]'),
        [STATE_PURCHASE]: this.el.querySelector('[purchase]'),
      }

      this.history = [];

      this._initializeCommands();

      this.el.addEventListener('state-navigate', (event) => {
        this._navigate(event.detail.state, !!event.detail.replace);
      });

      this.el.addEventListener('state-return', (event) => {
        this._goBack();
      });

      this.el.addEventListener('loaded', this._start.bind(this));
      this.el.systems.assistant.addCommands(this.commands);
    },

    _start() {
      this._navigate(INITIAL_STATE);

      // this.el.emit('wishlist-add', { item: 'temple' });
      // this.el.emit('wishlist-add', { item: 'ski' });
      // this.el.emit('wishlist-add', { item: 'temple' });
      // this.el.emit('wishlist-remove', { item: 'temple' });
    },

    _goBack() {
      const prevState = this.history.pop();
      if (prevState) {
        this._setState(prevState);
      }
    },

    _navigate(activeState, replace = false) {
      if (this.currentState === activeState) return;

      if (!replace) {
        this.history.push(this.currentState);
      }

      this._setState(activeState);
    },

    _setState(activeState) {
      Object.keys(this.states).forEach(state => {
        if (state !== activeState) {
          this.states[state].emit('detach');
        }
      });

      this.currentState = activeState;
      this.states[activeState].emit('attach');
    },

    _is(...states) {
      return states.some(state => this.currentState === state);
    },

    _emit(eventName, data = {}) {
      this.states[this.currentState].emit(eventName, data);
    },

    _initializeCommands() {
      const goBack = () => {
        this._goBack();
      };

      const startExperience = () => {
        if (this._is(STATE_HOME)) {
          this._navigate(STATE_EXPERIENCE);
        } else if (this._is(STATE_EXPERIENCE)) {
          this._emit('state-command', { command:  COMMAND_PLAY });
        }
      };

      const startPurchase = () => {
        if (this._is(STATE_WISHLIST, STATE_PACKAGES)) {
          this._navigate(STATE_PURCHASE);
        }
      };

      this.commands = {
        'stop': () => {
          this._emit('state-command', { command:  COMMAND_PAUSE });
        },
        'play': () => {
          this._emit('state-command', { command:  COMMAND_PLAY });
        },
        'next': () => {
          this._emit('state-command', { command:  COMMAND_NEXT });
        },
        'let\'s begin': () => {
          this._emit('state-command', { command:  COMMAND_LETS_BEGIN });
        },
        'previous': () => {
          this._emit('state-command', { command:  COMMAND_PREV });
        },
        'close': () => {
          this._emit('state-command', { command:  COMMAND_CLOSE });
        },
        'pigeon rocks': startExperience,
        'mount': startExperience,
        'cedar': startExperience,
        'tyre beach': startExperience,
        'enter': startExperience,
        'go': startExperience,
        'purchase': startPurchase,

        'temple': () => {
          if (this._is(STATE_WISHLIST, STATE_PACKAGES)) {
            this._navigate(STATE_PURCHASE);
          }
        },

        'confirm': () => {
            this._emit('state-command', { command:  COMMAND_CONFIRM });
        },

        '(go) back': goBack,
        'home': goBack,
        'return': goBack
      };
    }
  });
}()
