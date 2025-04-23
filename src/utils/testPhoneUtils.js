const { normalizePhoneNumber } = require("./phoneUtils");

const testCases = [
    { input: "8509600004", countryCode: "IN", expected: "+918509600004" },
    { input: "+918509600004", countryCode: "IN", expected: "+918509600004" },
    { input: "12345", countryCode: "IN", expected: null }, // Invalid phone number
    { input: "", countryCode: "IN", expected: null }, // Empty phone number
    { input: null, countryCode: "IN", expected: null }, // Null input
    { input: "+18509600004", countryCode: "US", expected: "+18509600004" },
];

testCases.forEach(({ input, countryCode, expected }, index) => {
    const result = normalizePhoneNumber(input, countryCode);
    console.log(`Test Case ${index + 1}:`, result === expected ? "Passed" : `Failed (Got: ${result}, Expected: ${expected})`);
});