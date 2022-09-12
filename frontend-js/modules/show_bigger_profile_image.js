export default class ToggleImage {
  constructor() {
    this.profileImage = document.querySelector('#profile-image');
    this.closeImage = document.querySelector('#close-image');
    this.profileImageModal = document.querySelector('#profile-image-modal');
    this.events();
  }
  // EVENTS
  events() {
    this.profileImage.addEventListener('click', () => this.profileImageHandler());
    this.closeImage.addEventListener('click', () => this.closeImageHandler());
  }

  // METHODS
  profileImageHandler() {
    console.log('aaayy');
    this.profileImageModal.classList.toggle('hidden');
  }

  closeImageHandler() {
    console.log('close');
    this.profileImageModal.classList.toggle('hidden');
  }
}
