const target_level = document.querySelectorAll('.maga-menu-category .mega-menu__link--level-2');
console.log(target_level)
target_level[0].addEventListener('click',(e) => {
  e.preventDefault();
  console.log('it clicked!')
})