const API = 'https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=42122871a6c24900ad28436e126daffe';
let aFile = "style.css"; // Сюда вставляется полный путь к css-файлу
let aRel = "stylesheet";


class NewsList {
    constructor(container = '.news') {
        this.container = container;
        this.news = [];
        this._getNews()
            .then(data => {
                console.log(data);
                this.news = [...data.articles];
                this.render()
            });
        this.addCSS(aFile, aRel); // Вставляем файл css в html
    }
    _getNews() {
        return fetch(`${API}`)
            .then(result => result.json())
            .catch(error => {
                console.log(error);
            })
    }
    render() {
        let colorA = document.cookie;
        const block = document.querySelector(this.container);
        let number = 0;
        const smallBlock = document.querySelector('.small');
        smallBlock.innerHTML = '<p>Новостей: ' + this.news.length + '</p><button onclick="list.showNews()">Показать</button>'
        for (let item of this.news) {
            const newsObj = new NewsItem(item);
            block.insertAdjacentHTML('beforeend', newsObj.render(number))
            number++;
        }
        for (let i = 0; i < document.getElementsByTagName("a").length; i++) {
            for (let j = 0; j < colorA.split(";").length; j++) {
                let getUrl = document.getElementsByTagName("a")[i].href;
                let cookie = colorA.split("\;")[j].split("\=")[1];
                if (getUrl == cookie) {
                    let id = document.getElementsByTagName("a")[i].id.split("_")[1];
                    document.getElementById(id).classList.add('grey'); // Если мы находим url в cookie, то выделяем блок серым
                }
            }
        }
        this.action();
    }
    showNews() {
        document.getElementsByClassName("news")[0].classList.remove("vis");

    }

    addCSS(aFile, aRel) { // Добавляем файл css
        let head = window.document.getElementsByTagName('head')[0];
        let style = window.document.createElement('link');
        style.href = aFile;
        style.rel = aRel || 'stylesheet';
        head.appendChild(style);
    }
    action() { // делает блок синим, при наведении мышкой
        for (let i = 0; i < this.news.length; i++) {
            let form = document.getElementsByClassName("forEachNews")[i];
            form.onmouseenter = function (e) {
                document.getElementsByClassName("forEachNews")[i].classList.add("blue");
            }
            form.onmouseleave = function (e) {
                document.getElementsByClassName("forEachNews")[i].classList.remove("blue");
            }
        }
    }
    addCookies(name) {
        let number = 0;
        let colorA = document.cookie;
        let date = new Date;
        let newDate = date.getFullYear() + 1;
        for (let j = 0; j < colorA.split("\;").length; j++) {
            if (colorA.split("\;")[j].split("\=")[1] == name) {
                number++; // Выполняется проверка, если такой url уже есть в cookie
            };
        }
        if (number == 0) { // Если url нет, то добавляем его туда
            document.cookie = 'url_' + (colorA.split("\;").length + 1) + '=' + (name) + '; expires=15/02/' + newDate + ' 00:00:00;';
        }
    }
}

class NewsItem {
    constructor(product) {
        this.author = product.author;
        this.content = product.content;
        this.description = product.description;
        this.publishedAt = product.publishedAt;
        this.title = product.title;
        this.url = product.url;
        this.urlToImage = product.urlToImage;
        this.source = product.source;
    }
    render(number) {
        if (this.content != null) {
            this.content = this.content.split("\[")[0];
        }
        if (this.publishedAt != null) {
            this.publishedAt = this.publishedAt.split("T")[0];
        }
        return `<div class="forEachNews" id=${number}>
                    <div class="headerNews">
                        <div class="forTitle">
                            <h3>${this.title}</h3>
                        </div>
                        <img src="${this.urlToImage}">
                    </div>
                    <p class="author">${this.author} </p>
                    <p class="publishedAt">${this.publishedAt}</p>
                    <h4>${this.content}</h4>
                    <p>${this.description}</p>
                    <p class="forLink"><a href=${this.url} onclick="list.addCookies('${this.url}')" id="a_${number}">Читать...</a></p>
                </div>`
    }
}
let list = new NewsList();
list.render();