import Packet from "./packet";

export default class ClientSetComponentEnableStatePacket extends Packet {
    public static deserialize(obj: any): ClientSetComponentEnableStatePacket | undefined {
        if (typeof obj === "object" && obj !== null) {
            if (
                    typeof obj.componentID === "string"
                    && typeof obj.enableState === "boolean"
            ) {
                return new ClientSetComponentEnableStatePacket(obj.componentID, obj.enableState);
            }
            return undefined;
        }
    }

    public componentID: string;
    public enableState: boolean;
    constructor(componentID: string, enableState: boolean) {
        super();
        this.componentID = componentID;
        this.enableState = enableState;
    }
    public serialize() {
        return this;
    }
}
