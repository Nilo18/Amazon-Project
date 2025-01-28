import {cart} from "./cart.js"

function getProduct(selectedProduct) {
    return cart.find(product => product.id === selectedProduct.id);
}

export function renderPaymentSummary() {
    let productPriceCents = 0;

    cart.forEach(cartItem => {
        const product = getProduct(cartItem)
        productPriceCents += product.priceCents * cartItem.quantity
    });

}