export function setBasket(basket) {
  localStorage.setItem("basket", JSON.stringify(basket));
}

export function deleteBasket() {
  localStorage.removeItem("basket");
}

export function getBasket() {
  return JSON.parse(localStorage.getItem("basket")) || [];
}
