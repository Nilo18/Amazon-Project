import {cart} from "./cart.js"
import {getDeliveryOption} from "./deliveryOptions.js"

function getProduct(selectedProduct) {
    return cart.find(product => product.id === selectedProduct.id);
}

export function renderPaymentSummary() {
    let productPriceCents = 0;
    let shippingPriceCents = 0;

    cart.forEach(cartItem => {
        const product = getProduct(cartItem)
        productPriceCents += product.priceCents * cartItem.quantity

        const deliveryOption = getDeliveryOption(cartItem)
        console.log(deliveryOption)
        shippingPriceCents += deliveryOption.priceCents 
    });

    console.log(productPriceCents)
    console.log(shippingPriceCents)
}