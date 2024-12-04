export function setBasket(basket) {
  sessionStorage.setItem("basket", JSON.stringify(basket));
}

export function deleteBasket() {
  sessionStorage.removeItem("basket");
}

export function getBasket() {
  return JSON.parse(sessionStorage.getItem("basket")) || [];
}
