import { formatCurrency } from "../scripts/utils/money.js";

console.log("Test suite: formatCurrency")

console.log("Converts cents into dollars")
formatCurrency(2095) === "20.95"? console.log("passed") : console.log("failed") 
console.log("Works with 0")
formatCurrency(0) === "0.00"? console.log("passed") : console.log("failed") 
console.log("Rounds up to the nearest cent")
formatCurrency(2000.5) === "20.01"? console.log("passed") : console.log("failed") 
// formatCurrency(2000.4) === "20.01"? console.log("passed") : console.log("failed") 


// if(formatCurrency(2095) === "20.95") {
//     console.log("passed");
// } else {
//     console.log("failed")
// }