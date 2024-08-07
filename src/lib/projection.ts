import { QuadPoints } from "@/store/editor";
import cv from "@techstark/opencv-js";
import { v } from "./vector";

export function projectRectangles(
  image: HTMLImageElement,
  quads: QuadPoints[]
): HTMLCanvasElement[] {
  const src = cv.imread(image);
  const canvases: HTMLCanvasElement[] = [];

  for (const quad of quads) {
    const [p1, p2, p3, p4] = quad;
    const points = [p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y];
    const srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, points);

    const top = [p1, p2];
    const right = [p2, p3];
    const left = [p1, p4];

    const W = v.length(v.fromTo(top[0], top[1]));
    const H = Math.min(
      v.length(v.fromTo(left[0], left[1])),
      v.length(v.fromTo(right[0], right[1]))
    );

    const dst = new cv.Mat();
    const dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, W, 0, W, H, 0, H]);

    const transform = cv.getPerspectiveTransform(srcTri, dstTri);
    const dsize = new cv.Size(W, H);
    cv.warpPerspective(
      src,
      dst,
      transform,
      dsize,
      cv.INTER_LINEAR,
      cv.BORDER_CONSTANT
    );

    const canvas = document.createElement("canvas");
    cv.imshow(canvas, dst);

    canvases.push(canvas);
  }

  return canvases;
}

export async function toBlobs(canvases: HTMLCanvasElement[]) {
  const blobs: Blob[] = [];

  for (const canvas of canvases) {
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve)
    );
    if (!blob) throw new Error("Failed to extract image rectangle.");
    blobs.push(blob);
  }

  return blobs;
}
