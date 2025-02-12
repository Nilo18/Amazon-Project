import { products, Product } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
// import {getProduct} from "../data/cart.js"

// Function to convert an object into Product class instance to load from cart
function loadCart() {
  cart = cart.map(item => {
    const product = Product.fromJSON(item);  // Use the fromJSON to create a Product instance
    console.log(product);  // Log to check the converted product
    return product;  // Return the newly created Product instance
  });
}

let productsHTML = '';

products.forEach((product, index) => {
    productsHTML += `<div class="product-container">
          <div class="product-image-container">
            <img class="product-image" src="${product.getImage()}">
          </div>
          <div class="product-name limit-text-to-2-lines">${product.getName()}</div>
          <div class="product-rating-container">
            <img class="product-rating-stars" src="images/ratings/rating-${product.getRating().stars * 10}.png">
            <div class="product-rating-count link-primary">${product.getRating().count}</div>
          </div>
          <div class="product-price">$${formatCurrency(product.getPrice())}</div>
          <div class="product-quantity-container">
            <select>
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>
          <!--We call this method without knowing exactly what class the product is -->
          <!--Instead the method is defined according to the class, this is called polymorphism -->
          ${product.extraInfoHTML()}

          <div class="product-spacer"></div>
          <div class="added-to-cart"></div>
          <button class="add-to-cart-button button-primary">Add to Cart</button>
        </div>`;
        // console.log(product)
});

//The main grid
const productsGrid = document.querySelector('.js-products-grid');
// console.log(productsHTML)
productsGrid.innerHTML = productsHTML;

//Paragraph to display the message, buttons and flags to make sure that the message is displayed once
const displayP = document.querySelectorAll('.added-to-cart');
const addButton = document.querySelectorAll('.button-primary');
const displayed = new Array(addButton.length).fill(false);

//Amount of items in the cart and initialize the counter to get the latest number of counter
const cartQuantity = document.querySelector('.cart-quantity');
let counter = parseInt(localStorage.getItem('counter')) || 0;
cartQuantity.textContent = counter;

//Checkout array, to push the items on the checkout page
let cart = JSON.parse(localStorage.getItem('cart')) || [];
loadCart()

export function addToCart(selectedProduct, index) {
  cart = JSON.parse(localStorage.getItem('cart')) || [];
  loadCart(); // Reload the cart

  const existingProduct = cart.find(product => product.getId() === selectedProduct.getId());

  if (existingProduct) {
    existingProduct.quantity += parseInt(document.querySelectorAll('.product-quantity-container select')[index].value);
  } else {
    selectedProduct.quantity = parseInt(document.querySelectorAll('.product-quantity-container select')[index].value);
    
    // Only set deliveryOptionId if it's undefined (prevents overwriting selected options)
    if (!selectedProduct.deliveryOptionId) {
      selectedProduct.deliveryOptionId = '1';
    }

    cart.push(selectedProduct);
  }

  // Save the updated cart back to localStorage
  localStorage.setItem('cart', JSON.stringify(cart.map(product => product.toJSON())));
  console.log(cart);  // Log to confirm the cart update
}



function handleQuantity(index) {
  const optionChosen = parseInt(document.querySelectorAll('.product-quantity-container select')[index].value);
  counter += optionChosen;
  cartQuantity.textContent = counter;
  localStorage.setItem('counter', counter);
}

function createAddedMessage(index) {
  if (!displayed[index]) {
    const addMsg = document.createElement('p');
    addMsg.textContent = 'Added';
    addMsg.style.color = 'green';

    const checkImg = document.createElement('img');
    checkImg.src = './images/icons/checkmark.png';

    displayP[index].append(addMsg, checkImg);
    displayed[index] = true;

    setTimeout(() => {
      addMsg.remove();
      checkImg.remove();
      displayed[index] = false;
    }, 2000);
  }

  handleQuantity(index);
  addToCart(products[index], index);
  console.log(products[index])
}

addButton.forEach((button, index) => {
  button.addEventListener('click', () => createAddedMessage(index));
});


// counter = 0;
