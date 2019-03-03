import "phaser";
import {MainScene} from './mainscene';
import {Kinetic} from './main';


const config = {
    title: "Kinetic",
    url: "https://github.com/citizen55",
    version: "1.0",
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    //resolution: window.devicePixelRatio,
    scene: [MainScene],
    // input: {
    //     keyboard: true
    // },
    backgroundColor: "#ffffff"
    //render: { pixelArt: true, antialias: false },

    , plugins: {
        global: [{
            key: 'kinetic',
            plugin: Kinetic,
            mapping: "kinetic"
        }]
    },
};


export class Game extends Phaser.Game {
    constructor(config) {
        super(config);
    }
}

window.addEventListener("load", () => {
  var game = new Game(config);
});
