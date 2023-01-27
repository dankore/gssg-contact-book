import ToggleProfile from './modules/toggleProfile';
import ToggleEditPage from './modules/toggleEditPage';
import ToggleImage from './modules/show_bigger_profile_image';
import ConfirmDelete from './modules/confirmDelete';
import RegistrationFormLiveValidation from './modules/registrationFormLiveValidation';
import Filter from './modules/filter';
import ShowAllComments from './modules/comments-show-all';
import ClickToComment from './modules/clickToComment';
import AddComment from './modules/addComments';
import ToggleMobileMenu from './modules/toggleMobileMenu';
import ImagePreview from './modules/image-preview';
import ImageZoom from './modules/image-zoom';

document.querySelector('#more-profile-btn') && new ToggleProfile();
document.querySelector('#btn-optional-fields') && new ToggleEditPage();
document.querySelector('#profile-image') && new ToggleImage();
document.querySelector('#delete-profile') && new ConfirmDelete();
document.querySelector('#registration-form') && new RegistrationFormLiveValidation();
document.querySelector('#registration-form') && new RegistrationFormLiveValidation();
document.querySelector('#filter-icon-container') && new Filter();
document.querySelector('#show-all-comments-toggle') && new ShowAllComments();
document.getElementById('click-to-comment') && new ClickToComment();
document.getElementById('add-comment-button') && new AddComment();
document.getElementById('open-mobile-menu') && new ToggleMobileMenu();
document.getElementById('change-profile-photo-form') && new ImagePreview();

if (document.getElementById('preview-button')) {
  document.getElementById('preview-button').addEventListener('click', event => {
    event.preventDefault();
    new ImageZoom(event.target.dataset.image);
  });
}
