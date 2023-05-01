let news =[];
let page = 1;
let total_pages = 0;

let menu = document.querySelectorAll(".menu botton");
menu.forEach((menu) => menu.addEventListener("click", (event)=> getNewsByTopic(event) ));

let searchButton = document.getElementById("search-button");
let url;

const getNews = async() => {

    try{
    let header = new Headers ({'x-api-key':'fmCHiG2MNSmdEXqItmabKvLXtHPJrsWGITMmNIiyQwQ'});
    
    url.searchParams.set('page', page); //&page=

    let response = await fetch(url,{headers:header});
    let data = await response.json();
    
        if(response.status == 200){
            if(data.total_hits == 0){
                throw new Error("Couldn't find your search");
            }

            news = data.articles;
            total_pages = data.total_pages;
            page = data.page;

            console.log(news);
            render();
            pagenation();
        }
        else {
            throw new Error(data.message);
        }

    } catch(error){
        console.log("catched error",error.message);
        errorRender(error.message);
    }
    
};

const getLatestNews = async() => {
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=US&page_size=10`);
    getNews();
    
};

const getNewsByTopic = async(event) =>{
    console.log(clicked, event.target.textContent);

    let topic = event.target.textContent.toLowerCase()

    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=US&page_size=10&topic=${topic}`);
    getNews();
}

const getNewsByKeyword = async () => {
        
    let keyword = document.getElementById("search-input").value;
    
    url = new URL (`http://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`);

    getNews();
}


const render = () =>{
    let newsHTML = "";

    newsHTML = news
        .map((news_item) => {
        return `
        <div class="row news">
            <div class="col-lg-4">
                <img class="news-img-size" src= "${news_item.media}"/>
            </div>

            <div class="col-lg-8">
                <h2>${news_item.title}</h2>
                <p>${news_item.summary}</p>
                <div>${news_item.rights}* ${news_item.published_date}</div>
            </div>

        </div>`;
    }).join('');

    document.getElementById("news-board") .innerHTML = newsHTML;
};

const errorRender = (message) => {
    let errorHTML = `<div class="alert alert-danger text-center" role="alert">${message}</div>`
    document.getElementById("news-board") .innerHTML = errorHTML;
};

const pagenation = () => {

    let pagenationHTML = ``;
    //page group
    let pageGroup = Math.ceil(page/5);
    //last page
    let last = pageGroup*5;
    //first page
    let first = last - 4;
    //first ~ last page print

    pagenationHTML = `<li class="page-item">
    <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${page-1})">
      <span aria-hidden="true">&laquo;</span>
    </a>
  </li>`

    for (let i = first; i<=last ; i ++){
        pagenationHTML+= `<li class="page-item ${
            page == i ? "active" : '' // highlight page number that you at
        }"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`;
    }

    pagenationHTML = `<li class="page-item">
    <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${page+1})">
      <span aria-hidden="true">&raquo;</span>
    </a>
  </li>`
    
    document.querySelector(".pagenation").innerHTML = pagenationHTML;

};

const moveToPage = (pageNum) => {
    page = pageNum;

    getNews();
}

searchButton.addEventListener("click", getNewsByKeyword);
getLatestNews();
