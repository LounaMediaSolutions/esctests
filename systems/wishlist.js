!function(){
  AFRAME.registerSystem('wishlist', {
    init() {
      this.items = new Set();
    },

    add(item) {
      if (this.items.has(item)) return false;

      this.items.add(item);
      this.el.emit('wishlist-added', { item: item });
      return true;
    },

    remove(item) {
      if (!this.items.has(item)) return false;

      this.items.delete(item);
      this.el.emit('wishlist-removed', { item: item });
      return true;
    },

    has(item) {
      return this.items.has(item);
    },

    itemCount() {
      return this.items.size;
    }
  });
}();
