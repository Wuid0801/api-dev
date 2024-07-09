const API_KEY = "391ef86b614f41ef954d2891f97dcc27"
let news = [];
const getLatestNews = async ()=>{
  
  const url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`);
  const response = await fetch(url);
  const data = response.json();
  news = data.articles;
  console.log("data:", news);
}
getLatestNews();