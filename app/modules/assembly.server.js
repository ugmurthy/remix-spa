
const BASEURL = "https://api.assemblyai.com/v2/";
const APIKEY = process.env.ASSEMBLY_API_KEY;

const headers = {
    authorization: APIKEY,
    "content-type": "application/json",
};
const TOKEN= 'realtime/token'
export async function getAssemblyToken() {
    const url = BASEURL + TOKEN;
    const response = await fetch(url, {
        method: "GET",
        headers: headers,
    });
    if (response.status !== 200) {
        throw new Error("Failed to get AssemblyAI token");  
        }
    const data = await response.json();
    return data.token;
}