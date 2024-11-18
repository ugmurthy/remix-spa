import { useState, useEffect, useCallback, useRef } from 'react';
import { Mic, Square, Trash } from 'lucide-react';
import {createMicrophone} from '../modules/microphone'

import WordDisplay from './WordsDisplay';
import ShowData from './ShowData'

const AudioAssembly = ({url}) => {
    const samples=false;
    const [messages, setMessages] = useState([]);
    //const [inputMessage, setInputMessage] = useState("");
    const wsRef = useRef(null); //  persist WebSocket instance
    const [isOPEN,setIsOPEN] = useState(false)
    //const isOPEN = wsRef.current && wsRef.current.readyState === WebSocket.OPEN
    const terminate = {"terminate_session": true};
    const [isRecording, setIsRecording] = useState(false);
    const [audioSamples, setAudioSamples] = useState([]);
    const [microphone, setMicrophone] = useState(null);
    const [error, setError] = useState(null);
    const containerRef = useRef();
    const isConnecting = !isOPEN && !isRecording && messages.length === 0;
    const reConnect = !isOPEN && !isRecording && messages.length > 0;
///
useEffect(() => {
    let dataJSON={}
    if (!url) {
      console.error("WebSocket URL is required");
      return;
    }

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
        setIsOPEN(true);
      console.log("WebSocket connection established");
    };


    ws.onmessage = (event) => {
      try {
        dataJSON = JSON.parse(event.data);
         }
      catch{
        console.error("Error parsing JSON:", error);
      }
      setMessages((prevMessages) => [...prevMessages, dataJSON]);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      setIsOPEN(false);
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
        setIsOPEN(false); // connection will be closed by assembly.ai
      }
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages.length]); // Re-run effect whenever 'texts' changes

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
      setIsOPEN(false); // connection will be closed by assembly.ai
    }
  }, [microphone]);

  const clearSamples = useCallback(() => {
    //setAudioSamples([]);
    //setMessages([]);
    //wsRef.current.close(); // close socket connection
    document.location.reload();
  }, []);
 // <div className="card w-full max-w-2xl mx-auto bg-base-100 shadow-xl"></div>

 console.log("AudioAssembly : ",isOPEN, isRecording, (!isOPEN && !isRecording));
  return (
    <div className="flex flex-col justify-center w-full max-w-6xl mx-auto bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="rounded-t-lg  w-full h-48 bg-cover bg-center bg-no-repeat bg-opacity-80" style={{"backgroundImage": "url('/bg.webp')"}}>

        <h2 className="pt-20 text-center  text-6xl text-gray-50 font-bold mb-6">SpeechScope</h2>
        </div>
    </div>
       
        <div className="flex flex-col items-center gap-6">
            <button
                        onClick={isRecording ? handleStopRecording : handleStartRecording}
                        disabled={isConnecting}
                        className={`btn btn-circle btn-lg ${
                            isRecording ? 'btn-error' : 'btn-primary'
                        } ${isConnecting ? 'loading' : ''}`}
                        >
                        {!isConnecting && (
                            <span className="text-2xl">
                            {isRecording ? '◼' : '●'}
                            </span>
                        )}
            </button>
            {reConnect?<button onClick={clearSamples} className="btn btn-link  btn-accent">ReConnect</button>:""}
               {/*STATUS */}
               <div className='flex space-x-2 items-center'>
            <span className="badge badge-primary badge-sm">{messages.length}</span>
            { (!isOPEN && !isRecording) ? <span className="badge badge-sm badge-accent">Disconnected</span> : <span className="badge badge-sm badge-secondary">Connected</span> }
            </div>
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
         
          </div>
          <div ref={containerRef} className="p-4 max-h-96 overflow-y-auto rounded-box border border-base-300">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-base-content/60">
                Click &quot Start Recording &quot to begin.
              </div>
            ) : (
                <ul>
                {<ShowData data={messages} label="Messages"></ShowData>}
                { !samples &&
                messages.map((message, index) => (
                    <li key={index}>
                        <WordDisplay  words={message.words}/>    
                     </li>
  
                  ))
                }
                
              </ul>
            )}
          </div>

        </div>
      </div>
    
  );
};

export default AudioAssembly;


/*
{samples &&  messages.map((message, index) => (
                  <li className="font-semibold font-mono text-xs" key={index}>{JSON.stringify(message)}</li>
                ))}
*/