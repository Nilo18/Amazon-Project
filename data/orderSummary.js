import formatCurrency from "../scripts/utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js"
// import { cart } from "./cart.js";
import {loadCart} from '../scripts/amazon.js'
import { products, Product, loadProducts, Clothing } from "./products.js";

// console.log("✅ orderSummary.js is running!");
// console.log('Products array from orderSummary.js: ', products)

let cart = JSON.parse(localStorage.getItem('cart')) || [];
loadCart()

export const orders = JSON.parse(localStorage.getItem('orders')) || []

export function addOrder(order) {
    orders.unshift(order) // Add the order in the front of the array
    saveToStorage()
}

function saveToStorage() {
    localStorage.setItem('orders', JSON.stringify(orders));
}

function redirectToTrackingPage() {
    window.location.href = 'tracking.html'
}
  
function buyAgain(buyAgainMessage, buyAgainIcon, selectedProduct, index) {
    buyAgainMessage.innerHTML = '&#10003; Added'
    buyAgainIcon.style.display = 'none'

    cart = JSON.parse(localStorage.getItem('cart')) || [];
    // console.log("Cart before loading:", cart);

  cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Convert each item to its correct class instance basically run loadCart() manually
  cart = cart.map(item => {
      if (item.category === 'clothing') {
          return Clothing.fromJSON(item);
      } else {
          return Product.fromJSON(item);
      }
  }); // This should convert objects to Product instances

    // console.log("Cart after loading:", cart);

    // Ensure `selectedProduct` is an instance of `Product`
    // console.log("Selected product before check:", selectedProduct, "Instance of Product:", selectedProduct instanceof Product);
    if (!(selectedProduct instanceof Product)) {
        selectedProduct = Product.fromJSON(selectedProduct);
    }
    // console.log("Selected product after check:", selectedProduct, "Instance of Product:", selectedProduct instanceof Product);

    // Log each product inside the cart to confirm their type
    // cart.forEach((product, i) => {
    //     console.log(`Cart item ${i}:`, product, "Instance of Product:", product instanceof Product);
    // });

    // Find the product in the cart
    const existingProduct = cart.find(product => product.getId() === selectedProduct.getId());

    // console.log("Existing product found:", existingProduct);
    // console.log(existingProduct.quantity)

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      selectedProduct.quantity = 1;

      // Ensure delivery option is set
      if (!selectedProduct.deliveryOptionId) {
        selectedProduct.deliveryOptionId = '1';
      }

      cart.push(selectedProduct);
    }

    // Save the updated cart
    localStorage.setItem('cart', JSON.stringify(cart.map(product => product.toJSON())));

    setTimeout(() => {
        buyAgainMessage.textContent = 'Buy it again'
        buyAgainIcon.style.display = 'inline'
    }, 2000);
}

console.log("Cart from orderSummary.js:", cart);

console.log(orders)
document.addEventListener('DOMContentLoaded', () => {
    loadProducts(handleLoadedProducts);
})

function handleLoadedProducts() {

    function getProductDetails(productId) {
        const productIndex = products.findIndex(p => p.getId() === productId);
        const product = productIndex !== -1 ? products[productIndex] : null;
    
        return { product, productIndex };
    }
    

    const ordersGrid = document.getElementById('js-orders-grid')
    console.log("The orders grid: ", ordersGrid)
    // console.log("Body:", document.querySelector("body"));

    orders.forEach(order => {
        const orderContainer = document.createElement('div')
        orderContainer.className = 'order-container'
        ordersGrid.appendChild(orderContainer)

        // Create the header for the container
        const orderHeader = document.createElement('div')
        orderHeader.className = 'order-header'

        // Create the body for the container
        const orderDetailsGrid = document.createElement('div')
        orderDetailsGrid.className = 'order-details-grid'

        orderContainer.append(orderHeader, orderDetailsGrid)

        // Create the layout for the header
        const headerLeftSection = document.createElement('div')
        headerLeftSection.className = 'order-header-left-section'

        const headerRightSection = document.createElement('div')
        headerRightSection.className = 'order-header-right-section'

        orderHeader.append(headerLeftSection, headerRightSection)

        const orderDate = document.createElement('div')
        orderDate.className = 'order-date'

        const orderDateLabel = document.createElement('div')
        orderDateLabel.className = 'order-header-label'
        orderDateLabel.textContent = 'Order Placed:'

        const orderDateFormat = document.createElement('div') // Create a div to hold the order date
        const formattedDate = dayjs(order.orderTime).format('MMMM D'); // Format the date of the order using dayjs
        orderDateFormat.textContent = formattedDate

        orderDate.append(orderDateLabel, orderDateFormat)

        const orderTotal = document.createElement('div')
        orderTotal.className = 'order-total'

        const orderTotalLabel = document.createElement('div')
        orderTotalLabel.className = 'order-header-label'
        orderTotalLabel.textContent = "Total:"

        const orderTotalCost = document.createElement('div')
        orderTotalCost.textContent = `$${formatCurrency(order.totalCostCents)}`

        orderTotal.append(orderTotalLabel, orderTotalCost)

        headerLeftSection.append(orderDate, orderTotal)

        const orderIdLabel = document.createElement('div')
        orderIdLabel.className = 'order-header-label'
        orderIdLabel.textContent = 'Order ID:'

        const orderIdContent = document.createElement('div')
        orderIdContent.textContent = order.id

        headerRightSection.append(orderIdLabel, orderIdContent)

        // Create the layout for the body
        order.products.forEach(product => {
            const productImageContainer = document.createElement('div')
            productImageContainer.className = 'product-image-container'

            const { product: originalProductDetails, productIndex } = getProductDetails(product.productId);

            if (!originalProductDetails) {
              console.warn(`Product not found for ID: ${product.productId}`);
              return;
            }

            const productImage = document.createElement('img')
            productImage.src = originalProductDetails.getImage()
            productImage.alt = originalProductDetails.getName()

            productImageContainer.appendChild(productImage)

            const productDetails = document.createElement('div')
            productDetails.className = 'product-details'

            const productName = document.createElement('div')
            productName.classList = 'product-name'
            productName.textContent = originalProductDetails.getName()

            const productDeliveryDate = document.createElement('div')
            productDeliveryDate.className = 'product-delivery-date'
            productDeliveryDate.textContent = `Arriving on: ${dayjs(product.estimatedDeliveryTime).format('MMMM D')}`

            const productQuantity = document.createElement('div')
            productQuantity.className = 'product-quantity'
            productQuantity.textContent = `Quantity: ${product.quantity}`

            const buyAgainButton = document.createElement('button')
            buyAgainButton.classList.add('buy-again-button', 'button-primary')

            const buyAgainIcon = document.createElement('img')
            buyAgainIcon.className = 'buy-again-icon'
            buyAgainIcon.src = 'images/icons/buy-again.png'

            const buyAgainMessage = document.createElement('span')
            buyAgainMessage.className = 'buy-again-message'
            buyAgainMessage.textContent = 'Buy it again'

            buyAgainButton.append(buyAgainIcon, buyAgainMessage)
            buyAgainButton.addEventListener('click', () => buyAgain(buyAgainMessage, buyAgainIcon, originalProductDetails, productIndex))

            productDetails.append(productImageContainer, productName, productDeliveryDate, productQuantity, buyAgainButton)

            const trackPackageButton = document.createElement('button')
            trackPackageButton.classList.add('track-package-button', 'button-secondary')
            trackPackageButton.textContent = 'Track package'
            trackPackageButton.addEventListener('click', () => redirectToTrackingPage())

            orderDetailsGrid.append(productImageContainer, productDetails, trackPackageButton)
        });
    });
}
//   }

//   displayOrders()

