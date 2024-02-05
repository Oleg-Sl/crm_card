

export default class FileStorage {
    constructor(secretKey) {
      this.secretKey = secretKey;
    }
  
    async uploadFile(dirPath, fileName, file) {}
  
    async removeFile(dirPath, fileName) {}
  
    async removeDir(dirPath) {}
  
    replaceHttpWithHttps(url) {
      if (url.startsWith("http://")) {
        return url.replace(/^http:\/\//, "https://");
      }
      return url;
    }
  }
  