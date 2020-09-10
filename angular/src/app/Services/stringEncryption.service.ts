import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StringEncryptionService {
  CryptoJS = require('crypto-js');
public encryptAES(message: string, password: string) {
  return this.CryptoJS.AES.encrypt(message, password).toString();
}
public decryptAES(message: string, password: string) {
  return this.CryptoJS.enc.Utf8.stringify(this.CryptoJS.AES.decrypt(message, password));
}

  public encryptSha(message: string) {
    const sha512 = this.sha512Encrypt(message);
    const sha384 = this.sha384Encrypt(sha512);
    return this.sha256Encrypt(sha384);
  }

  private sha256Encrypt(message: string) {
    const stringVal = message;
    // Convert the string to UTF 16 little-endian
    const utf16le = this.CryptoJS.enc.Utf16LE.parse(stringVal);
    // Convert to Sha256 format and get the word array
    const utf16Sha256 = this.CryptoJS.SHA256(utf16le);
    // Convert the Sha256 to hex (if i'm not mistaken, it's base 16) format
    const hexSha256 = utf16Sha256.toString(this.CryptoJS.enc.hex);
    return hexSha256.toLowerCase();
    }

    private sha384Encrypt(message: string) {
      const stringVal = message;
      // Convert the string to UTF 16 little-endian
      const utf16le = this.CryptoJS.enc.Utf16LE.parse(stringVal);
      // Convert to Sha384 format and get the word array
      const utf16Sha384 = this.CryptoJS.SHA384(utf16le);
      // Convert the Sha384 to hex (if i'm not mistaken, it's base 16) format
      const hexSha384 = utf16Sha384.toString(this.CryptoJS.enc.hex);
      return hexSha384.toLowerCase();
      }

      private sha512Encrypt(message: string) {
        const stringVal = message;
        // Convert the string to UTF 16 little-endian
        const utf16le = this.CryptoJS.enc.Utf16LE.parse(stringVal);
        // Convert to Sha512 format and get the word array
        const utf16Sha512 = this.CryptoJS.SHA512(utf16le);
        // Convert the Sha512 to hex (if i'm not mistaken, it's base 16) format
        const hexSha512 = utf16Sha512.toString(this.CryptoJS.enc.hex);
        return hexSha512.toLowerCase();
        }
}
