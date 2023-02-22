const target_level = document.querySelectorAll('.mega-menu__list--condensed .mega-menu__link--level-2');

target_level.forEach((el) => {
  el.addEventListener('click',(e) => {
    e.preventDefault();
    el.querySelector('svg').style.transform = 'rotate(180deg)';
    if(el.nextSibling.style.display !== 'block') {
      target_level.forEach((ele) => {
        if(ele.nextSibling) ele.nextSibling.style.display = 'none';
        ele.querySelector('svg').style.transform = 'rotate(0deg)';
      })
      el.nextSibling.style.display = 'block';
    } else {
      el.nextSibling.style.display = 'none';
      el.querySelector('svg').style.transform = 'rotate(0deg)';
    }
  })
})  