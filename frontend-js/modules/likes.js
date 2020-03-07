const axios = require("axios");
export default class Likes {
  constructor() {
    this.likesButton = document.querySelector("#likes-button");
    this.likesContainer = document.querySelector("#likes-container");
    this.likesButtonSVG = document.querySelectorAll("#like-button-svg");
    this.likeWordContainer = document.querySelector("#like-word");
    this.events();
  }

  // EVENTS
  events() {
    this.likesButton.addEventListener("click", () => this.handleButtonClick());
  }

  // METHODS
  handleButtonClick() {
    let like = 0;
    let color = "";
    if (this.likesButton.classList.contains("yes")) {
      like = 1;
      color = "yes";
      
      this.likeWordContainer.style.color = "#3182ce";
      Array.prototype.forEach.call(this.likesButtonSVG, svg => {
        svg.style.fill = "#3182ce";
      });
    } else {
      like = -1;
      color = "no";
      
      this.likeWordContainer.style.color = "black";
      Array.prototype.forEach.call(this.likesButtonSVG, svg => {
        svg.style.fill = "white";
      });
    }
    console.log("like value: " + like);
    axios
      .post("/likes", { like: like, color: color })
      .then(response => {
        this.likesContainer.innerHTML = response.data[0].totalLikes;
        this.likesButton.classList.add(`${response.data[0].color}`)
        console.log(response.data[0]);
      })
      .catch(err => {
        console.log(err);
      });
  }
}
