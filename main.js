import Search from "./scripts/search.js";
import Recipe from "./scripts/recipe.js";
import { ele, notify, renderLoader, renderResults } from "./scripts/ui.js";
import { categories } from "./scripts/constant.js";
// uuid kütüphanesinden id oluşturma methodu import etme
import { v4 } from "https://jspm.dev//uuid";

// class'ın örneğini oluşturma
const search = new Search();
const recipe = new Recipe();

//! Olay İzleyicileri

// Sayfa yüklenme olayını izler
document.addEventListener("DOMContentLoaded", () => {
  // rastgele kategori seç
  const index = Math.floor(Math.random() * categories.length);

  //   kategorni verilerini al ve erkana bas
  getResults(categories[index]);
});

// Formun gönderilme olayını izler
ele.form.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = e.target[0].value;
  getResults(query);
});

// Sayfa yüklenme olayını izle
window.addEventListener("DOMContentLoaded", () => {
  controlUrl();
  renderBasketItems();
});

// Url'deki id'nin değişme olayını izle
window.addEventListener("hashchange", controlUrl);

// tarif alnındaki tıklanmma olaylarını izle
ele.recipe_area.addEventListener("click", handleClick);

//! Fonksiyonlar
// Arama Sonuçlarını alıp ekrana basar
async function getResults(query) {
  // arama terimi var mı kontrol et
  if (!query.trim()) {
    return notify("Arama terimi giriniz!");
  }

  // loader bas
  renderLoader(ele.result_list);

  try {
    // api'dan veirleri al
    await search.fetchResults(query.trim());

    if (search.results.error) {
      // veri hatalı geldiyse ekrana uyarı bas
      notify("Aradığınız kriterler uygun ürün bulunamadı");

      // loader'ı kaldır
      ele.result_list.innerHTML = "";
    } else {
      // sonuçları ekrana bas
      renderResults(search.results.recipes);
    }
  } catch (err) {
    // hata olursa bildirim ver
    notify("Bir sorun oluştu");
    // loader'ı kaldır
    ele.result_list.innerHTML = "";
  }
}

// Detay veilerini alıp ekrana basar
async function controlUrl() {
  // detayı gösteriilcek ürünün id'sine eriş
  const id = location.hash.slice(1);

  if (id) {
    // yükleniyor bas
    renderLoader(ele.recipe_area);

    // tarif bilgilerini al
    await recipe.getRecipe(id);

    // tarif bilgilerini ekrana bas
    recipe.renderRecipe(recipe.info);
  }
}

//! Sepete Alanı
let basket = JSON.parse(localStorage.getItem("basket")) || [];

// tarif alanındaki tıklamlarda çalışır
function handleClick(e) {
  if (e.target.id === "add-to-cart") {
    // bütün malzemleri sepete ekle
    recipe.info.ingredients.forEach((title) => {
      //  her bir tarif için yeni bir obje oluştur ve id ekle
      const newItem = {
        id: v4(),
        title,
      };

      // oluşturulan id'li tarifi sepete ekle
      basket.push(newItem);
    });

    // local'i güncelle
    localStorage.setItem("basket", JSON.stringify(basket));

    // sepete arayüzünü güncelle
    renderBasketItems();
  }
}

// tarif veilerini ekrana bsar
function renderBasketItems() {
  ele.basket_list.innerHTML = basket
    .map(
      (i) => `
  <li data-id="${i.id}">
    <i id="delete-item" class="bi bi-x"></i>
    <span>${i.title}</span>
  </li>
  `
    )
    .join(" ");
}

// silme butona tıklanma olayı
ele.clear_btn.addEventListener("click", () => {
  const res = confirm("Sepet temizlenecek emin misniz?");

  if (res) {
    // sepet dizisini sıfırla
    basket = [];

    // local'i temizle
    localStorage.removeItem("basket");

    // arayüz'ü temizle
    ele.basket_list.innerHTML = "";
  }
});

// tek tek silme
ele.basket_list.addEventListener("click", (e) => {
  if (e.target.id == "delete-item") {
    // tıklana elemanın id'sine eriş
    const parent = e.target.parentElement;
    const id = parent.dataset.id;

    // id'sine göre diziden kaldırma
    basket = basket.filter((i) => i.id !== id);

    // local'e güncel diziyi aktar
    localStorage.setItem("basket", JSON.stringify(basket));

    // arayüzden ilgili elemanı kaldır
    parent.remove();
  }
});
