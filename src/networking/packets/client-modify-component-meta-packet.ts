import Packet from "./packet";

export enum MetaType {
    Resource,
    Entity,
    Component
}

export default class ClientModifyComponentMetaPacket extends Packet {
    public static deserialize(obj: any): ClientModifyComponentMetaPacket | undefined {
        if (typeof obj === "object" && obj !== null) {
            if (
                    typeof obj.componentID === "string"
                    && typeof obj.property === "string"
                    && typeof obj.value === "string"
            ) {
                return new ClientModifyComponentMetaPacket(obj.componentID, obj.property, obj.value);
            }
            return undefined;
        }
    }

    public componentID: string;
    public property: string;
    public value: string;
    constructor(componentID: string, property: string, value: string) {
        super();
        this.componentID = componentID;
        this.property = property;
        this.value = value;
    }
    public serialize() {
        return this;
    }
}
