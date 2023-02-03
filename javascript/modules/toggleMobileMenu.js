export default class ToggleMobileMenu {
  constructor() {
    this.open_monile_menu = document.getElementById('open-mobile-menu');
    this.close_monile_menu = document.getElementById('close-mobile-menu');
    this.mobile_menu_container = document.getElementById('mobile-menu-container');
    this.events();
  }

  events() {
    this.open_monile_menu.addEventListener('click', () => this.toggleMenu());
    this.close_monile_menu.addEventListener('click', () => this.toggleMenu());
  }

  toggleMenu() {
    this.mobile_menu_container.classList.toggle('hidden');
  }
}
