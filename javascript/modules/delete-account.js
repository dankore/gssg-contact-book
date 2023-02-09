import FlashMessage from './flash';

export default class DeleteAccount {
  constructor() {
    this.form = document.querySelector('#delete-account-form');
    this.deleteButton = document.querySelector('#delete-account');
    this.sessionUser = document.getElementById('session-user').value;
    this.bindEvents();
  }

  bindEvents() {
    this.deleteButton.addEventListener('click', event => {
      event.preventDefault();
      if (window.confirm('This action is not reversible. Are you sure you want to delete your account?')) {
        this.sendPostRequest();
      }
    });
  }

  async sendPostRequest() {
    try {
      const formData = new FormData(this.form);

      const response = await fetch(this.form.action, {
        method: 'POST',
        body: JSON.stringify({
          _csrf: formData.get('_csrf'),
          account_username: formData.get('account_username'),
        }),

        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to delete account.');
      }

      // Successful request
      window.location.href = '/';
    } catch (error) {
      // Error handling
      console.error(error);
      alert('Failed to delete account.');
    }
  }
}
