import apiClient from "../config/apiClient";
import { TokenService } from "./TokenServices";

export class AuthService{
   public static async ValidateUserName(userName:string){
    try {
        const response = await apiClient.post('v1/auth/validate-username',{userName})
        return response
      } catch (error: any) {
        throw new Error(error || 'Sign-up failed. Please try again.')
      }
   }
   public static async SignUp(formData:any){
    try {
      console.log(formData)
        const response = await apiClient.post('v1/auth/register',formData)
        return response
      } catch (error: any) {
        throw new Error(error || 'Sign-up failed. Please try again.')
      }
   }
   public static async SignIn(formData: any) {
    try {
      console.log("Sending login data:", formData);
      const response = await apiClient.post('v1/auth/login', formData);
      return response;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Sign-in failed. Please try again."
      );
    }
  }

   public static async SendOtp(email: string) {
    try {
      const response = await apiClient.post('v1/auth/send-otp', { email });
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Failed to send OTP.";
      throw new Error(errorMessage); 
    }
  }
  public static async refreshAccessToken() {
    const res = await apiClient.post('/v1/auth/refresh-token');
    const { accessToken } = res.data;
  
    TokenService.setAccessToken(accessToken)   
     return accessToken;
  };

  public static async UpdateProfile(formData:any){ 
    try {
      const token = TokenService.getAccessToken();
      const response = apiClient.put('/v1/auth/update-profilepicture',formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })
      console.log(response)
      return response
    } catch (error:any) {
      throw new Error(
        error.response.data.message
      )
    }
  }
}