const { normalizePhoneNumber } = require("./phoneUtils");

const testCases = [
    { phone: "+918509600008", region: "IN", description: "Valid Indian number with country code" },
    { phone: "8509600008", region: "IN", description: "Valid Indian number without country code" },
    { phone: "12345", region: "IN", description: "Invalid short number" },
    { phone: "", region: "IN", description: "Empty input" },
    { phone: null, region: "IN", description: "Null input" },
    { phone: "+18509600008", region: "US", description: "Valid US number with country code" },
];

testCases.forEach(({ phone, region, description }, index) => {
    console.log(`\nTest Case ${index + 1}: ${description}`);
    const result = normalizePhoneNumber(phone, region);
    console.log("Result:", result);
});