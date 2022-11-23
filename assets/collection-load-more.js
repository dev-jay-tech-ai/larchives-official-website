const products_on_page = $('.products-on-page');
let next_url = products_on_page.data('next-url');
const load_more = $('.load-more');
console.log(load_more)
load_more.addEventListener("click",(e) => {
  e.preventDefault(); 
  $.ajax({
    url: next_url,
    type: 'GET',
    dataType: 'html',
  }).done((next_page) => {
    const new_products = $(next_page).find('.products-on-page');
    const new_url = new_products.data('next-url');
    next_url = new_url;
    products_on_page.append(new_products.html());
  })
});