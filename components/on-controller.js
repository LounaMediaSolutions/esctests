/* global AFRAME, THREE */

!function() {
  AFRAME.registerComponent('on-controller', {
    multiple: true,

    schema: {
      controller: { type: 'selector' },
      property: { type: 'string', default: '' },
      value: { type: 'string' }
    },

    init() {
      this.data.controller.addEventListener('controllerconnected', () => {
        AFRAME.utils.entity.setComponentProperty(this.el, this.data.property, this.data.value);
        const raycaster = this.el.sceneEl.querySelector('[raycaster]');
        raycaster && raycaster.components.raycaster.refreshObjects();
      });
    }
  });
}();
