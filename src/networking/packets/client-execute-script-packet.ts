import Packet from "./packet";

export default class ClientExecuteScriptPacket extends Packet {
    public static deserialize(obj: any): ClientExecuteScriptPacket | undefined {
        if (typeof obj === "object" && obj !== null) {
            if (
                typeof obj.script === "string"
                && typeof obj.args === "string"
                && typeof obj.entityID === "string" || typeof obj.entityID === "undefined"
            ) {
                console.log(`serialized`);
                return new ClientExecuteScriptPacket(obj.script, obj.args, obj.entityID);
            }
            console.log(`not serialized`);
            console.log(obj);
            return undefined;
        }
    }

    public script: string;
    public args: string;
    public entityID?: string;
    constructor(script: string, args: string, entityID?: string) {
        super();
        this.script = script;
        this.args = args;
        this.entityID = entityID;
    }
    public serialize() {
        return this;
    }
}
