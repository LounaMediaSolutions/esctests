/* global AFRAME, THREE */

!function() {
    AFRAME.registerComponent('deep-visible', {
      schema: { default: true },

      update() {
        const newPosition = this.data
            ? { x: 0, y: 0, z: 0 }
            : { x:  9999, y: 9999, z: 9999};
        this.el.setAttribute('position', newPosition);

        // this.el.object3D.visible = this.data;

        // const oldClass = this.data ? 'not-clickable' : 'clickable';
        // const newClass = this.data ? 'clickable' : 'not-clickable';
        // Array.from(this.el.querySelectorAll(`[class~="${oldClass}"]`)).forEach(el => {
        //     el.classList.replace(oldClass, newClass);
        // })

        // this.raycaster = this.raycaster || this.el.sceneEl.querySelector('[raycaster]');
        // this.raycaster.components.raycaster.refreshObjects();
      }
    });
}();
