import AddComment from './modules/addComments';
import DeleteAccount from './modules/delete-account';
import Filter from './modules/filter';
import ImagePreview from './modules/image-preview';
import ImageZoom from './modules/image-zoom';
import RegistrationFormLiveValidation from './modules/registrationFormLiveValidation';
import ToggleMobileMenu from './modules/toggleMobileMenu';

const deleteAccount = document.querySelector('#delete-account-form');
if (deleteAccount) {
  new DeleteAccount();
}

const registrationForm = document.querySelector('#registration-form');
if (registrationForm) {
  new RegistrationFormLiveValidation();
}

const filterIconContainer = document.querySelector('#filter-icon-container');
if (filterIconContainer) {
  new Filter();
}

const addCommentButton = document.getElementById('add-comment-button');
if (addCommentButton) {
  new AddComment();
}

const openMobileMenu = document.getElementById('open-mobile-menu');
if (openMobileMenu) {
  new ToggleMobileMenu();
}

const changeProfilePhotoForm = document.getElementById('change-profile-photo-form');
if (changeProfilePhotoForm) {
  new ImagePreview();
}

const previewButton = document.getElementById('preview-button');

if (previewButton) {
  previewButton.addEventListener('click', event => {
    event.preventDefault();
    new ImageZoom(event.target.dataset.image);
  });
}
