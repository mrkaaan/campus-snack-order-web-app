import CryptoJS from 'crypto-js'

export function encryptData (data) {
  const AES_KEY = process.env.VUE_APP_AES_KEY
  const AES_IV = process.env.VUE_APP_AES_IV

  const key = CryptoJS.enc.Hex.parse(AES_KEY)
  const iv = CryptoJS.enc.Hex.parse(AES_IV)

  const dataString = typeof data === 'string' ? data : JSON.stringify(data)

  const encrypted = CryptoJS.AES.encrypt(dataString, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }).toString()

  return encrypted
}

export function decryptData (encryptedText) {
  const key = CryptoJS.enc.Hex.parse(process.env.VUE_APP_AES_KEY)
  const iv = CryptoJS.enc.Hex.parse(process.env.VUE_APP_AES_IV)

  const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })

  return decrypted.toString(CryptoJS.enc.Utf8)
}
