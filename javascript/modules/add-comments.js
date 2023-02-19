const { TextAvatar } = require('../../src/misc/textAvatar');

export default class AddComments {
  constructor() {
    this.input = document.querySelector('#input-comment');
    this.userComment = '';
    this.commentsContainerUl = document.querySelector('#comment-container-ul');
    this.commentsCount = document.querySelector('#comment-count');
    this.commentWordContainer = document.querySelector('#comment-word');
    this.commentsSection = document.querySelector('#comments-section');
    this.modalOverlay = document.querySelector('.modal-overlay');
    this.is_dev_environment = document.getElementById('app-env').value == 'development';
    this.sessionUser = document.getElementById('session-user').value;
    this.events();
  }
  // EVENTS
  events() {
    // SHOW INPUT CONTENT IN TEXTAREA TAGS
    this.commentsSection.addEventListener('keyup', e => {
      e.target && 'input-comment' == e.target.id && this.handleInputkeyUp(e);
    });
    // HANDLES CLIENT/SERVER SIDES EVENTS I.E <LI> TAGS INJECTED INTO THE DOM DYNAMICALLY
    this.commentsSection.addEventListener('click', e => {
      e.target && 'add-comment-button' == e.target.id && this.handleAddCommentClick(e);
      e.target && 'delete-comment-button' == e.target.id && this.handleDeleteComment(e);
      e.target && 'edit-comment-button' == e.target.id && this.handleOpenCloseEditContainer(e);
      e.target && 'update-comment-button' == e.target.id && this.handleUpdateComment(e);
      e.target && 'cancel-comment-button' == e.target.id && this.handleCancelEditCommentConatiner(e);
    });

    // END EVENTS
  }

  // METHODS
  handleInputkeyUp(e) {
    e.target.style.height = '1px';
    e.target.style.height = 25 + e.target.scrollHeight + 'px';
    this.input.style.height = '1px';
    this.input.style.height = 25 + this.input.scrollHeight + 'px';

    // SET INPUT VALUE
    this.userComment = e.target.value;
  }

  handleCancelEditCommentConatiner(e) {
    const editParent = e.target.parentElement.parentElement.parentElement;
    const editCommentContainer = editParent.querySelector('.edit-comment-parent');

    this.modalOverlay.classList.remove('active');
    editCommentContainer.classList.remove('active');
    editCommentContainer.style.display = 'none';
  }

  handleOpenCloseEditContainer(e) {
    const editParent = e.target.parentElement.parentElement.parentElement.parentElement;
    const editCommentContainer = editParent.querySelector('.edit-comment-parent');
    const inputEditContainer = editParent.querySelector('#input-comment');

    // TOGGLE EDIT CONTAINER
    if (editCommentContainer.style.display == 'none') {
      editCommentContainer.style.display = 'block';

      this.modalOverlay.classList.add('active');
      editCommentContainer.classList.add('active');

      inputEditContainer.focus();
    } else {
      editCommentContainer.style.display = 'none';
    }
  }

  handleUpdateComment(e) {
    const editParent = e.target.parentElement.parentElement.parentElement;
    const inputEditContainer = editParent.querySelector('#input-comment');
    const editCommentContainer = editParent.querySelector('.edit-comment-parent');
    const timesStampContainerServerSide = editParent.querySelector('.comment-date-time');
    const commentContainerServerSide = editParent.querySelector('.comment');

    if (!inputEditContainer.value) return; // DIS-ALLOW EMPTY TEXT

    fetch('/edit-comment', {
      method: 'POST',
      body: JSON.stringify({
        commentId: inputEditContainer.getAttribute('data-comment-id'),
        comment: inputEditContainer.value,
        profileEmail: e.target.getAttribute('data-profile-email'),
      }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response)
      .then(async response => {
        if (response.ok) {
          const data = await response.json();
          commentContainerServerSide.innerText = data.comment;
          timesStampContainerServerSide.innerText = data.commentDate;
        } else {
          alert('Sorry, the comment was not updated. Please try again later.');
        }
      })
      .catch(err => {
        console.log('Error updating comment.', err);
      });

    this.modalOverlay.classList.remove('active');
    editParent.classList.remove('active');
    editCommentContainer.style.display = 'none';
  }

  handleDeleteComment(e) {
    if (confirm('Are you sure?')) {
      fetch('/delete-comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commentId: e.target.getAttribute('data-comment-id'),
          profileEmail: e.target.getAttribute('data-profile-email'),
        }),
      })
        .then(response => response)
        .then(response => {
          if (response.ok) {
            e.target.parentElement.parentElement.parentElement.parentElement.remove();
          } else {
            throw new Error(response.error);
          }
        })
        .catch(err => {
          console.error(err);
          alert('Sorry, the comment was not deleted. Please try again later.');
        });
    }
  }

  handleAddCommentClick(e) {
    // IF INPUT BOX IS EMPTY, DO NOT SAVE
    if (!this.userComment) return;

    fetch('/add-comment', {
      method: 'POST',
      body: JSON.stringify({ comment: this.userComment, visitorEmail: e.target.getAttribute('data-visitor-email'), contactEmail: e.target.getAttribute('data-contact-email') }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(responseData => responseData.json())
      .then(data => {
        if (data.error) {
          throw new Error(data.error.message);
        }

        this.commentsContainerUl.insertAdjacentHTML('afterbegin', this.commentHtml(data, e));
        this.input.value = '';
        this.input.focus();
      })
      .catch(error => {
        console.error(error.message);
      });
  }

  commentHtml({ commentId, comment, profileEmail, visitorUsername, visitorFirstName, commentDate }, e) {
    const session_user = JSON.parse(this.sessionUser);

    return `<li id="li-comment">
            <div class="flex space-x-3">
              <p class="flex-shrink-0">
                <img loading="lazy" src="${session_user.photo ? session_user.photo : `data:image/svg+xml;utf8,${encodeURIComponent(new TextAvatar(visitorFirstName).toString())}`}" class="h-8 w-8 rounded-full bg-white border border-red-300" alt="${visitorFirstName}" />
              </p>

              <div>
                <div class="text-sm">
                  <a href="/contacts/${visitorUsername}" class="font-medium text-gray-900">${visitorFirstName}</a>
                </div>
                <div class="mt-1 text-sm text-gray-700">
                  <p class="comment break-all">${comment}</p>
                </div>
                <div class="mt-2 space-x-2 text-sm">
                  <datetime datetime="${commentDate}" class="comment-date-time font-medium text-gray-600">${commentDate}</datetime>

                  <span class="font-medium text-gray-600">&middot;</span>
                  <button id="edit-comment-button" class="font-medium text-gray-900">Edit</button>
                  <button id="delete-comment-button" data-comment-id="${commentId}" data-profile-email="${profileEmail}" class="font-medium text-red-600">Delete</button>
                </div>
              </div>
            </div>

            <div class="edit-comment-parent modal shadow-2xl" style="display: none">
              <textarea id="input-comment" data-comment-id="${commentId}" class="w-full p-2 border border-primary-400 rounded" style="background-color: #f2f3f5; white-space: pre-wrap; overflow: hidden">${comment}</textarea>
              <div class="flex justify-between py-4">
                <button id="cancel-comment-button" class="bg-primary-700 text-white px-2 rounded hover:bg-primary-800">Cancel</button>
                <button data-comment-id="${commentId}" data-profile-email="${profileEmail}" id="update-comment-button" class="bg-primary-700 text-white px-2 rounded hover:bg-primary-800">Update</button>
              </div>
            </div>
        </li>`;
  }
  // END CLASS
}
