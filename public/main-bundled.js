!(function (e) {
  var t = {};
  function n(a) {
    if (t[a]) return t[a].exports;
    var i = (t[a] = { i: a, l: !1, exports: {} });
    return e[a].call(i.exports, i, i.exports, n), (i.l = !0), i.exports;
  }
  (n.m = e),
    (n.c = t),
    (n.d = function (e, t, a) {
      n.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: a });
    }),
    (n.r = function (e) {
      'undefined' != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }), Object.defineProperty(e, '__esModule', { value: !0 });
    }),
    (n.t = function (e, t) {
      if ((1 & t && (e = n(e)), 8 & t)) return e;
      if (4 & t && 'object' == typeof e && e && e.__esModule) return e;
      var a = Object.create(null);
      if ((n.r(a), Object.defineProperty(a, 'default', { enumerable: !0, value: e }), 2 & t && 'string' != typeof e))
        for (var i in e)
          n.d(
            a,
            i,
            function (t) {
              return e[t];
            }.bind(null, i)
          );
      return a;
    }),
    (n.n = function (e) {
      var t =
        e && e.__esModule
          ? function () {
              return e.default;
            }
          : function () {
              return e;
            };
      return n.d(t, 'a', t), t;
    }),
    (n.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }),
    (n.p = ''),
    n((n.s = 0));
})([
  function (e, t, n) {
    'use strict';
    function a(e, t) {
      for (var n = 0; n < t.length; n++) {
        var a = t[n];
        (a.enumerable = a.enumerable || !1), (a.configurable = !0), 'value' in a && (a.writable = !0), Object.defineProperty(e, a.key, a);
      }
    }
    n.r(t);
    var i = n(1).TextAvatar,
      r = (function () {
        function e() {
          !(function (e, t) {
            if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
          })(this, e),
            (this.input = document.querySelector('#input-comment')),
            (this.userComment = ''),
            (this.commentsContainerUl = document.querySelector('#comment-container-ul')),
            (this.commentsCount = document.querySelector('#comment-count')),
            (this.commentWordContainer = document.querySelector('#comment-word')),
            (this.commentsSection = document.querySelector('#comments-section')),
            (this.modalOverlay = document.querySelector('.modal-overlay')),
            (this.is_dev_environment = 'development' == document.getElementById('app-env').value),
            (this.sessionUser = document.getElementById('session-user').value),
            this.events();
        }
        var t, n, r;
        return (
          (t = e),
          (n = [
            {
              key: 'events',
              value: function () {
                var e = this;
                this.commentsSection.addEventListener('keyup', function (t) {
                  t.target && 'input-comment' == t.target.id && e.handleInputkeyUp(t);
                }),
                  this.commentsSection.addEventListener('click', function (t) {
                    t.target && 'add-comment-button' == t.target.id && e.handleAddCommentClick(t), t.target && 'delete-comment-button' == t.target.id && e.handleDeleteComment(t), t.target && 'edit-comment-button' == t.target.id && e.handleOpenCloseEditContainer(t), t.target && 'update-comment-button' == t.target.id && e.handleUpdateComment(t), t.target && 'cancel-comment-button' == t.target.id && e.handleCancelEditCommentConatiner(t);
                  });
              },
            },
            {
              key: 'handleInputkeyUp',
              value: function (e) {
                (e.target.style.height = '1px'), (e.target.style.height = 25 + e.target.scrollHeight + 'px'), (this.input.style.height = '1px'), (this.input.style.height = 25 + this.input.scrollHeight + 'px'), (this.userComment = e.target.value);
              },
            },
            {
              key: 'handleCancelEditCommentConatiner',
              value: function (e) {
                var t = e.target.parentElement.parentElement.parentElement.querySelector('.edit-comment-parent');
                this.modalOverlay.classList.remove('active'), t.classList.remove('active'), (t.style.display = 'none');
              },
            },
            {
              key: 'handleOpenCloseEditContainer',
              value: function (e) {
                var t = e.target.parentElement.parentElement.parentElement.parentElement,
                  n = t.querySelector('.edit-comment-parent'),
                  a = t.querySelector('#input-comment');
                'none' == n.style.display ? ((n.style.display = 'block'), this.modalOverlay.classList.add('active'), n.classList.add('active'), a.focus()) : (n.style.display = 'none');
              },
            },
            {
              key: 'handleUpdateComment',
              value: function (e) {
                var t = e.target.parentElement.parentElement.parentElement,
                  n = t.querySelector('#input-comment'),
                  a = t.querySelector('.edit-comment-parent'),
                  i = t.querySelector('.comment-date-time'),
                  r = t.querySelector('.comment');
                n.value &&
                  (fetch('/edit-comment', { method: 'POST', body: JSON.stringify({ commentId: n.getAttribute('data-comment-id'), comment: n.value, profileEmail: e.target.getAttribute('data-profile-email') }), headers: { 'Content-Type': 'application/json' } })
                    .then(function (e) {
                      return e.json();
                    })
                    .then(function (e) {
                      (r.innerText = e.comment), (i.innerText = e.commentDate);
                    })
                    .catch(function (e) {
                      console.log('Error updating comment.', e);
                    }),
                  this.modalOverlay.classList.remove('active'),
                  t.classList.remove('active'),
                  (a.style.display = 'none'));
              },
            },
            {
              key: 'handleDeleteComment',
              value: function (e) {
                confirm('Are you sure?') &&
                  fetch('/delete-comment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ commentId: e.target.getAttribute('data-comment-id'), profileEmail: e.target.getAttribute('data-profile-email') }) })
                    .then(function (t) {
                      200 === t.status && e.target.parentElement.parentElement.parentElement.parentElement.remove();
                    })
                    .catch(function (e) {
                      console.log(e);
                    });
              },
            },
            {
              key: 'handleAddCommentClick',
              value: function (e) {
                var t = this;
                this.userComment &&
                  fetch('/add-comment', { method: 'POST', body: JSON.stringify({ comment: this.userComment, visitorEmail: e.target.getAttribute('data-visitor-email'), contactEmail: e.target.getAttribute('data-contact-email') }), headers: { 'Content-Type': 'application/json' } })
                    .then(function (e) {
                      return e.json();
                    })
                    .then(function (n) {
                      t.commentsContainerUl.insertAdjacentHTML('afterbegin', t.commentHtml(n, e)), (t.input.value = ''), t.input.focus();
                    })
                    .catch(function (e) {
                      console.log(e);
                    });
              },
            },
            {
              key: 'commentHtml',
              value: function (e, t) {
                var n = e.commentId,
                  a = e.comment,
                  r = e.profileEmail,
                  o = e.visitorUsername,
                  s = e.visitorFirstName,
                  l = e.commentDate,
                  c = JSON.parse(this.sessionUser);
                return '<li id="li-comment">\n            <div class="flex space-x-3">\n              <p class="flex-shrink-0">\n                <img loading="lazy" src="'
                  .concat(c.photo ? c.photo : 'data:image/svg+xml;utf8,'.concat(encodeURIComponent(new i(s).toString())), '" class="h-8 w-8 rounded-full " alt="')
                  .concat(s, '" />\n              </p>\n\n              <div>\n                <div class="text-sm">\n                  <a href="/contacts/')
                  .concat(o, '" class="font-medium text-gray-900">')
                  .concat(s, '</a>\n                </div>\n                <div class="mt-1 text-sm text-gray-700">\n                  <p class="comment break-all">')
                  .concat(a, '</p>\n                </div>\n                <div class="mt-2 space-x-2 text-sm">\n                  <datetime datetime="')
                  .concat(l, '" class="comment-date-time font-medium text-gray-600">')
                  .concat(l, '</datetime>\n\n                  <span class="font-medium text-gray-600">&middot;</span>\n                  <button id="edit-comment-button" class="font-medium text-gray-900">Edit</button>\n                  <button id="delete-comment-button" data-comment-id="')
                  .concat(n, '" data-profile-email="')
                  .concat(r, '" class="font-medium text-red-600">Delete</button>\n                </div>\n              </div>\n            </div>\n\n            <div class="edit-comment-parent modal shadow-2xl" style="display: none">\n              <textarea id="input-comment" data-comment-id="')
                  .concat(n, '" class="w-full p-2 border border-primary-400 rounded" style="background-color: #f2f3f5; white-space: pre-wrap; overflow: hidden">')
                  .concat(a, '</textarea>\n              <div class="flex justify-between py-4">\n                <button id="cancel-comment-button" class="bg-primary-700 text-white px-2 rounded hover:bg-primary-800">Cancel</button>\n                <button data-comment-id="')
                  .concat(n, '" data-profile-email="')
                  .concat(r, '" id="update-comment-button" class="bg-primary-700 text-white px-2 rounded hover:bg-primary-800">Update</button>\n              </div>\n            </div>\n        </li>');
              },
            },
          ]) && a(t.prototype, n),
          r && a(t, r),
          e
        );
      })();
    function o(e, t) {
      for (var n = 0; n < t.length; n++) {
        var a = t[n];
        (a.enumerable = a.enumerable || !1), (a.configurable = !0), 'value' in a && (a.writable = !0), Object.defineProperty(e, a.key, a);
      }
    }
    function s(e, t) {
      var n = t.get(e);
      if (!n) throw new TypeError('attempted to get private field on non-instance');
      return n.get ? n.get.call(e) : n.value;
    }
    function l(e, t, n) {
      var a = t.get(e);
      if (!a) throw new TypeError('attempted to set private field on non-instance');
      if (a.set) a.set.call(e, n);
      else {
        if (!a.writable) throw new TypeError('attempted to set read only private field');
        a.value = n;
      }
      return n;
    }
    var c = new WeakMap(),
      m = new WeakMap(),
      u = (function () {
        function e() {
          !(function (e, t) {
            if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
          })(this, e),
            c.set(this, { writable: !0, value: null }),
            m.set(this, { writable: !0, value: null }),
            l(this, c, document.querySelector('#filter-icon-container')),
            l(this, m, document.querySelector('#form-container')),
            this.attachEventListeners();
        }
        var t, n, a;
        return (
          (t = e),
          (n = [
            {
              key: 'attachEventListeners',
              value: function () {
                var e = this;
                s(this, c).addEventListener('click', function () {
                  return e.handleFilterIcon();
                });
              },
            },
            {
              key: 'handleFilterIcon',
              value: function () {
                'none' === s(this, m).style.display ? ((s(this, m).style.display = 'block'), s(this, c).classList.add('top-bar')) : (s(this, c).classList.remove('top-bar'), (s(this, m).style.display = 'none'));
              },
            },
          ]) && o(t.prototype, n),
          a && o(t, a),
          e
        );
      })();
    function d(e, t) {
      for (var n = 0; n < t.length; n++) {
        var a = t[n];
        (a.enumerable = a.enumerable || !1), (a.configurable = !0), 'value' in a && (a.writable = !0), Object.defineProperty(e, a.key, a);
      }
    }
    var h = (function () {
      function e() {
        !(function (e, t) {
          if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
        })(this, e),
          (this.form = document.getElementById('change-profile-photo-form')),
          (this.parentContainers = this.form.querySelectorAll('#mobile-container, #desktop-container')),
          this.initEvents();
      }
      var t, n, a;
      return (
        (t = e),
        (n = [
          {
            key: 'initEvents',
            value: function () {
              var e = this;
              this.parentContainers.forEach(function (t) {
                t.addEventListener('change', function (n) {
                  return e.handlePreviewImage(n, t);
                });
              });
            },
          },
          {
            key: 'handlePreviewImage',
            value: function (e, t) {
              var n = URL.createObjectURL(e.target.files[0]);
              t.querySelector('img').src = n;
            },
          },
        ]) && d(t.prototype, n),
        a && d(t, a),
        e
      );
    })();
    function f(e, t) {
      for (var n = 0; n < t.length; n++) {
        var a = t[n];
        (a.enumerable = a.enumerable || !1), (a.configurable = !0), 'value' in a && (a.writable = !0), Object.defineProperty(e, a.key, a);
      }
    }
    var y = (function () {
      function e(t) {
        !(function (e, t) {
          if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
        })(this, e),
          (this.imageUrl = t),
          this.zoom();
      }
      var t, n, a;
      return (
        (t = e),
        (n = [
          {
            key: 'zoom',
            value: function () {
              var e = document.createElement('div');
              e.classList.add('relative', 'z-10');
              var t = document.createElement('div');
              t.classList.add('fixed', 'inset-0', 'bg-gray-500', 'bg-opacity-75', 'transition-opacity'), (t.id = 'dialog');
              var n = document.createElement('div');
              n.classList.add('fixed', 'inset-0', 'z-10', 'overflow-y-auto');
              var a = document.createElement('div');
              a.classList.add('flex', 'min-h-full', 'items-end', 'justify-center', 'p-4', 'text-center', 'sm:items-center', 'sm:p-0');
              var i = document.createElement('div');
              i.classList.add('relative', 'transform', 'overflow-hidden', 'rounded-lg', 'bg-white', 'px-4', 'pt-5', 'pb-4', 'text-left', 'shadow-xl', 'transition-all', 'sm:my-8', 'sm:w-full', 'sm:max-w-xl', 'sm:p-6'), (i.id = 'modal');
              var r = document.createElement('button');
              (r.id = 'btn-close-modal'), (r.type = 'button'), r.classList.add('inline-flex', 'w-full', 'justify-center', 'rounded-md', 'border', 'border-transparent', 'bg-secondary-600', 'px-4', 'py-2', 'text-base', 'font-medium', 'text-white', 'shadow-sm', 'hover:bg-secondary-700', 'focus:outline-none', 'focus:ring-2', 'focus:ring-secondary-500', 'focus:ring-offset-2', 'sm:text-sm'), (r.textContent = 'Close');
              var o = document.createElement('div');
              o.classList.add('mt-5', 'sm:mt-6'), o.appendChild(r);
              var s = document.createElement('img');
              s.classList.add('object-contain', 'z-50', 'mx-auto', 'rounded-full', 'h-56', 'w-56', 'bg-primary-700'),
                (s.src = this.imageUrl),
                i.appendChild(s),
                i.appendChild(o),
                a.appendChild(i),
                n.appendChild(a),
                e.appendChild(t),
                e.appendChild(n),
                document.body.appendChild(e),
                n.addEventListener('click', function (t) {
                  t.target !== s && e.remove();
                });
            },
          },
        ]) && f(t.prototype, n),
        a && f(t, a),
        e
      );
    })();
    function v(e, t) {
      for (var n = 0; n < t.length; n++) {
        var a = t[n];
        (a.enumerable = a.enumerable || !1), (a.configurable = !0), 'value' in a && (a.writable = !0), Object.defineProperty(e, a.key, a);
      }
    }
    var p = (function () {
      function e() {
        !(function (e, t) {
          if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
        })(this, e),
          (this.form = document.querySelector('#registration-form')),
          (this.allFields = document.querySelectorAll('#registration-form .form-control')),
          this.insertValidationElements(),
          (this.firstName = document.querySelector('#first-name')),
          (this.firstName.previousValue = ''),
          (this.lastName = document.querySelector('#last-name')),
          (this.lastName.previousValue = ''),
          (this.email = document.querySelector('#email')),
          (this.email.previousValue = ''),
          (this.email.isUnique = !1),
          (this.year = document.querySelector('#year')),
          (this.year.previousValue = ''),
          (this.password = document.querySelector('#password')),
          (this.password.previousValue = ''),
          this.events();
      }
      var t, n, a;
      return (
        (t = e),
        (n = [
          {
            key: 'events',
            value: function () {
              var e = this;
              this.form.addEventListener('submit', function (t) {
                t.preventDefault(), e.formSubmitHandler();
              }),
                this.firstName.addEventListener('keyup', function () {
                  e.isDifferent(e.firstName, e.firstNameHandler);
                }),
                this.lastName.addEventListener('keyup', function () {
                  e.isDifferent(e.lastName, e.lastNameHandler);
                }),
                this.email.addEventListener('keyup', function () {
                  e.isDifferent(e.email, e.emailHandler);
                }),
                this.year.addEventListener('keyup', function () {
                  e.isDifferent(e.year, e.yearHandler());
                }),
                this.password.addEventListener('keyup', function () {
                  e.isDifferent(e.password, e.passwordHandler);
                }),
                this.firstName.addEventListener('blur', function () {
                  e.isDifferent(e.firstName, e.firstNameHandler);
                }),
                this.lastName.addEventListener('blur', function () {
                  e.isDifferent(e.lastName, e.lastNameHandler);
                }),
                this.year.addEventListener('blur', function () {
                  e.isDifferent(e.year, e.yearHandler);
                }),
                this.email.addEventListener('blur', function () {
                  e.isDifferent(e.email, e.emailHandler);
                }),
                this.password.addEventListener('blur', function () {
                  e.isDifferent(e.password, e.passwordHandler);
                });
            },
          },
          {
            key: 'isDifferent',
            value: function (e, t) {
              t && e.previousValue != e.value && t.call(this), (e.previousValue = e.value);
            },
          },
          {
            key: 'hideValidationError',
            value: function (e) {
              e.nextElementSibling.classList.remove('liveValidationMessage--show');
            },
          },
          {
            key: 'showValidationError',
            value: function (e, t) {
              (e.nextElementSibling.innerText = t), e.nextElementSibling.classList.add('liveValidationMessage--show'), (e.errors = !0);
            },
          },
          {
            key: 'insertValidationElements',
            value: function () {
              this.allFields.forEach(function (e) {
                e.insertAdjacentHTML('afterend', '<div class="bg-red-100 border-red-400 border-l border-t border-r text-red-700 text-center text-xs rounded liveValidationMessage">ada</div>');
              });
            },
          },
          {
            key: 'formSubmitHandler',
            value: function () {
              this.firstNameImmediately(), this.firstNameAfterDelay(), this.lastNameImmediately(), this.lastNameAfterDelay(), this.emailAfterDelay(), this.yearImmediately(), this.yearAfterDelay(), this.passwordImmediately(), this.passwordAfterDelay(), this.firstName.errors || this.lastName.errors || !this.email.isUnique || this.email.errors || this.year.errors || this.password.errors || this.form.submit();
            },
          },
          {
            key: 'passwordHandler',
            value: function () {
              var e = this;
              (this.password.errors = !1),
                this.passwordImmediately(),
                clearTimeout(this.password.timer),
                (this.password.timer = setTimeout(function () {
                  return e.passwordAfterDelay();
                }, 1e3));
            },
          },
          {
            key: 'passwordImmediately',
            value: function () {
              this.password.value.length > 50 && this.showValidationError(this.password, 'Password cannot exceed 50 characters.'), this.password.errors || this.hideValidationError(this.password);
            },
          },
          {
            key: 'passwordAfterDelay',
            value: function () {
              this.password.value.length < 6 && this.showValidationError(this.password, 'Password must be at least 6 characters.');
            },
          },
          {
            key: 'emailHandler',
            value: function () {
              var e = this;
              (this.email.errors = !1),
                clearTimeout(this.email.timer),
                (this.email.timer = setTimeout(function () {
                  return e.emailAfterDelay();
                }, 1e3));
            },
          },
          {
            key: 'emailAfterDelay',
            value: function () {
              var e = this;
              this.isEmail(this.email.value) || this.showValidationError(this.email, 'You must provide a valid email address.'),
                this.email.errors ||
                  fetch('/doesEmailExist', { method: 'POST', body: JSON.stringify({ email: this.email.value }), headers: { 'Content-Type': 'application/json' } })
                    .then(function (e) {
                      return e.json();
                    })
                    .then(function (t) {
                      t ? ((e.email.isUnique = !1), e.showValidationError(e.email, 'That email is already being used.')) : ((e.email.isUnique = !0), e.hideValidationError(e.email));
                    })
                    .catch(function (e) {
                      console.log('Please try again later.', e);
                    });
            },
          },
          {
            key: 'isEmail',
            value: function (e) {
              return !!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(e);
            },
          },
          {
            key: 'firstNameHandler',
            value: function () {
              var e = this;
              (this.firstName.errors = !1),
                this.firstNameImmediately(),
                clearTimeout(this.firstName.timer),
                (this.firstName.timer = setTimeout(function () {
                  return e.firstNameAfterDelay();
                }, 1e3));
            },
          },
          {
            key: 'firstNameImmediately',
            value: function () {
              '' == this.firstName.value || /^[\w-]+$/.test(this.firstName.value) || this.showValidationError(this.firstName, 'First Name can only contain letters, numbers, dashes, and hyphens.'), this.firstName.value.length > 50 && this.showValidationError(this.firstName, 'First name cannot exceed 50 characters.'), this.firstName.errors || this.hideValidationError(this.firstName);
            },
          },
          {
            key: 'firstNameAfterDelay',
            value: function () {
              '' == this.firstName.value && this.showValidationError(this.firstName, 'First name cannot be empty.');
            },
          },
          {
            key: 'lastNameHandler',
            value: function () {
              var e = this;
              (this.lastName.errors = !1),
                this.lastNameImmediately(),
                clearTimeout(this.lastName.timer),
                (this.lastName.timer = setTimeout(function () {
                  return e.lastNameAfterDelay();
                }, 1e3));
            },
          },
          {
            key: 'lastNameImmediately',
            value: function () {
              '' == this.lastName.value || /^[\w-]+$/.test(this.lastName.value) || this.showValidationError(this.lastName, 'Last name can only contain letters, numbers, dashes, and hyphens.'), this.lastName.value.length > 50 && this.showValidationError(this.lastName, 'Last name cannot exceed 50 characters.'), this.lastName.errors || this.hideValidationError(this.lastName);
            },
          },
          {
            key: 'lastNameAfterDelay',
            value: function () {
              '' == this.lastName.value && this.showValidationError(this.lastName, 'Last name cannot be empty.');
            },
          },
          {
            key: 'yearHandler',
            value: function () {
              var e = this;
              (this.year.errors = !1),
                this.yearImmediately(),
                clearTimeout(this.year.timer),
                (this.year.timer = setTimeout(function () {
                  return e.yearAfterDelay();
                }, 1e3));
            },
          },
          {
            key: 'yearImmediately',
            value: function () {
              '' == this.year.value || /^[\d]+$/.test(this.year.value) || this.showValidationError(this.year, 'Year can only be numbers.'), this.year.value.length > 4 && this.showValidationError(this.year, 'Year cannot exceed 4 characters.'), this.year.errors || this.hideValidationError(this.year);
            },
          },
          {
            key: 'yearAfterDelay',
            value: function () {
              this.year.value.length < 4 && this.showValidationError(this.year, 'Year cannot be less than 4 characters.');
            },
          },
        ]) && v(t.prototype, n),
        a && v(t, a),
        e
      );
    })();
    function g(e, t) {
      for (var n = 0; n < t.length; n++) {
        var a = t[n];
        (a.enumerable = a.enumerable || !1), (a.configurable = !0), 'value' in a && (a.writable = !0), Object.defineProperty(e, a.key, a);
      }
    }
    var b = (function () {
      function e() {
        !(function (e, t) {
          if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
        })(this, e),
          (this.openMobileMenu = document.getElementById('open-mobile-menu')),
          (this.closeMobileMenu = document.getElementById('close-mobile-menu')),
          (this.mobileMenuContainer = document.getElementById('mobile-menu-container')),
          this.attachEventListeners();
      }
      var t, n, a;
      return (
        (t = e),
        (n = [
          {
            key: 'attachEventListeners',
            value: function () {
              this.openMobileMenu.addEventListener('click', this.toggleMenu.bind(this)), this.closeMobileMenu.addEventListener('click', this.toggleMenu.bind(this));
            },
          },
          {
            key: 'toggleMenu',
            value: function () {
              this.mobileMenuContainer.classList.toggle('hidden');
            },
          },
        ]) && g(t.prototype, n),
        a && g(t, a),
        e
      );
    })();
    document.querySelector('#registration-form') && new p(), document.querySelector('#filter-icon-container') && new u(), document.getElementById('add-comment-button') && new r(), document.getElementById('open-mobile-menu') && new b(), document.getElementById('change-profile-photo-form') && new h();
    var w = document.getElementById('preview-button');
    w &&
      w.addEventListener('click', function (e) {
        e.preventDefault(), new y(e.target.dataset.image);
      });
  },
  function (e, t) {
    function n(e, t) {
      for (var n = 0; n < t.length; n++) {
        var a = t[n];
        (a.enumerable = a.enumerable || !1), (a.configurable = !0), 'value' in a && (a.writable = !0), Object.defineProperty(e, a.key, a);
      }
    }
    var a = (function () {
      function e(t) {
        !(function (e, t) {
          if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
        })(this, e),
          (this.text = t),
          (this.color = this.generateColor());
      }
      var t, a, i;
      return (
        (t = e),
        (a = [
          {
            key: 'generateColor',
            value: function () {
              for (var e = 0, t = 0; t < this.text.length; t++) e = this.text.charCodeAt(t) + ((e << 5) - e);
              return 'hsl(' + (e % 360) + ', 70%, 60%)';
            },
          },
          {
            key: 'toString',
            value: function () {
              return '\n        <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128">\n          <text x="50%" y="50%" text-anchor="middle" fill="'.concat(this.color, '" font-size="36">').concat(this.text, '</text>\n        </svg>\n      ');
            },
          },
        ]) && n(t.prototype, a),
        i && n(t, i),
        e
      );
    })();
    e.exports = { TextAvatar: a };
  },
]);
