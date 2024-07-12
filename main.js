const API_KEY = "391ef86b614f41ef954d2891f97dcc27"
let newsList = [];
let errorMessage = '데이터가 없습니다';
const buildURL = (category = '', keyword = '') => {
  const url = new URL(`https://monumental-eclair-c31282.netlify.app/top-headlines?country=kr`);
  if (category) {
    url.searchParams.append('category', category);
  }
  if (keyword) {
    url.searchParams.append('q', keyword);
  }
  return url.toString();
};

const getLatestNews = async (category = '', keyword = '') => {
  const url = buildURL(category, keyword);
  console.log('Request URL:', url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('네트워크 응답이 올바르지 않습니다.');
    }
    const data = await response.json();
    console.log('Received data:', data.articles);
    newsList = data.articles;
    render();
  } catch (error) {
    if (error.response) {
      console.log(error)
      errorMessage = '에러가 발생했습니다';
      switch (error.response.status) {
        case 400:
          errorMessage = '잘못된 요청입니다 (400)';
          break;
        case 401:
          errorMessage = '인증이 필요합니다 (401)';
          break;
        case 402:
          errorMessage = '결제가 필요합니다 (402)';
          break;
        case 404:
          errorMessage = '데이터를 못 받아왔습니다 (404)';
          break;
        default:
          errorMessage = '네트워크 응답이 올바르지 않습니다.';
          break;
      }
    } else {
      errorMessage = '데이터를 못 받아왔습니다';
    }
    render(errorMessage);
  }
};

const render = (customErrorMessage = '') => {
  const maxLength = 200;
  let newsHTML = '';

  if (newsList.length === 0) {
    newsHTML = `
      <div id="alert" class="alert alert-warning alert-dismissible fade show" role="alert">
      ${customErrorMessage || errorMessage}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
  } else {
    newsHTML = newsList.map(news => {
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
        <div class="col-lg-8">
          <h2>${news.title}</h2>
          <p>${description}</p>
          <div>${sourceName ? `${sourceName} *` : "no source"} ${moment(news.publishedAt).fromNow()}</div>
        </div>
      </div>`;
    }).join('');
  }

  document.getElementById("news-board").innerHTML = newsHTML;
};
getLatestNews();

document.querySelector('.search-icon').addEventListener('click', function () {
  const searchBox = document.querySelector('.search-box');
  searchBox.classList.toggle('visible');
});

const categoryBtns = document.querySelectorAll('.category-btn');
categoryBtns.forEach(btn => {
  btn.addEventListener('click', function (event) {
    event.preventDefault(); // 기본 동작 방지
    const category = this.getAttribute('data-category');
    getLatestNews(category);
  });
});

function toggleSidebar() {
  var sidebar = document.querySelector('.sidenav');
  sidebar.classList.toggle('selected');
}

const search = () => {
  const keyword = document.getElementById('search-input').value.trim();
  if (keyword) {
    getLatestNews('', keyword);
  }
}

document.getElementById('search-button').addEventListener('click', search);

document.getElementById('search-input').addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    search();
  }
});