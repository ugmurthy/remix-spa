// eslint-disable-next-line no-unused-vars
import _ from 'lodash'

// given a Partial transcript, return key stats
export function analysePartial(partial) {
    if (!partial.message_type.includes("Partial") || partial.text==='') {
        return null;
    }
    const start = partial.audio_start
    const end = partial.audio_end
    const duration = (end-start)/1000/60; // minutes
    const wc = partial.text.trim().split(/\s+/).length;
    const wpm = Math.floor(wc/duration);
    return {duration,wc,wpm}
}
export function clean(data) {

    let text={};
    let idx={}
    let wc=0;
    for (let i=0;i<data.length;i++) {
        const msgType = data[i]["message_type"]
        if (msgType.includes("Partial")) {
            var start = data[i]["audio_start"]
            // var t = data[i]["text"]
            // if (msgType.includes("Final")) {
            //     wc = wc+t.trim().split(/\s+/).length;
            // }
            idx[start]=i
        }
    }
    const ida=[];
    _.forEach(idx, (value, key) => {ida.push([value,key])});

    const startTime = data[ida[0][0]]["audio_start"]
    const endTime =  data[ida[ida.length-1][0]]["audio_end"]
    const duration = (endTime-startTime)/1000/60; // minutes
    // get word count per line of text
    // if text is '' then it returns a 1 : TO FIX later
    wc=ida.map((i)=>data[i[0]].text.trim().split(/\s+/).length)
    return [text,ida,wc,duration]
}

// one transcription corresponds to an array of words from
// FinalTranscript message from assembly.ai
// thresholds are in milliseconds
export function analyseTranscriptionForPauses(wordArray, pauseThreshold = 500) {
    // Validate input
    
    if (!Array.isArray(wordArray) || wordArray.length === 0) {
      return { pauses: [], insights: "No data provided." };
    }
    const transcription = _.compact( wordArray);
    //const sentences = transcription.map((w)=>w.text).join(" ");
    const wordConfidences = transcription.map((w)=>[w.text,w.confidence.toFixed(2), w.start,w.end]);
    
    const pauses = [];
    const insights = [];
    let totalPauses = 0;
    let longPauses = 0;
  
    // Iterate through transcription to identify pauses
    for (let i = 1; i < transcription.length; i++) {
      const prevWord = transcription[i - 1];
      const currentWord = transcription[i];
      console.log(i,JSON.stringify(prevWord))
      // Calculate gap between words
      const gap = currentWord.start - prevWord.end;
      console.log(`${i} : ${currentWord.text} - ${prevWord.text} : ${gap}`)  
      // Detect pauses longer than the threshold (ms)
      if (gap > pauseThreshold) {
        pauses.push({
          between: `${prevWord.text} - ${currentWord.text}`,
          pauseDuration: gap.toFixed(2),
        });
  
        totalPauses++;
        if (gap > 1) longPauses++;
      }
    }
  
    // Generate actionable insights
    if (pauses.length > 0) {
      insights.push(
        `Detected ${totalPauses} pauses longer than ${pauseThreshold} seconds.`
      );
  
      if (longPauses > 0) {
        insights.push(
          `Out of these, ${longPauses} pauses were over 1 second. Consider these as potential spots for natural breaks or further analysis.`
        );
      }
    } else {
      insights.push("No significant pauses detected.");
    }
  
    return { wordConfidences, pauses, insights: insights.join(" ") };
  }
  
  // Example JSON input
  const transcription = [
    { text: "Hello", start: 0.0, stop: 0.5, confidence: 0.95 },
    { text: "world", start: 1.0, stop: 1.5, confidence: 0.92 },
    { text: "this", start: 2.0, stop: 2.4, confidence: 0.90 },
    { text: "is", start: 3.5, stop: 3.7, confidence: 0.88 },
    { text: "a", start: 4.0, stop: 4.1, confidence: 0.85 },
    { text: "test", start: 5.5, stop: 6.0, confidence: 0.93 },
  ];
  
  // Usage
  const result = analyseTranscriptionForPauses(transcription, 0.5);
  console.log(result);
  
