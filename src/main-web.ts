import Game from "core/game";
import WindowInputPure from "input/window-input-pure";
import LoginAPIInterfacePure from "networking/login-api-interface-pure";
import ResourceAPIInterfacePure from "networking/resource-api-interface-pure";
import ScreenRendererPure from "rendering/screen-renderer-pure";
import AudioPlayerPure from "sound/audio-player-pure";
import GameUIPure from "ui/game-ui-pure";
import LoginUIPure from "ui/login-ui-pure";
import UIManager from "ui/ui-manager";

// Note: We don't need to set up anything with paths in here
// Because the browser version uses webpack

const game = new Game(
    new WindowInputPure(),
    new ScreenRendererPure(1920, 1080),
    new AudioPlayerPure(),
    new UIManager(new LoginUIPure(), new GameUIPure()),
    new ResourceAPIInterfacePure(),
    new LoginAPIInterfacePure()
);
game.start();
