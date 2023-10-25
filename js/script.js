

var xhttp = new XMLHttpRequest();

function wait(second) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('resolved');
        }, second);
    });
}

function get(name) {
    if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
        return decodeURIComponent(name[1]);
}

async function addProduct(id, name, price, category) {
    var c = document.getElementById('product-list');
    var variable = get('category');
    var x = `
    <li>
    <div class="box" id="product-${id}">             
        <div class="xx">
            <i class="fa fa-shopping-cart cart" aria-hidden="true"></i>
            <h1>${name}</h1>
            <i class="fa fa-heart-o heart-empty" aria-hidden="true" onClick="heartClick(element)"></i>
        </div>
        <img src="./img/${name}.jpg">
        <h2>Fiyat: ${price} TL</h2>          
    </div>
</li>`;
    c.innerHTML = x;
}

category();
async function category() {
    const jsonResult = await fetchData('http://localhost:8080/category');
    const obj = JSON.parse(jsonResult);
    var c = document.getElementById('category-list');

    var table = "";
    table += `<li class="category-item"><a href="http://127.0.0.1:5500?category=all">Tüm Ürünler</li></a>`;
    for (var i = 0; i < obj.length; i++) {
        var name = obj[i].category;
        var id = obj[i].id;
        table += `<li class="category-item"><a href="http://127.0.0.1:5500?category=${id}">${name.charAt(0).toUpperCase() + name.slice(1)}</li></a>`;
    }
    c.innerHTML = table;
}

const searchInput = document.getElementById('search-box');
searchInput.addEventListener('keydown', handleSearchKeydown);

function handleSearchKeydown(event) {
  if (event.code === 'Enter' || event.key === 'Enter') {
    event.preventDefault();
    products();
  }
}

products();
async function products() {
    var variable = get('category');

    console.log(variable);
    let jsonResult;

    if (searchInput.value.length > 0 && searchInput.value !== "") {
        console.log(searchInput.value, searchInput.value.length);
        jsonResult = await fetchData(`http://localhost:8080/admin/product/findbyname/${searchInput.value}`);
        console.log(jsonResult);

    } else if(variable === "all" || variable === null){
        jsonResult = await fetchData(`http://localhost:8080/admin/products`);
    }else {
        jsonResult = await fetchData(`http://localhost:8080/category/${variable}`);
    }

    var error = await document.getElementById("error");
    var errorClass = document.querySelector(".error");
    var productListClass = document.querySelector(".product-list");
    if(jsonResult.includes("null")) {   
        errorClass.classList.remove('hidden');
        productListClass.classList.add('hidden');
        error.innerText ="KATEGORI BULUNAMADI!";
        return;
    } else if (jsonResult.includes("[]")){
        errorClass.classList.remove('hidden');
        productListClass.classList.add('hidden');
        error.innerText ="URUN BULUNAMADI!";
        return;
    } else {
        productListClass.classList.remove('hidden');
        errorClass.classList.add('hidden');
    }

    const obj = JSON.parse(jsonResult);
    let table = "";
    for (let i = 0; i < obj.length; i++) {
        let id = obj[i].productId;
        let name = obj[i].productName;
        let price = obj[i].productPrice;
        let categoryId = obj[i].category.id;
        let categoryName = obj[i].category.category;
        let image = obj[i].productImage;
        let index = image.split("/");
            table += `<li>
            <div class="box" id="product-${id}">             
                <div class="xx">
                    <i class="fa fa-shopping-cart cart" aria-hidden="true"></i>
                    <h1>${name}</h1>
                    <i class="fa fa-heart-o heart-empty" aria-hidden="true" onClick="heartClick(element)"></i>
                </div>
                <img src="./img/products/${index[12]}">
                <h2>Fiyat: ${price} TL</h2>          
            </div>
        </li>`
        
    }
    var p = await document.getElementById('product-list');
     p.innerHTML = table;

}


async function fetchData(url) {
    try {
        const response = await fetch(url);
        var data = await response.text();
        return data;
    } catch (error) {
        console.error(error);
    }
}