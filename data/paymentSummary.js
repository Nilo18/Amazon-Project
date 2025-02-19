import {cart} from "./cart.js"
import {getDeliveryOption} from "./deliveryOptions.js"
import { formatCurrency } from "../scripts/utils/money.js";

function getProduct(selectedProduct) {
    return cart.find(product => product.id === selectedProduct.id);
}

// This function saves the data and geenrates the HTML, completing 2 steps of js at the same time
// It is using MVC method (Model View Control)
// Model is the same as saving the data, and View is the same as generating the HTML
export function renderPaymentSummary() {
    let productPriceCents = 0;
    let shippingPriceCents = 0;
    let totalQuantity = 0;

    cart.forEach(cartItem => {
        const product = getProduct(cartItem) // Identify the product
        productPriceCents += product.priceCents * cartItem.quantity // The total cost is quantity times price, so calculate and sum it up
        totalQuantity += cartItem.quantity; // Sum up the quantities

        const deliveryOption = getDeliveryOption(cartItem) // Identify the shipping option
        shippingPriceCents += deliveryOption.priceCents  // Calculate the total cost of all the items
    });

    const totalBeforeTaxCents = productPriceCents + shippingPriceCents; // Calculate the price before tax
    const taxCents = totalBeforeTaxCents * 0.1; // Calculate the tax (10 percent)
    const totalCents = totalBeforeTaxCents + taxCents;

    const paymentSummaryHTML = `
          <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div id="paymentSummaryProductCount">Items (${totalQuantity}):</div>
                <div class="payment-summary-money">
                  $${formatCurrency(productPriceCents)}
                </div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
                <div class="payment-summary-money">
                  $${formatCurrency(shippingPriceCents)}
                </div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
              <div class="payment-summary-money">
                  $${formatCurrency(totalBeforeTaxCents)}
              </div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
              <div class="payment-summary-money">
                  $${formatCurrency(taxCents)}
              </div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
              <div class="payment-summary-money">
                  $${formatCurrency(totalCents)}
              </div>
          </div>

          <button class="place-order-button button-primary" id="placeOrderBtn">
            Place your order
          </button>
    `
    const paymentSummary = document.querySelector('.js-payment-summary')
    paymentSummary.innerHTML = paymentSummaryHTML
}
