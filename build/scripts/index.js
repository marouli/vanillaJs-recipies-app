const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random');
const mealsEl = document.getElementById('meals');
const mealCategoryList = document.getElementById('list-categories');
const resultHeading = document.getElementById('result-heading');
const single_mealEl = document.getElementById('single-meal');

const searchMeal = (e) => {
  e.preventDefault();

  const term = search.value;

  if (term) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((response) => response.json())
      .then((data) => {
        resultHeading.innerHTML = `<h3>Search results for '${term}':</h3>`;

        if (data.meals === null) {
          resultHeading.innerHTML = `<p>There are no search results. Try again!</p>`;
          mealsEl.innerHTML = '';
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              (meal) => `
          <div class="meal">
              <a href="detail.html?meal=${meal.idMeal}" aria-label="detail">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
              <div class="meal-info" data-mealid="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
              </div>
              </a>
            </div>
          `
            )
            .join('');
        }
      });
    search.value = '';
  } else {
    alert('Please enter a search value');
  }
};

const displayMealLists = () => {
  fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    .then((response) => response.json())
    .then((data) => {
      if (data.categories === null) {
        mealCategoryList.innerHTML = '';
      } else {
        mealCategoryList.innerHTML = data.categories
          .map(
            (meal) => `
              <li class="category", gategoryId=${meal.strCategory}>${meal.strCategory}
              <img src="${meal.strCategoryThumb}" alt="${meal.strMeal}" />
              </li>`
          )
          .join('');
      }
    });
};

displayMealLists();

const displayByCategory = (id) => {
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${id}`)
    .then((res) => res.json())
    .then((data) => {
      resultHeading.innerHTML = `<h3>Search results for '${id}':</h3>`;
      if (data.meals === null) {
        resultHeading.innerHTML = `<p>There are no search results. Try again!</p>`;
        mealsEl.innerHTML = '';
      } else {
        mealsEl.innerHTML = data.meals
          .map(
            (meal) => `
        <div class="meal">
            <a href="detail.html?meal=${meal.idMeal}" aria-label="detail">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="meal-info" data-mealid="${meal.idMeal}">
              <h3>${meal.strMeal}</h3>
            </div>
            </a>
          </div>
        `
          )
          .join('');
      }
    });
};

submit.addEventListener('submit', searchMeal);

random.addEventListener('click', () => {
  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      const mealID = meal.idMeal;

      window.location = `detail.html?meal=${meal.idMeal}`;
    });
});

mealsEl.addEventListener('click', (e) => {
  const path = e.path || (e.composedPath && e.composedPath());
  const mealInfo = path.find((item) => {
    if (item.classList) {
      return item.classList.contains('meal-info');
    } else {
      return false;
    }
  });

  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealid');
  }
});

document.getElementById('list-categories').addEventListener('click', (e) => {
  const path = e.path || (e.composedPath && e.composedPath());
  const categoryInfo = path.find((item) => {
    if (item.classList) {
      return item.classList.contains('category');
    } else {
      return false;
    }
  });

  if (categoryInfo) {
    const categoryID = categoryInfo.getAttribute('gategoryId');
    displayByCategory(categoryID);
  }
});
