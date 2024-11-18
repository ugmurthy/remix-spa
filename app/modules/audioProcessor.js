// CODE Generated using CLAUDE 3.5 Sonnet
/*
My prompt: 
1) I have an array of array buffers relating to chunks of streaming audio.
   How can I combine this to a single audio object and get it ready 
   to POST it as an octet stream for transcription. 
   Generate a js function
2) I would like to play the audio before POST generate 
   the requisite code to play the combined audio
3) Refactor code to use async/await 
*/

/**
 * Combines an array of AudioBuffer chunks into a single Blob ready for transmission
 * @param {ArrayBuffer[]} audioChunks - Array of audio chunk buffers
 * @returns {Blob} Combined audio data as a Blob with octet-stream MIME type
 */
export function combineAudioChunks(audioChunks) {
    // Calculate total length of all chunks
    const totalLength = audioChunks.reduce((total, chunk) => total + chunk.byteLength, 0);
    console.log("f(combineAudioChunks): Total length of audio chunks(samples): ", totalLength);
    // Create a new ArrayBuffer to hold all the data
    const combinedBuffer = new ArrayBuffer(totalLength);
    
    // Create a view to write into the new buffer
    const view = new Uint8Array(combinedBuffer);
    
    // Copy each chunk into the combined buffer
    let offset = 0;
    for (const chunk of audioChunks) {
        view.set(new Uint8Array(chunk), offset);
        offset += chunk.byteLength;
    }
    
    // Create and return a Blob with the appropriate type
    return new Blob([combinedBuffer], { type: 'audio/webm; codecs=opus' });
}
/* export function combineAudioChunks(audioChunks) {
    return new Blob(audioChunks, { type: 'audio/webm; codecs=opus' });
} */
/**
 * Creates an audio element and prepares it for playback
 * @param {ArrayBuffer[]} audioChunks - Array of audio chunk buffers
 * @returns {Promise<HTMLAudioElement>} Audio element that can be controlled
 */
async function createAudioPlayer(audioChunks) {
    try {
        const audioBlob = combineAudioChunks(audioChunks);
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioElement = new Audio(audioUrl);

        await new Promise((resolve, reject) => {
            audioElement.addEventListener('loadeddata', () => resolve());
            audioElement.addEventListener('error', (error) => {
                URL.revokeObjectURL(audioUrl);
                reject(new Error('Error loading audio: ' + error.message));
            });
        });

        return audioElement;
    } catch (error) {
        throw new Error('Error creating audio player: ' + error.message);
    }
}

/**
 * Plays the combined audio
 * @param {ArrayBuffer[]} audioChunks - Array of audio chunk buffers
 * @returns {Promise<void>} Resolves when audio playback is complete
 */
async function playAudio(audioChunks) {
    let audioElement;
    try {
        audioElement = await createAudioPlayer(audioChunks);
        await audioElement.play();
        
        await new Promise((resolve, reject) => {
            audioElement.addEventListener('ended', resolve);
            audioElement.addEventListener('error', (error) => {
                reject(new Error('Playback error: ' + error.message));
            });
        });
    } catch (error) {
        throw new Error('Error playing audio: ' + error.message);
    } finally {
        if (audioElement?.src) {
            URL.revokeObjectURL(audioElement.src);
        }
    }
}

/**
 * Complete workflow: Play audio and then send for transcription
 * @param {ArrayBuffer[]} audioChunks - Array of audio chunk buffers
 * @param {string} url - Server endpoint URL
 * @returns {Promise<Response>} Server response
 */
async function sendAudioForTranscription(audioChunks, url) {
    try {
       
        // Then send for transcription
        const audioBlob = combineAudioChunks(audioChunks);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream'
            },
            body: audioBlob
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response;
    } catch (error) {
        throw new Error('Error in send : ' + error.message);
    }
}

/**
 * Enhanced audio player with controls and status monitoring
 * @param {ArrayBuffer[]} audioChunks - Array of audio chunk buffers
 * @returns {Promise<Object>} Object containing audio element and control functions
 */
async function createEnhancedAudioPlayer(audioChunks) {
    const audioElement = await createAudioPlayer(audioChunks);
    
    return {
        audioElement,
        async play() {
            await audioElement.play();
        },
        pause() {
            audioElement.pause();
        },
        stop() {
            audioElement.pause();
            audioElement.currentTime = 0;
        },
        setVolume(value) {
            audioElement.volume = Math.max(0, Math.min(1, value));
        },
        setPlaybackRate(value) {
            audioElement.playbackRate = value;
        },
        getCurrentTime() {
            return audioElement.currentTime;
        },
        getDuration() {
            return audioElement.duration;
        },
        cleanup() {
            if (audioElement.src) {
                URL.revokeObjectURL(audioElement.src);
            }
        }
    };
}