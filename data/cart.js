import {formatCurrency} from "../scripts/utils/money.js"
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js" // Default export doesn't use curly brace '{}'
import {renderPaymentSummary} from './paymentSummary.js'
import {deliveryOptions} from "./deliveryOptions.js"

const today = dayjs(); // The current date

const storagedCart = localStorage.getItem('cart')
export let cart = JSON.parse(storagedCart) || []
let counter = parseInt(localStorage.getItem('counter')) || 2; // Counter from amazon.js

const orderSummary = document.querySelector('.order-summary') // All products are placed here, and displayed as a grid

// Function to allow the user to delete products
function deleteProduct(itemContainer, index) {
    const selectedProduct = cart[index]; // Current product
    itemContainer.remove()
    cart.splice(index, 1)
    localStorage.setItem('cart', JSON.stringify(cart))
    // window.location.reload();
    counter -= selectedProduct.quantity // Changing counter from amazon.js
    productCount -= selectedProduct.quantity
    headerQuantity.textContent = `${productCount} items`;
    localStorage.setItem('counter', counter);
}

let hasGenerated = false; // Flag to make sure that the update input field is generated only once
let saveHandler; // Variable to store the event listener reference

// Function to allow the user to save the selected quantity
function saveQuantity(updateInput, quantityP, updateBtn, index, itemContainer) {
    const newValue = parseInt(updateInput.value, 10) || 0; 
    const previousQuantity = parseInt(quantityP.dataset.previousQuantity, 10) || 0; 

    if (newValue >= 1) {
        quantityP.textContent = `Quantity: ${newValue}`;
        updateBtn.textContent = 'Update';
        hasGenerated = false;
        productCount += (newValue - previousQuantity);
        counter += (newValue - previousQuantity); 
        localStorage.setItem('counter', counter);
        headerQuantity.textContent = `${productCount} items`;

        cart[index].quantity = newValue;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateBtn.removeEventListener('click', saveHandler);
    } else if (newValue === 0) {
        deleteProduct(itemContainer, index);
    } else {
        alert('Not a valid quantity');
    }

    // Remove the event listener after saving

}

// Function to allow user to start updating the quantity
function updateQuantity(updateBtn, quantityP, index, itemContainer) {
    if (!hasGenerated) {
        const currentQuantity = parseInt(quantityP.textContent.split(': ')[1], 10) || 1; 
        const updateInput = document.createElement('input');
        updateBtn.textContent = 'Save';
        updateInput.type = 'number';
        updateInput.value = currentQuantity;
        updateInput.setAttribute('class', 'update-input');
        quantityP.textContent = 'Quantity: ';
        quantityP.appendChild(updateInput);
        hasGenerated = true;

        quantityP.dataset.previousQuantity = currentQuantity;
        updateBtn.dataset.index = index; // Store index in dataset

        // Remove any previous event listener
        updateBtn.removeEventListener('click', saveHandler);

        // Assign the event listener to the variable and add it
        saveHandler = () => saveQuantity(updateInput, quantityP, updateBtn, index, itemContainer);
        updateBtn.addEventListener('click', saveHandler);
    }
}

// const totalCost = document.getElementById('itemCost').textContent
// const totalCost = document.createElement('div')
// totalCost.setAttribute('class', 'payment-summary-money')
// totalCost.textContent = 45
// orderSummary.appendChild(totalCost)
// + selectedProduct.quantity * formatCurrency(selectedProduct.priceCents)
// console.log(totalCost)
// function calculateItemCost(selectedProduct) {
//     const calculatedTotalCost = totalCost + selectedProduct.quantity * formatCurrency(selectedProduct.priceCents)
// }

const headerQuantity = document.querySelector('.return-to-home-link');
let productCount = 3; // Checkout header counter
headerQuantity.textContent = `${productCount} items`;

// Generate a container to display the products
cart.forEach((selectedProduct, index) => {
    // calculateItemCost(selectedProduct)

    const itemContainer = document.createElement('div')
    itemContainer.setAttribute('class', 'cart-item-container')
    orderSummary.appendChild(itemContainer)

    const deliveryDate = document.createElement('div') // Create the header delivery-date
    deliveryDate.setAttribute('class', 'delivery-date')
    itemContainer.appendChild(deliveryDate)

    const detailsGrid = document.createElement('div')
    detailsGrid.setAttribute('class', 'cart-item-details-grid')
    itemContainer.appendChild(detailsGrid)

    const productImage = document.createElement('img')
    productImage.setAttribute('class', 'product-image')
    productImage.src = selectedProduct.image
    detailsGrid.appendChild(productImage)

    const itemDetails = document.createElement('div')
    itemDetails.setAttribute('class', 'cart-item-details')
    detailsGrid.appendChild(itemDetails)

    const productName = document.createElement('div')
    productName.setAttribute('class', 'product-name')
    productName.textContent = selectedProduct.name
    
    const productPrice = document.createElement('div')
    productPrice.setAttribute('class', 'product-price')
    productPrice.textContent = `$${formatCurrency(selectedProduct.priceCents)}`

    const productQuantity = document.createElement('div')
    productQuantity.setAttribute('class', 'product-quantity')

    itemDetails.append(productName, productPrice, productQuantity)

    const quantityP = document.createElement('span')
    quantityP.textContent = `Quantity: ${selectedProduct.quantity}`

    const updateBtn = document.createElement('span')
    updateBtn.setAttribute('class', 'update-quantity-link link-primary')
    updateBtn.textContent = 'Update'

    updateBtn.addEventListener('click', () => updateQuantity(updateBtn, quantityP, index, itemContainer))

    const deleteBtn = document.createElement('span')
    deleteBtn.setAttribute('class', 'delete-quantity-link link-primary')
    deleteBtn.textContent = 'Delete'

    deleteBtn.addEventListener('click', () => deleteProduct(itemContainer, index))

    productQuantity.append(quantityP, updateBtn, deleteBtn)

    const deliveryOptions = document.createElement('div')
    deliveryOptions.setAttribute('class', 'delivery-options')
    detailsGrid.appendChild(deliveryOptions)

    const deliveryOption = document.createElement('div')
    deliveryOption.setAttribute('class', 'delivery-option')

    // ----------

    const deliveryInput = document.createElement('input')
    deliveryInput.type = 'radio'
    deliveryInput.name = `delivery-${index}`;
    deliveryInput.checked = true;
    deliveryInput.setAttribute('class', 'delivery-option-input')

    // ----------

    const deliveryOptionDate = document.createElement('div')
    deliveryOptionDate.setAttribute('class', 'delivery-option-date')
    const freeShippingDate = today.add(7, 'day') // The shipping date for free delivery is one week (today + 7 days)
    deliveryOptionDate.textContent = freeShippingDate.format('dddd, MMMM D')

    const chosenDelivery = deliveryOptionDate.textContent;
    deliveryDate.textContent = `Delivery date: ${chosenDelivery}`; // Set the header delivery-date's text to display the initial date

    deliveryInput.addEventListener('click', () => {
        deliveryDate.textContent = `Delivery date: ${chosenDelivery}`;
    })

    const deliveryOptionPrice = document.createElement('div')
    deliveryOptionPrice.setAttribute('class', 'delivery-option-price')
    deliveryOptionPrice.textContent = 'FREE Shipping'

    const dateHolder = document.createElement('div')
    dateHolder.append(deliveryOptionDate, deliveryOptionPrice)

    deliveryOption.append(deliveryInput, dateHolder)


    // ----------

    const deliveryOption2 = document.createElement('div')
    deliveryOption2.setAttribute('class', 'delivery-option')

    // ----------

    const deliveryInput2 = document.createElement('input')
    deliveryInput2.type = 'radio'
    deliveryInput2.name = `delivery-${index}`;
    deliveryInput2.setAttribute('class', 'delivery-option-input')

    // ----------

    const deliveryOptionDate2 = document.createElement('div')
    deliveryOptionDate2.setAttribute('class', 'delivery-option-date')
    const minShippingDate = today.add(4, 'day') // The shipping date for 4.99 delivery are 4 days (today + 4 days)
    deliveryOptionDate2.textContent = minShippingDate.format('dddd, MMMM D') // Fix the formatting to show week days, months and numbers

    const chosenDelivery2 = deliveryOptionDate2.textContent;

    deliveryInput2.addEventListener('click', () => {
        deliveryDate.textContent = `Delivery date: ${chosenDelivery2}`;
    })

    const deliveryOptionPrice2 = document.createElement('div')
    deliveryOptionPrice2.setAttribute('class', 'delivery-option-price')
    deliveryOptionPrice2.textContent = '$4.99 - Shipping'

    const dateHolder2 = document.createElement('div')
    dateHolder2.append(deliveryOptionDate2, deliveryOptionPrice2)

    deliveryOption2.append(deliveryInput2, dateHolder2)

    // ----------

    const deliveryOption3 = document.createElement('div')
    deliveryOption3.setAttribute('class', 'delivery-option')

    // ----------

    const deliveryInput3 = document.createElement('input')
    deliveryInput3.type = 'radio'
    deliveryInput3.name = `delivery-${index}`;
    deliveryInput3.setAttribute('class', 'delivery-option-input')

    // ----------

    const deliveryOptionDate3 = document.createElement('div')
    deliveryOptionDate3.setAttribute('class', 'delivery-option-date')
    const maxShippingDate = today.add(1, 'day') // The shipping date for 9.99 delivery is one day (today + 1 day)
    deliveryOptionDate3.textContent = maxShippingDate.format('dddd, MMMM D')

    const chosenDelivery3 = deliveryOptionDate3.textContent;

    deliveryInput3.addEventListener('click', () => {
        deliveryDate.textContent = `Delivery date: ${chosenDelivery3}`;
    })

    const deliveryOptionPrice3 = document.createElement('div')
    deliveryOptionPrice3.setAttribute('class', 'delivery-option-price')
    deliveryOptionPrice3.textContent = '$9.99 - Shipping'

    const dateHolder3 = document.createElement('div')
    dateHolder3.append(deliveryOptionDate3, deliveryOptionPrice3)

    deliveryOption3.append(deliveryInput3, dateHolder3)

    // ----------

    deliveryOptions.append(deliveryOption, deliveryOption2, deliveryOption3)
    productCount += selectedProduct.quantity;
    headerQuantity.textContent = `${productCount} items`
})