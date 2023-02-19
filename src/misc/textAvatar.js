class TextAvatar {
  constructor(text) {
    this.text = text;
    this.backgroundColor = this.generateBackgroundColor();
  }

  generateBackgroundColor() {
    let hash = 0;
    for (let i = 0; i < this.text.length; i++) {
      hash = this.text.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = hash % 360;
    return `hsl(${hue}, 70%, 60%)`;
  }

  toString() {
    const initials = this.text
      .split(' ')
      .map(word => word[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    const textColor = this.getContrastingColor(this.backgroundColor);

    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128">
      <rect x="0" y="0" width="128" height="128" rx="50%" fill="${this.backgroundColor}" />
      <text x="50%" y="50%" text-anchor="middle" fill="${textColor}" font-size="36">${initials}</text>
    </svg>
  `;
  }

  getContrastingColor(color) {
    const [hue, saturation, lightness] = color
      .substring(4, color.length - 1)
      .split(',')
      .map(value => parseFloat(value));

    if (lightness > 50) {
      return 'black';
    } else {
      return 'white';
    }
  }
}

module.exports = {
  TextAvatar,
};
