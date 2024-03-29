const target_level = document.querySelectorAll('.sec_depth');

target_level.forEach((el) => {
  el.addEventListener('click',(e) => {
    e.preventDefault();
    if(el.nextSibling.style.display !== 'block') {
      target_level.forEach((ele) => {
        if(ele.nextSibling) ele.nextSibling.style.display = 'none';
        el.querySelector('svg').style.transform = 'rotate(180deg)';
      })
      el.nextSibling.style.display = 'block';
    } else {
      el.nextSibling.style.display = 'none';
      el.querySelector('svg').style.transform = 'rotate(0deg)';
    }
  })
})  