/**
 * TokenService handles the management of the authentication token
 * by providing methods to set, get, and remove the access token
 * from localStorage with proper format validation.
 */
export class TokenService {
    /**
     * Checks whether the provided token is in a valid JWT format.
     * A valid JWT should consist of three parts separated by dots,
     * and the header and payload should be valid JSON.
     *
     * @param token - The JWT token to validate.
     * @returns True if the token format is valid, false otherwise.
     */
    private static isValidTokenFormat(token: string): boolean {
      if (!token || typeof token !== 'string') return false
      const parts = token.split('.')
      if (parts.length !== 3) return false
  
      try {
        // Decode the header and payload from base64url to JSON
        const decodedHeader = atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'))
        const decodedPayload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
        JSON.parse(decodedHeader)
        JSON.parse(decodedPayload)
        return true
      } catch (error) {
        return false
      }
    }
  
    /**
     * Stores the provided access token in localStorage after validating its format.
     *
     * @param token - The new access token to store.
     * @throws Error if the token format is invalid.
     */
    public static setAccessToken(token: string): void {
      if (token && this.isValidTokenFormat(token)) {
        localStorage.setItem('accessToken', token)
      } else {
        throw new Error('Invalid token format.')
      }
    }
  
    /**
     * Retrieves the stored access token from localStorage if it has a valid format.
     * If the token is invalid, it is removed and null is returned.
     *
     * @returns The stored token if valid, or null otherwise.
     */
    public static getAccessToken(): string | null {
      const token = localStorage.getItem('accessToken')
      if (token && this.isValidTokenFormat(token)) {
        return token
      }
      localStorage.removeItem('accessToken')
      return null
    }
  
    /**
     * Removes the access token from localStorage.
     */
    public static removeAccessToken(): void {
      localStorage.removeItem('accessToken')
    }
  }