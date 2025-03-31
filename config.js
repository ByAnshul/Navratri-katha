// Configuration with API key
//window.GOOGLE_API_KEY = 'AIzaSyBr222VbzGz1RtC6nXBaPLC2WB4YBdn3_0000';

// Export the configuration
window.loadConfig = async function () {
    return {
        GOOGLE_API_KEY: window.GOOGLE_API_KEY
    };
}; 