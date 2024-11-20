export function downloadArrayBuffers(arrayBuffers, filename) {
    try {
        // Validate environment
        if (typeof window === 'undefined') {
            throw new Error('This function is intended for browser use only');
        }

        // Calculate total size needed
        const totalSize = arrayBuffers.reduce((acc, buffer) => acc + buffer.byteLength, 0);
        
        // Create a buffer to store lengths and data
        const headerSize = 4 + (arrayBuffers.length * 4); // 4 bytes for count + 4 bytes per buffer length
        const finalBuffer = new ArrayBuffer(headerSize + totalSize);
        const dataView = new DataView(finalBuffer);
        
        // Write number of buffers
        dataView.setUint32(0, arrayBuffers.length, true);
        
        let offset = 4;
        // Write lengths of each buffer
        arrayBuffers.forEach((buffer) => {
            dataView.setUint32(offset, buffer.byteLength, true);
            offset += 4;
        });
        
        // Write actual buffer data
        arrayBuffers.forEach((buffer) => {
            new Uint8Array(finalBuffer, offset, buffer.byteLength).set(new Uint8Array(buffer));
            offset += buffer.byteLength;
        });

        // Create and trigger download
        const blob = new Blob([finalBuffer], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || 'arrayBuffers.dat';
        
        // Append link to body, click it, and remove it
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the URL object
        setTimeout(() => URL.revokeObjectURL(url), 100);

    } catch (error) {
        throw new Error(`Failed to download array buffers: ${error.message}`);
    }
}
