# Sockbag Texture Ripper

Successor of the Shoebox Texture Ripper.

Built with 💕 using [SolidJS](https://docs.solidjs.com).

## Usage
> [!NOTE]
> This section will be updated once the application is fully developed.

Upload an image, draw rectangles, view the result, and download the texture.

The top rectangle is the uploaded image. Draw quads on the image to crop the texture. Press left click to add points, right click to remove the last point. Hold space to pan the image. Use the mouse wheel to zoom in and out.

The bottom rectangle is the texture. The texture slices will be projected onto the rectangles. Rectangles have a width of a top side of the quad (marked by red arrow) and height of smaller adjacent side.
Press the "Download" button to download the texture.

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
