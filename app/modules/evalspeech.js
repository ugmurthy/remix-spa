
export function clean(data) {

    let text={};
    for (let i=0;i<data.length;i++) {
        var msgType=data[i]["message_type"]
        if (msgType.includes("Transcript")) {
            var start = data[i]["audio_start"]
            var t = data[i]["text"]
            text[start]=`${msgType}: ${t}`
        }
    }
    return text
}
