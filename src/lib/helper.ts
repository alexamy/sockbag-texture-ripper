export function tick() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

export async function createImageSource(url: string) {
  const image = new Image();
  image.src = url;

  await new Promise((resolve) => {
    image.onload = resolve;
  });

  return image;
}

export function blobToDataURI(blob: Blob) {
  const reader = new FileReader();
  reader.readAsDataURL(blob);

  return new Promise<string>((resolve) => {
    reader.onload = () => {
      resolve(reader.result as string);
    };
  });
}

export function dataURItoBlob(dataURI: string) {
  // convert base64 to raw binary data held in a string
  const byteString = atob(dataURI.split(",")[1]);

  // separate out the mime component
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to an ArrayBuffer
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const _ia = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    _ia[i] = byteString.charCodeAt(i);
  }

  const dataView = new DataView(arrayBuffer);
  const blob = new Blob([dataView], { type: mimeString });

  return blob;
}
