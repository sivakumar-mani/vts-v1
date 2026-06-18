/*
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PKCEService {
  // Generates a random integer between min (inclusive) and max (inclusive)
  randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // Generates a code verifier of a specified length
  generateCodeVerifier(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let codeVerifier = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      codeVerifier += characters.charAt(randomIndex);
    }
    return codeVerifier;
  }

  // Computes SHA-256 hash of the input
  async sha256(plain: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return await window.crypto.subtle.digest('SHA-256', data);
  }

  // Encodes a byte array to Base64 URL format
  base64UrlEncode(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = window.btoa(binary);
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  // Generates a code challenge based on a code verifier
  async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const hashedBuffer = await this.sha256(codeVerifier);
    return this.base64UrlEncode(hashedBuffer);
  }

  // Main function to generate verifier and challenge
  async generatePKCE(): Promise<{ codeVerifier: string; codeChallenge: string }> {
    const randomByte = this.randomIntFromInterval(32, 96);
    const codeVerifier = this.generateCodeVerifier(randomByte);
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);

    return { codeVerifier, codeChallenge };
  }
}
*/
// src/app/services/pkce.service.ts

// src/app/services/pkce.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PKCEService {

  // Generates PKCE code verifier and code challenge
  async generatePKCE(): Promise<{ codeVerifier: string; codeChallenge: string }> {
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.sha256(codeVerifier).then(this.base64UrlEncode);
    return { codeVerifier, codeChallenge };
  }

  // Generates a random code verifier string
  private generateCodeVerifier(): string {
    const array = new Uint32Array(56 / 2);
    window.crypto.getRandomValues(array);
    return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
  }

  // Converts the code verifier string into a SHA-256 hash
  private async sha256(plain: string): Promise<ArrayBuffer> {
    // Check if the crypto API is available
    if (!window.crypto || !window.crypto.subtle) {
      throw new Error('Crypto API is not available in this environment.');
    }

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(plain);
      // Perform SHA-256 hashing
      return await window.crypto.subtle.digest('SHA-256', data);
    } catch (error) {
      console.error('An error occurred during SHA-256 hashing:', error);
      throw error; // Rethrow to handle it in the calling function
    }
  }

  // Encodes the hashed output to base64 URL format
  private base64UrlEncode(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    bytes.forEach(b => binary += String.fromCharCode(b));
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
}
