

$.ajax({
    url: '/search?type=article&q=dress',
    type: 'GET',
    dataType: 'html',
  }).done((info) => {
    const content = $(info).find('.article-card > .card__content');
    console.log(Object.values(content)[0])
    console.log(Object.values(content)[1])  

    for (const value of Object.values(content)) {
      console.log(value);
      $('.article_get').append(content.html()); 
    }
  });