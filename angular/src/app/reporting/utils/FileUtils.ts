import * as JSZip from "jszip";
import mime from "mime";
import {SUPPPORTED_CONTENT_TYPES} from "../models/SupportedContentTypes";

export class FileUtils {

static async getContentTypeFromZip(file: Blob) {
    const zip = new JSZip();
    const content = await zip.loadAsync(file);
    const contentTypesFile = content.files['[Content_Types].xml'];
    const xmlText = await contentTypesFile.async('text');
    if (xmlText.includes(mime.getType(SUPPPORTED_CONTENT_TYPES.Docx) as string)) {
      return SUPPPORTED_CONTENT_TYPES.Docx;
    }
    if (xmlText.includes(mime.getType(SUPPPORTED_CONTENT_TYPES.Xlsx) as string)) {
      return SUPPPORTED_CONTENT_TYPES.Xlsx;
    }
    else return SUPPPORTED_CONTENT_TYPES.Zip;
  }

static base64ToBlob(base64: string) {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays);
  }

  static base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }


}
