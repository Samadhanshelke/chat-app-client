import apiClient from "../config/apiClient";
import { TokenService } from "./TokenServices";

export class UserServices{

    public static async getAllUsers() {
        try {
          const token = TokenService.getAccessToken();
      
          const res = await apiClient.get('/v1/users', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      
          console.log(res.data); // Optional: Debug log
          return res.data;
        } catch (error) {
          console.error('Error fetching users:', error);
          throw error; // 👈 Let the calling code handle it if needed
        }
      }
      

}