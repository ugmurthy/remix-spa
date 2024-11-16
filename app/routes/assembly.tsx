import AudioAssembly from "~/components/AudioAssembly";

export default function Assembly() {
let url = 'wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000';
// @TODO fetch token from assembly AI using clientLoader and clieantLoader
const token="7676d31af9f1a70061cb6f78ac96041738a1ed7102e0bdc69e40bed76bf9c19c"
url = url+`&token=${token}`
console.log("URL :",url)
    return (
        <div>
            <AudioAssembly url={url} />
        </div>
    )
}