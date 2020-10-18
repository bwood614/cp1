document.getElementById("searchForm").addEventListener("submit", function(event) {
  event.preventDefault();
  document.getElementById("graphContainer").textContent = ""; //clear previous results
  //get search query
  const queryString = document.getElementById("searchBar").value;
  const queryArray = parseSearchQuery(queryString);
  let urls = [];
  for (let word of queryArray) {
    let url = "https://api.scripture.api.bible/v1/bibles/de4e12af7f28f599-01/search?query=";
    url += word;
    url += "&range=mat-rev&fuzziness=0";
    urls.push(url)
  }

  if (document.getElementById("option2").checked) {
    loadResults(urls);
  }
});

function loadResults(urls) {
  let dataRequests = [];

  urls.forEach((url) => {
    dataRequests.push(getResults(url));
  });

  Promise.all(dataRequests).then((allData)=>{
    plotData(allData);
  });
}

function getResults(url) {
  return new Promise((resolve, reject) => {
    fetch(url, apiAuthenticationHeader)
      .then(function(response) {
        return response.json();
      }).then(function(json) {
        resolve({word: json.data.query, count: json.data.total});
      });
  });
}

function plotData(resultArray) {
  let data = [];
  let trace = {
    x: [],
    y: [],
    name: 'New Testament',
    type: 'bar'
  };
  for (let result of resultArray) {
    trace.x.push(result.word);
    trace.y.push(result.count);
  }
  data.push(trace);
  console.log(data);
  Plotly.newPlot('graphContainer', data);
}

function parseSearchQuery(query) {
  query = query.replace(/\s+/g, ''); //remove whitespace
  let queryArray = query.split(','); //parse into array
  return queryArray;
}
