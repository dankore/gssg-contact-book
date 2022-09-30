const axios = require('axios');
export default class Likes {
  constructor() {
    this.likesButton = document.querySelector('#likes-button');
    this.visitorEmail = this.likesButton.getAttribute('data-visitor-email');
    this.visitorName = this.likesButton.getAttribute('data-visitor-name');
    this.contactEmail = this.likesButton.getAttribute('data-contact-email');
    this.likesContainer = document.querySelector('#likes-container');
    this.likeWordContainer = document.querySelector('#like-word');
    this.events();
  }

  // EVENTS
  events() {
    this.likesButton.addEventListener('click', e => this.handleButtonClick(e));
  }

  // METHODS
  handleButtonClick(e) {
    e.stopPropagation();
    let like = 0;
    let color = 'yes';
    if (this.likesButton.classList.contains('yes-toggle')) {
      like = -1;
      color = 'no';
      this.likesButton.classList.remove('yes-toggle');
      this.likesButton.classList.add('no-toggle');
      this.likeWordContainer.innerText = 'Like';

      const svgParent = e.target.parentElement.parentElement;
      const svg = svgParent.querySelector('.svg-container');
      svg.style.background = '#6B7280';

      const buttonSVG = e.target.querySelector('#like-button-svg');
      buttonSVG.style.fill = '#fff';
    } else {
      like = 1;
      color = 'yes';
      this.likesButton.classList.remove('no-toggle');
      this.likesButton.classList.add('yes-toggle');
      this.likeWordContainer.innerText = 'Unlike';

      const svgParent = e.target.parentElement.parentElement;
      const svg = svgParent.querySelector('.svg-container');
      svg.style.background = '#22c55e';

      const buttonSVG = e.target.querySelector('#like-button-svg');
      buttonSVG.style.fill = '#22c55e';
    }

    axios
      .post('/likes', { like, color, visitorEmail: this.visitorEmail, contactEmail: this.contactEmail, visitorName: this.visitorName })
      .then(_ => {
        axios
          .post('/get-visited-profile-doc')
          .then(res => {
            /**
             * GET THE NAMES OF PROFILES WHO LIKED THIS PROFILE
             * IF @COLOR == "YES" MEANS PROFILE CURRENTLY LIKES THIS PROFILE
             */

            let arrayOfNames = [];
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].color == 'yes') {
                arrayOfNames.push(res.data[i].visitorName);
              }
            }

            if (arrayOfNames.length < 1) {
              this.likesContainer.innerHTML = 'Be the first to like this contact';
            } else if (arrayOfNames.length == 1) {
              this.likesContainer.innerHTML = `Liked by ${arrayOfNames[0]}`;
            } else if (arrayOfNames.length == 2) {
              this.likesContainer.innerHTML = `Liked by ${arrayOfNames.slice(0, 1)} & ${arrayOfNames.slice(1).length} other`;
            } else {
              this.likesContainer.innerHTML = `Liked by ${arrayOfNames.slice(0, 1)} & ${arrayOfNames.slice(1).length} others`;
            }
          })

          .catch(err => {
            console.log(err);
          });
        /**
         * @this.likesContainer.innerHTML = response.data[0].totalLikes
         * is slower. Used this.likesContainer.textContent = +this.likesContainer.textContent + 1 /-1 instead;
         */
      })
      .catch(err => {
        console.log(err);
      });
  }
}
