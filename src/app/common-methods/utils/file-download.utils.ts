import { saveAs } from 'file-saver';
/**
 * Saves a file to the user's system.
 * @param blob The Blob object representing the file data.
 * @param fileName The name for the downloaded file.
 */
export function saveFile(blob: Blob, fileName: string): void {
  saveAs(blob, fileName);
}
/**
 * Converts a JSON object to a Blob.
 * @param data The JSON object.
 * @returns A Blob object.
 */
export function jsonToBlob(data: any): Blob {
  const json = JSON.stringify(data);
  return new Blob([json], { type: 'application/json' });
}

export function byteArrayToBlob(byteArray: Uint8Array, mimeType: string): Blob {
  const copy = byteArray.slice();
  return new Blob([copy.buffer as ArrayBuffer], { type: mimeType });
}