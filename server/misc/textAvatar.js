class TextAvatar {
  constructor(text) {
    this.text = text;
    this.color = this.generateColor();
  }

  generateColor() {
    let hash = 0;
    for (let i = 0; i < this.text.length; i++) {
      hash = this.text.charCodeAt(i) + ((hash << 5) - hash);
    }
    let hue = hash % 360;
    let color = '';
    if (hue >= 60 && hue <= 180) {
      color = 'hsl(' + hue + ', 40%, 80%)';
    } else {
      color = 'hsl(' + hue + ', 70%, 60%)';
    }

    return color;
  }

  toString() {
    return `<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128'>
        <text x='50%' y='50%' text-anchor='middle' fill='${this.color}' font-size='20'>
          ${this.text}
        </text>{' '}
      </svg>`;
  }
}

module.exports = {
  TextAvatar,
};
