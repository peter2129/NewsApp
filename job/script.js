const API_KEY = "36e9e3eebe363fe83ae1cdb49b97a9ff";
const url = "https://gnews.io/api/v4/search?q="; // Updated base URL for the new API

window.addEventListener("load", () => {
    fetchNews("example"); // Replace "example" with default query or initial load query

    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => onNavItemClick(item.id));
    });
});

async function fetchNews(query) {
    try {
        const res = await fetch(`${url}${encodeURIComponent(query)}&apikey=${API_KEY}`);
        const data = await res.json();
        if (data.articles) {
            bindData(data.articles);
            console.log(data);
        } else {
            console.error('API Error:', data.message);
        }
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.image) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img"); // Use ID selector #
    const newsTitle = cardClone.querySelector("#news-title"); // Use ID selector #
    const newsSource = cardClone.querySelector("#news-source"); // Use ID selector #
    const newsDesc = cardClone.querySelector("#news-desc"); // Use ID selector #

    if (newsImg && newsTitle && newsSource && newsDesc) { // Ensure elements are found
        newsImg.src = article.image; // Updated to match new API data structure
        newsTitle.textContent = article.title;
        newsDesc.textContent = article.description;

        const date = new Date(article.publishedAt).toLocaleString("en-US", {
            timeZone: "Asia/Jakarta",
        });

        newsSource.textContent = `${article.source.name} · ${date}`;

        cardClone.querySelector(".card").addEventListener("click", () => {
            window.open(article.url, "_blank");
        });
    } else {
        console.error('Template structure is incorrect. Ensure the elements exist in the template.');
    }
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    if (curSelectedNav) {
        curSelectedNav.classList.remove("active");
    }
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value.trim(); // Trim whitespace
    if (!query) return;
    fetchNews(query);
    if (curSelectedNav) {
        curSelectedNav.classList.remove("active");
    }
    curSelectedNav = null;
});
