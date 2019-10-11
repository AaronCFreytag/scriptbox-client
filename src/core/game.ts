import { DebugLogType, log, setDebugLogTypes } from "core/debug-logger";
import GameLoop from "core/game-loop";
import InputHandler from "input/input-handler";
import KeyInputEvent from "input/key-input-event";
import MouseInputEvent from "input/mouse-input-event";
import { ToolType } from "input/tool-type";
import WindowInput from "input/window-input";
import ClientNetEvent, { ClientEventType } from "networking/client-net-event";
import NetworkSystem from "networking/network-system";
import ClientChatMessagePacket from "networking/packets/client-chat-message-packet";
import ClientEntityCreationPacket from "networking/packets/client-entity-creation-packet";
import ClientEntityDeletionPacket from "networking/packets/client-entity-deletion-packet";
import ClientEntityInspectionPacket from "networking/packets/client-entity-inspection-packet";
import ClientExecuteScriptPacket from "networking/packets/client-execute-script-packet";
import ClientKeyboardInputPacket from "networking/packets/client-keyboard-input-packet";
import ClientModifyMetadataPacket from "networking/packets/client-modify-metadata-packet";
import ClientRemoveComponentPacket from "networking/packets/client-remove-component-packet";
import ClientTokenRequestPacket from "networking/packets/client-token-request-packet";
import ServerChatMessagePacket from "networking/packets/server-chat-message-packet";
import ServerConnectionPacket from "networking/packets/server-connection-packet";
import ServerDisconnectionPacket from "networking/packets/server-disconnection-packet";
import ServerDisplayPacket from "networking/packets/server-display-packet";
import ServerEntityInspectionListingPacket from "networking/packets/server-entity-inspection-listing-packet";
import ServerResourceListingPacket from "networking/packets/server-resource-listing-packet";
import ServerTokenPacket, { TokenType } from "networking/packets/server-token-packet";
import ResourceAPIInterface from "networking/resource-api-interface";
import ScreenRenderer from "rendering/screen-renderer";
import UIManager from "ui/ui-manager";

/**
 * The base class of the game. Contains all of the systems necessary to run the game, and the game loop.
 *
 * @export
 * @class Game
 */
export default class Game {
    private _windowInput: WindowInput;
    private _screenRenderer: ScreenRenderer;
    private _inputHandler: InputHandler;
    private _uiManager: UIManager;
    private _networkSystem: NetworkSystem;
    private _gameLoop: GameLoop;
    private _resourceAPIInterface: ResourceAPIInterface;
    private _resourceAPIURL: string;
    /**
     * Creates an instance of Game.
     * This will take in different parameters depending on whether it's running through electron or browser.
     * @param {WindowInput} windowInput The type of WindowInput to use.
     * @memberof Game
     */
    constructor(
            windowInput: WindowInput,
            screenRenderer: ScreenRenderer,
            uiManager: UIManager,
            fileSender: ResourceAPIInterface) {
        setDebugLogTypes([]);
        this._windowInput = windowInput;
        this._screenRenderer = screenRenderer;
        this._inputHandler = new InputHandler();
        this._networkSystem = new NetworkSystem({address: "ws://localhost:7777"});
        this._uiManager = uiManager;
        this._resourceAPIInterface = fileSender;
        this._resourceAPIURL = "http://localhost:7778";
        this._hookupInputs();
        this._networkSystem.netEventHandler.addConnectionDelegate((packet: ServerConnectionPacket) => {
            console.log("Connected to server.");
        });
        this._networkSystem.netEventHandler.addDisconnectionDelegate((packet: ServerDisconnectionPacket) => {
            console.log("Disconnected from server.");
        });
        this._networkSystem.netEventHandler.addChatMessageDelegate((packet: ServerChatMessagePacket) => {
            console.log("Received message: " + packet.message);
            this._uiManager.addChatMessage(packet.message);
        });
        this._networkSystem.netEventHandler.addDisplayDelegate((packet: ServerDisplayPacket) => {
            for (const renderObject of packet.displayPackage) {
                this._screenRenderer.updateRenderObject(
                    renderObject
                );
            }
            this._inputHandler.updateClickableEntities(packet.displayPackage);
        });
        this._networkSystem.netEventHandler.addTokenDelegate((packet: ServerTokenPacket) => {
            if (packet.tokenType === TokenType.FileUpload || packet.tokenType === TokenType.FileDelete) {
                this._resourceAPIInterface.supplyToken(packet.token, packet.tokenType);
            }
        });
        this._networkSystem.netEventHandler.addResourceListingDelegate((packet: ServerResourceListingPacket) => {
            this._uiManager.setResourceList(packet.resources);
        });
        this._networkSystem.netEventHandler.addEntityInspectListingDelegate(
                (packet: ServerEntityInspectionListingPacket) => {
            this._uiManager.setEntityData(packet.components, packet.entityID);
        });
        this._uiManager.onPlayerMessageEntry = (message: string) => {
            console.log("Sent message: " + message);
            const packet = new ClientChatMessagePacket(message);
            this._networkSystem.queue(
                new ClientNetEvent(ClientEventType.ChatMessage, packet)
            );
        };
        this._uiManager.onToolChange = (tool: ToolType) => {
            this._inputHandler.setTool(tool);
        };
        this._uiManager.onResourceUpload = (files: FileList, resourceID?: string) => {
            this._resourceAPIInterface.send(files, this._resourceAPIURL, resourceID);
        };
        this._uiManager.onResourceDelete = (resourceID: string) => {
            this._resourceAPIInterface.delete(resourceID, this._resourceAPIURL);
        };
        this._uiManager.onScriptRun = (resourceID: string, args: string, entityID?: string) => {
            this._networkSystem.queue(
                new ClientNetEvent(
                    ClientEventType.ExecuteScript,
                    new ClientExecuteScriptPacket(resourceID, args, entityID)
                )
            );
        };
        this._uiManager.onResourceInfoModify = (resourceID: string, attribute: string, value: string) => {
            this._networkSystem.queue(
                new ClientNetEvent(
                    ClientEventType.ModifyMetadata,
                    new ClientModifyMetadataPacket(resourceID, attribute, value)
                )
            );
        };
        this._uiManager.onComponentDelete = (componentID: string) => {
            this._networkSystem.queue(
                new ClientNetEvent(
                    ClientEventType.RemoveComponent,
                    new ClientRemoveComponentPacket(componentID)
                )
            );
        };
        this._resourceAPIInterface.onTokenRequest = (tokenType: TokenType) => {
            const packet = new ClientTokenRequestPacket(tokenType);
            this._networkSystem.queue(
                new ClientNetEvent(ClientEventType.TokenRequest, packet)
            );
        };
        this._gameLoop = new GameLoop(this._tick.bind(this), 60);
    }

    /**
     * Start the game.
     *
     * @memberof Game
     */
    public start() {
        // Connecting on startup is temporary until there are menus.
        this._networkSystem.connect();
        this._gameLoop.start();
    }

    /**
     * Perform one game tick.
     *
     * @private
     * @memberof Game
     */
    private _tick() {
        this._screenRenderer.update();
        this._uiManager.render();
        if (this._networkSystem.connected) {
            this._networkSystem.sendMessages();
        }
    }

    private _hookupInputs() {
        this._windowInput.onKeyPressed = (event: KeyInputEvent) => {
            this._inputHandler.handleKeyPress(event);
        };
        this._windowInput.onKeyReleased = (event: KeyInputEvent) => {
            this._inputHandler.handleKeyRelease(event);
        };
        this._windowInput.onMousePressed = (event: MouseInputEvent) => {
            this._inputHandler.handleMousePress(event);
        };
        this._windowInput.onMouseReleased = (event: MouseInputEvent) => {
            this._inputHandler.handleMouseRelease(event);
        };
        this._windowInput.onMouseMoved = (event: MouseInputEvent) => {
            this._inputHandler.handleMouseMove(event);
        };
        this._inputHandler.onKeyPress = (event: KeyInputEvent) => {
            const packet = new ClientKeyboardInputPacket(event.key, event.state, event.device);
            this._networkSystem.queue(
                new ClientNetEvent(ClientEventType.Input, packet)
            );
        };
        this._inputHandler.onKeyRelease = (event: KeyInputEvent) => {
            const packet = new ClientKeyboardInputPacket(event.key, event.state, event.device);
            this._networkSystem.queue(
                new ClientNetEvent(ClientEventType.Input, packet)
            );
        };
        this._inputHandler.onPlace = (prefabID: string, x: number, y: number) => {
            const packet = new ClientEntityCreationPacket(prefabID, x, y);
            this._networkSystem.queue(
                new ClientNetEvent(ClientEventType.EntityCreation, packet)
            );
        };
        this._inputHandler.onErase = (id: string) => {
            const packet = new ClientEntityDeletionPacket(id);
            this._networkSystem.queue(
                new ClientNetEvent(ClientEventType.EntityDeletion, packet)
            );
        };
        this._inputHandler.onEdit = (id: string | undefined) => {
            const packet = new ClientEntityInspectionPacket(id);
            this._networkSystem.queue(
                new ClientNetEvent(ClientEventType.EntityInspection, packet)
            );
            this._uiManager.inspect(id);
        };
    }
}
