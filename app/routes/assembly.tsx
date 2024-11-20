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
const token="ebbceb1a2e2f045695385c733837f7dc029f25b07ab669596606e87e163947dd"
//console.log(token);
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