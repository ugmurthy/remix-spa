// eslint-disable-next-line no-unused-vars
import _ from 'lodash'

// given a Partial transcript, return key stats
export function analysePartial(partial) {
    if (!partial.message_type.includes("Partial") || partial.text==='') {
        return null;
    }
    const start = partial.audio_start
    const end = partial.audio_end
    const duration = (end-start)
    const wc = partial.text.trim().split(/\s+/).length;
    const wpm = Math.floor(wc/(duration/1000/60)); // words/minute);
    return {duration,wc,wpm}
}

// clean up the transcript data
// looks only at Partial transcripts
// return 2 arrays and a duration and words per minute
// 1. array of two elments [index,start_time]
// 2. array of word counts per line of text
// 3. duration of the transcript in minutes
// 4. wordsper minute
// [ida,wc,duration,wpm]
export function analyseAllData(data,msgIncludes="Partial") {
    let idx={}
    let wc=0;
    for (let i=0;i<data.length;i++) {
        const msgType = data[i]["message_type"]
        if (msgType.includes(msgIncludes)) {
            var start = data[i]["audio_start"]
            idx[start]=i
        }
    }
    if (Object.keys(idx).length===0){
          console.log("No partial transcripts found");
          return [[],[],0]
        }
    const ida=[];
    _.forEach(idx, (value, key) => {ida.push([value,key])});

    const startTime = data[ida[0][0]]["audio_start"]
    const endTime =  data[ida[ida.length-1][0]]["audio_end"]
    const duration = (endTime-startTime)/1000/60; // minutes
    // get word count per line of text
    // if text is '' then it returns a 1 : TO FIX later
    wc=ida.map((i)=>data[i[0]].text.trim().split(/\s+/).length)
    const tot_wc = _.sum(wc); // total word count
    const wpm = Math.floor(tot_wc/duration); // words/minute
    return [ida,wc,duration,wpm]
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
  