const API_KEY = "391ef86b614f41ef954d2891f97dcc27"
let newsList = [];
const getLatestNews = async (category = '') => {

  const url = new URL(`https://monumental-eclair-c31282.netlify.app/top-headlines`);
  url.searchParams.append('category', category);
  const response = await fetch(url).then(response => response.json())
    .then(data => {
      console.log(data.articles);
      newsList = data.articles;
    })
    .catch(error => {
      console.error('Error:', error);
    });
  render();
}

const render = () => {
  const maxLength = 200;


  const newsHTML = newsList.map(news => {
    let description = news.description || '내용없음';
    let imageUrl = news.urlToImage;
    let sourceName = news.source.name || 'no source';

    if (description.length > maxLength) {
      description = description.substring(0, maxLength) + '...';
    }

    return `<div class="row news">
      <div class="col-lg-4">
        <img class="new-img-size fixed-img img-fluid"
          src="${imageUrl}"
          alt="gom"
          onerror="this.onerror=null;this.src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU';"
        />
      </div>
      <div class="col-lg-8 ">
        <h2>${news.title}</h2>
        <p>${description}</p>
        <div>${sourceName ? `${sourceName} *` : "no source"} ${moment(news.publishedAt).fromNow()}</div>
      </div>
    </div>`;
  }).join('');

  document.getElementById("news-board").innerHTML = newsHTML
}
getLatestNews();

document.querySelector('.search-icon').addEventListener('click', function () {
  const searchBox = document.querySelector('.search-box');
  searchBox.classList.toggle('visible');
});

const categoryBtns = document.querySelectorAll('.category-btn');
categoryBtns.forEach(btn => {
  btn.addEventListener('click', function (event) {
    event.preventDefault(); // 기본 동작 방지
    const category = this.getAttribute('data-category'); // 클릭된 버튼의 카테고리 가져오기
    getLatestNews(category); // 해당 카테고리의 뉴스 가져오기
  });
});