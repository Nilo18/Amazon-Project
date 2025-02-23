import { products, Product, Clothing, loadProducts } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
// import {getProduct} from "../data/cart.js"

loadProducts(renderProductsGrid);

console.log('Products array: ', products)

let cart = JSON.parse(localStorage.getItem('cart')) || [];
loadCart() // Aqedan bolos isev Product is instance ebi xdebian mgoni

// loadCart() doesn't work in other files because it modifies the local copy of the cart here
// We need loadCart() to convert regular objects into class instance again so we can use getter methods such as getId()

// Function to convert an object into Product class instance to load from cart
export function loadCart() {
  cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Convert each item to its correct class instance
  cart = cart.map(item => {
      if (item.category === 'clothing') {
          return Clothing.fromJSON(item);
      } else {
          return Product.fromJSON(item);
      }
  });

  // console.log("Cart after loading:", cart);
}


function renderProductsGrid() {
  //The main grid
  const productsGrid = document.querySelector('.js-products-grid');
  
  // Remove skeletons before rendering real products
  productsGrid.innerHTML = '';

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

  function addToCart(selectedProduct, index) {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    loadCart(); // Reload the cart

    // selectedProduct is the original product from the products array, thus is a Product class instance by default
    // product is the regular object from the cart which was just converted back to a Product class instance
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
    // console.log('Cart Item:', cart[0])
  }
  console.log('Cart from amazon.js', cart);  // Log to confirm the cart update

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
}

document.addEventListener("DOMContentLoaded", () => {
  loadProducts(() => {
    renderProductsGrid(); // Render products after they load
  });
});
