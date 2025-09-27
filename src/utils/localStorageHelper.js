export function setBasket(basket) {
  localStorage.setItem("basket", JSON.stringify(basket));
}

export function deleteBasket() {
  localStorage.removeItem("basket");
}

export function getBasket() {
  return JSON.parse(localStorage.getItem("basket")) || [];
}

export function setToken(token, expires_at) {
  localStorage.setItem("authToken", JSON.stringify({ token, expires_at }));
}

export function deleteToken() {
  localStorage.removeItem("authToken");
}

export function getToken() {
  return JSON.parse(localStorage.getItem("authToken")) || null;
}
