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

      console.log(formData.get('_csrf'));
      console.log(formData.get('account_username'));

      const response = await fetch(this.form.action, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to delete account.');
      }

      // Successful request
      console.log('Account deleted successfully.');
    } catch (error) {
      // Error handling
      console.error(error);
    }
  }
}
