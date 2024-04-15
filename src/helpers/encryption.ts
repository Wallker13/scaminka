import * as CryptoJS from 'crypto-js';

export const encryptData = (data: string) => {
    const bytes = CryptoJS.AES.encrypt(data, process.env.SECRET_KEY);
    const str = bytes.toString();
    const wordArray = CryptoJS.enc.Utf8.parse(str);
    return CryptoJS.enc.Base64url.stringify(wordArray);
}