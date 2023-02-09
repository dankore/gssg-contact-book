export default class FlashMessage {
  static success(message) {
    const flashContainer = document.createElement('div');
    flashContainer.className = 'bg-primary-700 border border-primary-400 text-white text-center font-semibold px-4 py-3 rounded';
    flashContainer.textContent = message;
    document.body.appendChild(flashContainer);
  }

  static error(message) {
    const flashContainer = document.createElement('div');
    flashContainer.className = 'bg-red-100 border border-red-400 text-red-700 text-center px-4 py-3 flex justify-center items-center rounded';
    flashContainer.innerHTML = `
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-8 h-8">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <p class="ml-3">${message}</p>
    `;
    document.body.appendChild(flashContainer);
  }
}
