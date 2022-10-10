const axios = require('axios');

export default class AddComments {
  constructor() {
    this.input = document.querySelector('#input-comment');
    this.userComment = '';
    this.commentsContainerUl = document.querySelector('#comment-container-ul');
    this.commentsCount = document.querySelector('#comment-count');
    this.commentWordContainer = document.querySelector('#comment-word');
    this.commentsSection = document.querySelector('#comments-section');
    this.modalOverlay = document.querySelector('.modal-overlay');
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

    axios
      .post('/edit-comment', {
        commentId: inputEditContainer.getAttribute('data-comment-id'),
        comment: inputEditContainer.value,
        profileEmail: e.target.getAttribute('data-profile-email'),
      })
      .then(res => {
        commentContainerServerSide.innerText = res.data.comment;
        timesStampContainerServerSide.innerText = res.data.commentDate;
      })
      .catch(_ => {
        console.log('Error updating comment.');
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
        .then(response => {
          if (response.status === 200) e.target.parentElement.parentElement.parentElement.parentElement.remove();
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  handleAddCommentClick(e) {
    // IF INPUT BOX IS EMPTY, DO NOT SAVE
    if (!this.userComment) return;

    // SEND DATA TO DB
    axios
      .post('/add-comment', { comment: this.userComment, visitorEmail: e.target.getAttribute('data-visitor-email'), contactEmail: e.target.getAttribute('data-contact-email') })
      .then(res => {
        // INSERT INTO DOM
        this.commentsContainerUl.insertAdjacentHTML('afterbegin', this.commentHtml(res.data, e));

        this.input.value = '';
        this.input.focus();
      })
      .catch(err => {
        console.log(err);
      });
  }

  commentHtml({ commentId, comment, profileEmail, visitorUsername, visitorFirstName, commentDate }, e) {
    return `<li id="li-comment">
            <div class="flex space-x-3">
              <p class="flex-shrink-0">
                <img s src="/images-dev/${e.target.getAttribute('data-visitor-id')}" class="w-8 h-8 rounded-full" alt="${visitorFirstName}" />
              </p>

              <div>
                <div class="text-sm">
                  <a href="/contacts/${visitorUsername}" class="font-medium text-gray-900">${visitorFirstName}</a>
                </div>
                <div class="mt-1 text-sm text-gray-700">
                  <p class="comment break-all">${comment}</p>
                </div>
                <div class="mt-2 space-x-2 text-sm">
                  <datetime datetime="${commentDate}" class="comment-date-time font-medium text-gray-500">${commentDate}</datetime>

                  <span class="font-medium text-gray-500">&middot;</span>
                  <button id="edit-comment-button" class="font-medium text-gray-900">Edit</button>
                  <button id="delete-comment-button" data-comment-id="${commentId}" data-profile-email="${profileEmail}" class="font-medium text-red-600">Delete</button>
                </div>
              </div>
            </div>

            <div class="edit-comment-parent modal shadow-2xl" style="display: none">
              <textarea id="input-comment" data-comment-id="${commentId}" class="w-full p-2 border border-green-400 rounded" style="background-color: #f2f3f5; white-space: pre-wrap; overflow: hidden">${comment}</textarea>
              <div class="flex justify-between py-4">
                <button id="cancel-comment-button" class="bg-green-600 text-white px-2 rounded hover:bg-green-800">Cancel</button>
                <button data-comment-id="${commentId}" data-profile-email="${profileEmail}" id="update-comment-button" class="bg-green-600 text-white px-2 rounded hover:bg-green-800">Update</button>
              </div>
            </div>
        </li>`;
  }
  // END CLASS
}
