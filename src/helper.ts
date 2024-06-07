export async function createImageSource(url: string) {
  const image = new Image();
  image.src = url;

  await new Promise((resolve) => {
    image.onload = resolve;
  });

  return image;
}
