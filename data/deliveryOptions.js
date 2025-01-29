export const deliveryOptions = [
    {
        id: '1',
        deliveryDays: 7,
        priceCents: 0
    }, {
        id: '2',
        deliveryDays: 3,
        priceCents: 499
    }, {
        id: '3',
        deliveryDays: 1,
        priceCents: 999
    }, 
]

export function getDeliveryOption(cartItem) {
    let deliveryOption

    deliveryOptions.forEach(option => {
        // Check which which shipping option has been selected from the product container
        if (option.id === cartItem.deliveryOptionId) {
            deliveryOption = option
        }
    });

    return deliveryOption || deliveryOptions[0] // Return the result
}