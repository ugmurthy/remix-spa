import React from 'react'
const isRecording = false;
const isOPEN = true;

function handleStartRecording() {}
function handleStopRecording() {}

const className={`btn btn-circle btn-lg ${
    isRecording ? 'btn-error' : 'btn-primary'
} ${(!isOPEN && !isRecording)? 'loading' : ''}`}

function Test() {
  return (
    <div>
    <div>
        <div className="flex gap-4 mb-6">
          <button 
            className={`btn btn-md gap-2 ${isRecording ? 'btn-error' : 'btn-primary'}`}
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
        </div>
    </div>
    <div>

    </div>
    <button
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              disabled={!isOpen}
              className={`btn btn-circle btn-lg ${
                isRecording ? 'btn-error' : 'btn-primary'
              } ${!isOpen ? 'loading' : ''}`}
            >
              {!isOpen && (
                <span className="text-2xl">
                  {isRecording ? '◼' : '●'}
                </span>
              )}
            </button>
    </div>
)
}

export default Test