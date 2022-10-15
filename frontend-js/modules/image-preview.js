export default class ImagePreview {
  constructor() {
    this.form = document.getElementById('change-profile-photo-form');
    this.parent_containers = this.form.querySelectorAll('#mobile-container, #desktop-container');
    this.events();
  }

  events() {
    this.parent_containers.forEach(parent_elem => {
      parent_elem.addEventListener('change', e => this.previewImage(e, parent_elem));
    });
  }

  previewImage(e, parent_elem) {
    const src = URL.createObjectURL(e.target.files[0]);
    const img = parent_elem.querySelector('img');
    img.src = src;
  }
}
