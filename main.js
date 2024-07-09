const API_KEY = "391ef86b614f41ef954d2891f97dcc27"
let news = [];
const getLatestNews = async ()=>{
  
  const url = new URL(`https://monumental-eclair-c31282.netlify.app/top-headlines`);
  const response = await fetch(url).then(response => response.json()) 
  .then(data => {
    console.log(data.articles); 
  })
  .catch(error => {
    console.error('Error:', error); 
  });

}
getLatestNews();