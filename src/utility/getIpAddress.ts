
import os from 'os';

export const GetIpAddress = ()=>{
    let networkInterfaces = os.networkInterfaces();
    return networkInterfaces.wlp58s0?.find((value)=>value.family === "IPv4")?.address
}