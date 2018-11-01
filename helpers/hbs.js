
const moment = require('moment');

module.exports = {

  truncate: function(string, chars) {
    if (string.length > 0 && string.length > chars) {
      let newString = string.substr(0, chars);
      return `${newString}....`;
    }
    return string;
  },

  stripTags: function(input) {
    // return input.replace(/(<([^>]+)>)/igm, '');
    return input.replace(/<(?:.|\n)*?>/gm, '');
  },

  formatDate: function(date, format) {
    return moment(date).format(format);
  },

  editIcon: function(storyUserId, loggedUserId, storyId) {
    if (storyUserId == loggedUserId) {
      return `
        <a class="dashboard-icon-link" href="/api/users/me"><i class="fa fa-user"></i></a>
        <a class="edit-user-link edit-link" href="/api/stories/edit/${storyId}">Edit</a>
      `;
    } else {
      return '';
    }
  },

  editDeleteIcon: function(storyUserId, loggedUserId, storyId) {
    if (storyUserId == loggedUserId) {
      return `
        <a href="/api/stories/edit/${storyId}">Edit</a>
        <form id="d-form" class="delete-form" action="/api/stories/${storyId}?_method=DELETE" method="POST">
          <input type="hidden" name="_method" value="DELETE">
          <button class="delete-btn" type="button">
            <div>
              <svg viewBox="0 0 535.5 640.47">
                <g>
                  <path class="x-path" d="M485.5,50V421.43H365.76c-43.48,0-84.8,17-116.34,48L181.54,536l0-5.76c-.46-60-48.38-108.76-106.82-108.76H50V50H485.5M499.78,0H35.72C16,0,0,19.2,0,42.89V428.55c0,23.68,16,42.88,35.72,42.88h39c31.2,0,56.57,26.4,56.82,59.14l.58,75.86c0,7.7.11,29.07,6.15,31.64l.1,0a8.94,8.94,0,0,1,2.15,1.36,4.12,4.12,0,0,0,2.77,1c5.85,0,14.46-10.16,19.29-15.69.68-.79,1.39-1.54,2.13-2.26L284.42,505.1a116.18,116.18,0,0,1,81.34-33.67h134c19.73,0,35.72-19.2,35.72-42.88V42.89C535.5,19.2,519.51,0,499.78,0Z"/>
                  <path class="x-path" d="M361.15,308.81a18.28,18.28,0,1,1-25.86,25.84L267.5,266.9l-67.81,67.75a18.27,18.27,0,1,1-25.84-25.84l67.79-67.75L173.85,173.3a18.27,18.27,0,1,1,25.84-25.84l67.81,67.76,67.79-67.76a18.28,18.28,0,1,1,25.86,25.84l-67.8,67.76Z"/>
                </g>
              </svg>
              <span>Delete Your Story!</span>
            </div>
          </button>
        </form>
      `
    } else {
      return '';
    }
  },

  username: function(storyUserId, loggedUserId, storyUsername) {
    if (storyUserId != loggedUserId) {
      return `
        <a class="edit-user-link" href="/api/users/${storyUserId}"><span>${storyUsername}</span></a>
      `;
    } else {
      return '';
    }
  },

  showProfileOrDashboard: function(storyUserId, loggedUser, storyUsername) {
    if (storyUserId == loggedUser) {
      return `
        <a class="edit-user-link" href="/api/users/me"><span>${storyUsername}</span></a>
      `;
    } else {
      return `
        <a class="edit-user-link" href="/api/users/${storyUserId}"><span>${storyUsername}</span></a>
      `;
    }
  }
}