import { useState, useEffect, useCallback, useRef } from 'react';
import { Mic, Square, Trash } from 'lucide-react';
import {createMicrophone} from '../modules/microphone'


const AudioAssembly = ({url}) => {

    const [messages, setMessages] = useState([]);
    //const [inputMessage, setInputMessage] = useState("");
    const wsRef = useRef(null); //  persist WebSocket instance
    const isOPEN = wsRef.current && wsRef.current.readyState === WebSocket.OPEN
    const terminate = {"terminate_session": true};
    const [isRecording, setIsRecording] = useState(false);
    const [audioSamples, setAudioSamples] = useState([]);
    const [microphone, setMicrophone] = useState(null);
    const [error, setError] = useState(null);

///
useEffect(() => {
    if (!url) {
      console.error("WebSocket URL is required");
      return;
    }

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Cleanup function
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        console.log("Closing WebSocket connection");
        ws.close();
      }
    };
  }, [url]);

  const sendMessage = (message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(message);
    } else {
      console.error("WebSocket is not open. Unable to send message.");
    }
  };

///



  useEffect(() => {
    const mic = createMicrophone();
    setMicrophone(mic);

    return () => {
      if (mic) {
        mic.stopRecording();
        // send {"terminate_session":true} to socket connection
        sendMessage(JSON.stringify(terminate));
      }
    };
  }, []);

  const handleStartRecording = useCallback(async () => {
    try {
      if (!microphone) return;

      await microphone.requestPermission();
      await microphone.startRecording((audioBuffer) => {
        setAudioSamples((prev) => [...prev, audioBuffer]);
        sendMessage(audioBuffer); // send audioBuffer to socket connection
       
      });
      setIsRecording(true);
      setError(null);
    } catch (err) {
      setError('Failed to start recording: ' + err.message);
      setIsRecording(false);
      sendMessage(JSON.stringify(terminate));
    }
  }, [microphone]);

  const handleStopRecording = useCallback(() => {
    if (microphone) {
      microphone.stopRecording();
      setIsRecording(false);
      //  send {"terminate_session":true} to socket connection
      sendMessage(JSON.stringify(terminate));
    }
  }, [microphone]);

  const clearSamples = useCallback(() => {
    setAudioSamples([]);
  }, []);

  return (
    <div className="card w-full max-w-2xl mx-auto bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold mb-6">Audio Transcript</h2>
        
        <div className="flex gap-4 mb-6">
          <button 
            className={`btn btn-lg gap-2 ${isRecording ? 'btn-error' : 'btn-primary'}`}
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            disabled={!isOPEN}
          >
            {isRecording ? (
              <>
                <Square className="w-5 h-5" />
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                Start Recording
              </>
            )}
          </button>
          
          <button 
            className="btn btn-lg btn-outline gap-2"
            onClick={clearSamples}
            disabled={isRecording || messages.length === 0}
          >
            <Trash className="w-5 h-5" />
            Clear Samples
          </button>
        </div>

        {error && (
          <div className="alert alert-error mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <div className="text-lg font-semibold flex items-center gap-2">
            <span> Samples:</span>
            <div className="badge badge-primary badge-lg">{messages.length}</div>
          </div>
          
          <div className="max-h-96 overflow-y-auto rounded-box border border-base-300">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-base-content/60">
                Click &quot Start Recording &quot to begin.
              </div>
            ) : (
                <ul>
                {messages.map((message, index) => (
                  <li key={index}>{message}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioAssembly;