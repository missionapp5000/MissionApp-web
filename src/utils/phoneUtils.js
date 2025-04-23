const libphonenumber = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const PhoneNumberFormat = require('google-libphonenumber').PhoneNumberFormat; // Import PhoneNumberFormat explicitly

/**
 * Normalize phone number to international format.
 * @param {string} phone - The phone number to normalize.
 * @param {string} defaultRegionCode - The default region code (e.g., 'IN' for India).
 * @returns {string|null} - The normalized phone number in E.164 format, or null if invalid.
 */
const normalizePhoneNumber = (phone, defaultRegionCode = "IN") => {
    try {
        // Validate the input
        if (!phone || typeof phone !== "string" || phone.trim() === "") {
            console.error("Invalid input: phone number is empty or not a string.");
            return null; // Return null for invalid input
        }

        console.log(`Attempting to parse phone: "${phone}" with region: "${defaultRegionCode}"`);

        // Parse the phone number using the region code
        const number = libphonenumber.parseAndKeepRawInput(phone, defaultRegionCode);

        if (!number) {
            console.error(`Failed to parse phone number: "${phone}" with region: "${defaultRegionCode}"`);
            return null; // Return null if parsing fails
        }

        console.log("Parsed phone number object:", number);

        // Check if the parsed number is valid
        if (libphonenumber.isValidNumber(number)) {
            const formattedNumber = libphonenumber.format(number, PhoneNumberFormat.E164); // Use PhoneNumberFormat.E164 explicitly
            console.log("Formatted phone number:", formattedNumber);
            return formattedNumber; // e.g., "+918509600004"
        } else {
            console.error("Invalid phone number after parsing or failed validation:", phone);
            return null; // Return null for invalid or unparseable numbers
        }
    } catch (error) {
        console.error(`Error normalizing phone number: "${phone}" with region: "${defaultRegionCode}". Error: ${error.message}`);
        return null; // Return null for errors
    }
};

module.exports = { normalizePhoneNumber };