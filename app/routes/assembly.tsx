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
const token="46ac8dac5825c032e3ef96dca58eb884db6992d2ade503c41307b537fbcce160"
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