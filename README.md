# Sockbag Texture Ripper

Built with 💕 using [SolidJS](https://docs.solidjs.com).

Inspired by [Texture Ripper](https://renderhjs.net/shoebox/textureRipper.htm) by [Hendrik-Jan Schoenmaker](https://www.renderhjs.net/).

## Usage
> [!NOTE]
> This section may be incomplete and will be updated during app development.

Upload an image, draw rectangles, view the result, and download the texture.

The *left region* is the uploaded image. Draw quads on the image to crop the texture. Press left click to add points, right click to remove the last point. **Hold** space and move the mouse to pan the image. **Hold** space and scroll the mouse wheel to zoom in and out.

The *right region* is the texture. The texture slices will be projected onto the rectangles. Rectangles have a width of a top side of the quad (marked by red arrow) and height of smaller adjacent side.
Press the "Download" button to download the texture.
**Hold** space and move the mouse to pan the image. **Hold** space and scroll the mouse wheel to zoom in and out.

## Dev usage
```bash
$ npm install
```

In the project directory, you can run:

### `npm run dev`
Runs the app in the development mode.<br>
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### `npm run build`
Builds the app for production to the `dist` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

### Deployment
Learn more about deploying your application with the [documentations](https://vitejs.dev/guide/static-deploy.html).
