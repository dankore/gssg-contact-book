export default class ToggleMobileMenu {
  constructor() {
    this.openMobileMenu = document.getElementById('open-mobile-menu');
    this.closeMobileMenu = document.getElementById('close-mobile-menu');
    this.mobileMenuContainer = document.getElementById('mobile-menu-container');
    this.attachEventListeners();
  }

  attachEventListeners() {
    this.openMobileMenu.addEventListener('click', this.toggleMenu.bind(this));
    this.closeMobileMenu.addEventListener('click', this.toggleMenu.bind(this));
  }

  toggleMenu() {
    this.mobileMenuContainer.classList.toggle('hidden');
  }
}
