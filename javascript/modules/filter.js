class Filter {
  #filterIconContainer = null;
  #formContainer = null;

  constructor() {
    this.#filterIconContainer = document.querySelector('#filter-icon-container');
    this.#formContainer = document.querySelector('#form-container');
    this.attachEventListeners();
  }

  attachEventListeners() {
    this.#filterIconContainer.addEventListener('click', () => this.handleFilterIcon());
  }

  handleFilterIcon() {
    if (this.#formContainer.style.display === 'none') {
      this.#formContainer.style.display = 'block';
      this.#filterIconContainer.classList.add('top-bar');
    } else {
      this.#filterIconContainer.classList.remove('top-bar');
      this.#formContainer.style.display = 'none';
    }
  }
}

export default Filter;
