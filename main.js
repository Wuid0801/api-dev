const API_KEY = "391ef86b614f41ef954d2891f97dcc27";
let newsList = [];
let errorMessage = '데이터가 없습니다';

let totalResults = 0;
let page = 1;
let pageSize = 10;
let groupSize = 5;
let category = ''; 
let keyword = ''; 

const buildURL = (category = '', keyword = '', page = '', pageSize = '') => {
  const url = new URL(`https://monumental-eclair-c31282.netlify.app/top-headlines?country=kr`);
  if (category) {
    url.searchParams.append('category', category);
  }
  if (keyword) {
    url.searchParams.append('q', keyword);
  }
  if (page) {
    url.searchParams.set("page", page);
  }
  if (pageSize) {
    url.searchParams.set("pageSize", pageSize);
  }
  return url.toString();
};

const getLatestNews = async () => {
  const url = buildURL(category, keyword, page, pageSize);
  console.log('Request URL:', url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('네트워크 응답이 올바르지 않습니다.');
    }
    const data = await response.json();
    console.log('Received data:', data);
    newsList = data.articles;
    totalResults = data.totalResults;
    render();
    paginationRender();
  } catch (error) {
    if (error.response) {
      console.log(error);
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
    category = this.getAttribute('data-category'); // 전역 변수에 할당
    keyword = ''; // 카테고리 버튼을 누르면 keyword 초기화
    page = 1; 
    getLatestNews();
  });
});

function toggleSidebar() {
  var sidebar = document.querySelector('.sidenav');
  sidebar.classList.toggle('selected');
}

const search = () => {
  keyword = document.getElementById('search-input').value.trim(); // 전역 변수에 할당
  if (keyword) {
    category = ''; // 검색을 하면 category 초기화
    page = 1; 
    getLatestNews();
  }
};

document.getElementById('search-button').addEventListener('click', search);

document.getElementById('search-input').addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    search();
  }
});

// Pagination
const paginationRender = () => {
//totalResult, page, pageSize, groupSize, pageGroup, lastPage, totalPage, firstPage
  const totalPage = Math.ceil(totalResults / pageSize);
  const pageGroup = Math.ceil(page / groupSize);
  const lastPage = Math.min(pageGroup * groupSize, totalPage);
  const firstPage = Math.max(lastPage - (groupSize - 1), 1);
  const displayPages = (totalPage <= 5) ? 3 : 5;
  let paginationHTML = '';
  if (page > 1) {
    paginationHTML += `<li class="page-item" onClick="moveToPage(1)"><a class="page-link" aria-label="First">&laquo;</a></li>`;
    paginationHTML += `<li class="page-item" onClick="moveToPage(${page - 1})"><a class="page-link" aria-label="Previous">&lt;</a></li>`;
  }

  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item ${i === page ? 'active' : ''}" onClick="moveToPage(${i})"><a class="page-link">${i}</a></li>`;
  }

  if (page < totalPage) {
    paginationHTML += `<li class="page-item" onClick="moveToPage(${page + 1})"><a class="page-link" aria-label="Next">&gt;</a></li>`;
    paginationHTML += `<li class="page-item" onClick="moveToPage(${totalPage})"><a class="page-link" aria-label="Last">&raquo;</a></li>`;
  }
  document.querySelector(".pagination").innerHTML = paginationHTML;
};

const moveToPage = (pageNum) => {
  page = pageNum;
  getLatestNews();
};

//   <nav aria-label="Page navigation example">
  //   <ul class="pagination">
  //     <li class="page-item">
  //       <a class="page-link" href="#" aria-label="Previous">
  //         <span aria-hidden="true">&laquo;</span>
  //       </a>
  //     </li>
  //     <li class="page-item"><a class="page-link" href="#">1</a></li>
  //     <li class="page-item"><a class="page-link" href="#">2</a></li>
  //     <li class="page-item"><a class="page-link" href="#">3</a></li>
  //     <li class="page-item">
  //       <a class="page-link" href="#" aria-label="Next">
  //         <span aria-hidden="true">&raquo;</span>
  //       </a>
  //     </li>
  //   </ul>
  // </nav>

  const Api_Key = 'KMGHDGTtYyp8ZQ6PslEt0FGSzsPPNayDVL8SfwGe9yZtqZFk5BMQ9U8763MgRzvc5QykfH9fxyf1ZovtRuDkyQ%3D%3D';
const url = new URL(`https://monumental-eclair-c31282.netlify.app/1400000/service/cultureInfoService2/mntInfoOpenAPI`);

const getLatestNews2 = async () => {
    url.searchParams.append('ServiceKey', Api_Key);
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.log('Error fetching the API:', error);
    }
};

getLatestNews2();
