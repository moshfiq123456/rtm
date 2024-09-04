import { jwtDecode } from 'jwt-decode';

export const decodeToken = (token:any): any => {
  
  return jwtDecode(token.split(" ")[1])
};

