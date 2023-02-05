export default class ImagePreview {
  constructor() {
    this.form = document.getElementById('change-profile-photo-form');
    this.parentContainers = this.form.querySelectorAll('#mobile-container, #desktop-container');
    this.initEvents();
  }

  initEvents() {
    this.parentContainers.forEach(parentContainer => {
      parentContainer.addEventListener('change', event => this.handlePreviewImage(event, parentContainer));
    });
  }

  handlePreviewImage(event, parentContainer) {
    const src = URL.createObjectURL(event.target.files[0]);
    const img = parentContainer.querySelector('img');
    img.src = src;
  }
}
