import Packet from "./packet";

export enum MetaType {
    Resource,
    Entity,
    Component
}

export default class ClientModifyMetadataPacket extends Packet {
    public static deserialize(obj: any): ClientModifyMetadataPacket | undefined {
        if (typeof obj === "object" && obj !== null) {
            if (
                    typeof obj.resourceID === "string"
                    && typeof obj.property === "string"
                    && typeof obj.value === "string"
            ) {
                return new ClientModifyMetadataPacket(obj.resourceID, obj.property, obj.value);
            }
            return undefined;
        }
    }

    public resourceID: string;
    public property: string;
    public value: string;
    constructor(resourceID: string, property: string, value: string) {
        super();
        this.resourceID = resourceID;
        this.property = property;
        this.value = value;
    }
    public serialize() {
        return this;
    }
}
