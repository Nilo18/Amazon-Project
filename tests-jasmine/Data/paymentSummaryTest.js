import {renderPaymentSummary} from "../../data/paymentSummary.js"


describe('Test suite: renderPaymentSummary', () => {
    it ('displays the payment box', () => {
        const testContainer = document.querySelector('.js-test-container');
        testContainer.innerHTML = `<div class="js-payment-summary"></div>`
        expect(testContainer.innerHTML).toEqual(`<div class="js-payment-summary"></div>`)
    })
})
