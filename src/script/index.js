import '../sass/main.scss';

const UIheader = document.querySelector('header');
const UImenuIcon = document.querySelector('.lines');
const UIcontainer = document.querySelector('.container');
const UIregLog = document.querySelector('.reg-log');
const UIfooter = document.querySelector('footer');

UImenuIcon.addEventListener('click', () => {
  UIheader.classList.toggle('show');
  UIcontainer.classList.toggle('clip-container');
  UIregLog.classList.toggle('clip-reg-log');
  UIfooter.classList.toggle('clip-footer');
});

if (document.querySelector('.display-error')) {
  const UIdivError = document.querySelector('.display-error');
  setTimeout(() => {
    UIdivError.classList.add('slide-error');
  }, 500);
  setTimeout(() => {
    UIdivError.classList.add('hide-error');
  }, 5000);
}



const UIalert = document.querySelector('.alert');

console.log('hello');
UIalert.addEventListener('click', (e) => {
  if (e.target.classList.contains('x-alert') ||
      e.target.parentElement.classList.contains('x-alert') ||
      e.target.classList.contains('yes-btn') ||  
      e.target.classList.contains('no-btn')
    ) {
    UIalert.classList.remove('show-alert');
  }

});


if (document.querySelector('.delete-form')) {
  const UIalert = document.querySelector('.alert');
  document.addEventListener('click', (e) => {
    if ( e.target.classList.contains('delete-btn') ||
          e.target.classList.contains('x-path') ||
         e.target.parentElement.classList.contains('delete-btn') ||  
         e.target.parentElement.parentElement.classList.contains('delete-btn') 
       )  
          UIalert.classList.add('show-alert');
  });
}
if (document.querySelector('.leave-comment')) {
  const UIleaveComment = document.querySelector('.leave-comment');
  const UIcommentForm = document.querySelector('.story-comment-form');
  const UIarrowDown = document.querySelector('.arrow-down');
  const UIarrowUp = document.querySelector('.arrow-up');

  UIleaveComment.addEventListener('click', () => {
    UIcommentForm.classList.toggle('show-comment-form');
    UIarrowDown.classList.toggle('hide');
    UIarrowUp.classList.toggle('show');
  });
}



if (document.querySelector('textarea')) {
  CKEDITOR.replace('details');
}