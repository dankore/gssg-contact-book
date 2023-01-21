export default class Filter {
  constructor() {
    this.filterIconContainer = document.querySelector("#filter-icon-container");
    this.formContainer = document.querySelector("#form-container");
    this.events();
  }
  // EVENTS
  events() {
    this.filterIconContainer.addEventListener("click", () =>
      this.handleFilterIcon()
    );
  }

  // METHODS
  handleFilterIcon() {
    if (this.formContainer.style.display == "none") {
      this.formContainer.style.display = "block";
      this.filterIconContainer.classList.add("top-bar");
    } else {
      this.filterIconContainer.classList.remove("top-bar");
      this.formContainer.style.display = "none";
    }
  }
}
