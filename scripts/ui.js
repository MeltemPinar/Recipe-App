export const ele = {
  form: document.querySelector("form"),
  result_list: document.querySelector("#results"),
  recipe_area: document.querySelector("#recipe"),
  like_list: document.querySelector(".dropdown"),
  basket_list: document.querySelector("#basket"),
  clear_btn: document.querySelector("#clear"),
};

// bildirim gönderir
export const notify = (text) => {
  Toastify({
    text,
    duration: 3000,
    close: true,
    gravity: "bottom",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #fbda61, #ff5acd)",
    },
  }).showToast();
};

// yükleniyor gifini ekrana basar
export const renderLoader = (outlet) => {
  outlet.innerHTML = `
    <div class="wrapper">
     <div class="three-body">
      <div class="three-body__dot"></div>
      <div class="three-body__dot"></div>
      <div class="three-body__dot"></div>
     </div>
    </div>
    `;
};

// arama sonuçlarını ekrana basar

export const renderResults = (results) => {
  // tarif dizi içerisndeki her bir tarif için bi link oluştur
  // ve result list içerisne bu html'lleri gönder
  ele.result_list.innerHTML = results
    .map(
      (recipe) => `
          <a href="#${recipe.recipe_id}">
            <div class="img-wrapper">
              <img
                src="${recipe.image_url}"
              />
            </div>
            <div class="info">
              <h4>${recipe.title}</h4>
              <p>${recipe.publisher}</p>
            </div>
          </a>    
      `
    )
    .join(" ");
};
