import api from "./api";

export async function login(data:any){

const response=await api.post(

"/auth/login",

data

);

return response.data;

}