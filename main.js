document.addEventListener('DOMContentLoaded', async function () {
    const speakerButton = document.querySelector('.speaker-button');
    const textElement = document.querySelector('p');
    let isSpeaking = false;
    let audioElement = null;

    // Load configuration
    const config = await window.loadConfig();
    const GOOGLE_API_KEY = config.GOOGLE_API_KEY;
    const API_URL = 'https://texttospeech.googleapis.com/v1/text:synthesize';

    if (!GOOGLE_API_KEY) {
        console.error('Google API Key not found. Please check your configuration.');
        speakerButton.style.display = 'none';
        return;
    }

    if (speakerButton && textElement) {
        speakerButton.addEventListener('click', async function () {
            if (!isSpeaking) {
                try {
                    // Get text and clean it
                    let text = textElement.textContent;
                    text = text.replace(/\s+/g, ' ').trim();

                    // Update button appearance
                    speakerButton.textContent = '⏸️';
                    speakerButton.style.backgroundColor = '#ff4444';
                    isSpeaking = true;

                    // Prepare the request body
                    const requestBody = {
                        input: { text: text },
                        voice: { languageCode: 'hi-IN', ssmlGender: 'FEMALE' },
                        audioConfig: { audioEncoding: 'MP3' }
                    };

                    // Make the API request
                    const response = await fetch(`${API_URL}?key=${GOOGLE_API_KEY}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestBody)
                    });

                    if (!response.ok) {
                        throw new Error('Failed to synthesize speech');
                    }

                    const data = await response.json();
                    const audioContent = data.audioContent;

                    // Create and play audio
                    if (audioElement) {
                        audioElement.pause();
                        audioElement.remove();
                    }

                    audioElement = new Audio(`data:audio/mp3;base64,${audioContent}`);

                    audioElement.onended = function () {
                        speakerButton.textContent = '🔊';
                        speakerButton.style.backgroundColor = '#4ba63b';
                        isSpeaking = false;
                    };

                    audioElement.onerror = function (error) {
                        console.error('Audio playback error:', error);
                        speakerButton.textContent = '🔊';
                        speakerButton.style.backgroundColor = '#4ba63b';
                        isSpeaking = false;
                    };

                    await audioElement.play();
                } catch (error) {
                    console.error('Error in text-to-speech:', error);
                    speakerButton.textContent = '🔊';
                    speakerButton.style.backgroundColor = '#4ba63b';
                    isSpeaking = false;
                }
            } else {
                // If speaking, pause the audio
                if (audioElement) {
                    if (audioElement.paused) {
                        audioElement.play();
                        speakerButton.textContent = '⏸️';
                    } else {
                        audioElement.pause();
                        speakerButton.textContent = '▶️';
                    }
                }
            }
        });
    }
});
