const { normalizePhoneNumber } = require("./phoneUtils"); // Import the function

// Define test cases
const testCases = [
    { phone: "8509600004", region: "IN", expected: "+918509600004" }, // Local number in India
    { phone: "+918509600004", region: "IN", expected: "+918509600004" }, // Already normalized
    { phone: "12345", region: "IN", expected: null }, // Invalid number
    { phone: "", region: "IN", expected: null }, // Empty input
    { phone: null, region: "IN", expected: null }, // Null input
    { phone: "+18509600004", region: "US", expected: "+18509600004" }, // US number
    { phone: "18509600004", region: "US", expected: "+18509600004" }, // US number without "+"
    { phone: "8509600004", region: "XX", expected: null }, // Invalid region code
];

// Test and log results
testCases.forEach(({ phone, region, expected }, index) => {
    const result = normalizePhoneNumber(phone, region);
    console.log(`Test Case ${index + 1}:`, result === expected ? "Passed" : `Failed (Got: ${result}, Expected: ${expected})`);
});