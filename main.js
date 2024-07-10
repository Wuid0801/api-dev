const API_KEY = "391ef86b614f41ef954d2891f97dcc27"
let newsList = [];
const getLatestNews = async () => {

  const url = new URL(`https://monumental-eclair-c31282.netlify.app/top-headlines`);
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
  const newsHTML = newsList.map(news => `<div class="row news">
    <div class="col-lg-4">
      <img class="new-img-size fixed-img img-fluid"
        src="${news.urlToImage}"
        alt="gom"
      />
    </div>
    <div class="col-lg-8 ">
      <h2>${news.title}</h2>
      <p>${news.description}</p>
      <div>${news.source.name} * ${news.publishedAt}</div>
    </div>
  </div>`).join('');

  document.getElementById("news-board").innerHTML = newsHTML
}
getLatestNews();