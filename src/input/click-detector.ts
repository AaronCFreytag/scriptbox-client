import _ from "lodash";
import Camera from "rendering/camera";
import RenderObject from "resource-management/render-object";

export default class ClickDetector {
    public clickableObjects: Map<string, RenderObject>;
    constructor() {
        this.clickableObjects = new Map<string, RenderObject>();
    }
    public clickObjects(camera: Camera, x: number, y: number): RenderObject[] {
        const objs = Array.from(this.clickableObjects.values());
        return _.transform(objs, (acc, clickable) => {
            const transformedTopLeft = camera.transform(
                clickable.position.x,
                clickable.position.y
            );
            const transformedBottomRight = camera.transform(
                clickable.position.x + clickable.textureSubregion.width * clickable.scale.x,
                clickable.position.y + clickable.textureSubregion.height * clickable.scale.y
            );

            if (transformedBottomRight.x < transformedTopLeft.x) {
                const tmp = transformedBottomRight.x;
                transformedBottomRight.x = transformedTopLeft.x;
                transformedTopLeft.x = tmp;
            }

            if (transformedBottomRight.y < transformedTopLeft.y) {
                const tmp = transformedBottomRight.y;
                transformedBottomRight.y = transformedTopLeft.y;
                transformedTopLeft.y = tmp;
            }

            if (x >= transformedTopLeft.x && x < transformedBottomRight.x
                    && y >= transformedTopLeft.y && y < transformedBottomRight.y) {
                acc.push(clickable);
            }
        }, [] as RenderObject[])
            .reverse()
            .sort((a, b) => a.depth - b.depth);
    }
    public updateClickableObjects(objects: RenderObject[]) {
        for (const object of objects) {
            if (object.deleted) {
                this.clickableObjects.delete(object.id);
            }
            else {
                this.clickableObjects.set(object.id, object);
            }
        }
    }
}
