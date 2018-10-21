import '../sass/main.scss';

const UIheader = document.querySelector('header');
const UImenuIcon = document.querySelector('.lines');
const UIcontainer = document.querySelector('.container');

UImenuIcon.addEventListener('click', () => {
  UIheader.classList.toggle('show');
  UIcontainer.classList.toggle('clip-container');
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

if (document.querySelector('textarea'))
  CKEDITOR.replace('details');