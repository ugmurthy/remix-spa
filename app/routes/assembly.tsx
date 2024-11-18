import AudioAssembly from "~/components/AudioAssembly";
// import { useLoaderData } from "@remix-run/react";
// import {getAssemblyToken} from "~/modules/assembly.server"

// export async function loader() {
//     // fetch token from assembly AI
//     const token = await getAssemblyToken();
//     return token;
//   }
  

// @TODO fetch token from assembly AI using clientLoader and clieantLoader
export default function Assembly() {
//const token = useLoaderData();
const token="28f764096bdd74d482f8e5e638c3ca8fdbc82f62ce953e75262b86347336c1da"
console.log(token);
    let url = 'wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000';

// @TODO fetch token from assembly AI using clientLoader and clieantLoader

url = url+`&token=${token}`
console.log("URL :",url)
    return (
        <div>
            <AudioAssembly url={url} />
        </div>
    )
}