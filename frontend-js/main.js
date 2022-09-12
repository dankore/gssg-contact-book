import ToggleProfile from "./modules/toggleProfile";
import ToggleEditPage from "./modules/toggleEditPage";
import ToggleImage from "./modules/show_bigger_profile_image";
import ConfirmDelete from "./modules/confirmDelete";
import RegistrationFormLiveValidation from "./modules/registrationFormLiveValidation";
import Filter from "./modules/filter";
import ShowAllComments from "./modules/comments-show-all";
import Likes from "./modules/likes";
import ShowNames from "./modules/show-those-liked-a-profile";
import ClickToComment from "./modules/clickToComment";
import AddComment from "./modules/addComments";

document.querySelector("#more-profile-btn") && new ToggleProfile();
document.querySelector("#btn-optional-fields") && new ToggleEditPage();
document.querySelector("#profile-image") && new ToggleImage();
document.querySelector("#delete-profile") && new ConfirmDelete();
document.querySelector("#registration-form") &&
  new RegistrationFormLiveValidation();
document.querySelector("#registration-form") &&
  new RegistrationFormLiveValidation();
document.querySelector("#filter-icon-container") && new Filter();
document.querySelector("#show-all-comments-toggle") && new ShowAllComments();
document.querySelector("#likes-button") && new Likes();
document.querySelector("#likes-container") && new ShowNames();
document.getElementById("click-to-comment") && new ClickToComment();
document.getElementById("add-comment-button") && new AddComment();
