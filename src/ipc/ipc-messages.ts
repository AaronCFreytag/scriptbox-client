/**
 * An enum which defines different IPC message types.
 *
 * @enum {number}
 */
enum ipcMessages {
    KeyPress = "KeyPress",
    KeyRelease = "KeyRelease",
    MousePress = "MousePress",
    MouseRelease = "MouseRelease",
    MouseMove = "MouseMove",
    RenderObjectUpdate = "RenderObjectUpdate",
    RenderObjectDelete = "RenderObjectDelete",
    RenderUpdate = "RenderUpdate",
    UIRender = "UIRender",
    ChatMessage = "ChatMessage",
    PlayerMessageEntry = "PlayerMessageEntry",
    ToolChange = "ToolChange",
    FileUpload = "FileUpload",
    ResourceAPITokenRequest = "ResourceAPITokenRequest",
    ResourceAPIToken = "ResourceAPIToken",
    ResourceList = "ResourceList",
    ResourceDelete = "ResourceDelete",
    ResourceReupload = "ResourceReupload",
    PlaySound = "PlaySound",
    StopSound = "StopSound",
    PauseSound = "PauseSound",
    ResumeSound = "ResumeSound",
    SetVolume = "SetVolume",
    RunScript = "RunScript"
}
export default ipcMessages;
