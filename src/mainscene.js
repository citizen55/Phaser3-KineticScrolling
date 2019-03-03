/**
 * @author       citizen55 <citizen55@mail.com>
 * @copyright    2018 citizen55
 * @description  Lord of Fly Island: Boot Scene
 * @license      citizen55
 */

export class MainScene extends Phaser.Scene {

    constructor() {
        super({
            key: "MainScene"
        });
        this.cam;
        this.controls;
        this.kinetic;
    }

    preload() {
        this.load.image('grid', '../assets/img/grid_4096.png');
    }

    create() {
        this.add.image(0, 0, 'grid').setOrigin(0);
        // var cursors = this.input.keyboard.createCursorKeys();
        // console.dir(cursors);

        // var controlConfig = {
        //     camera: this.cameras.main,
        //     left: cursors.left,
        //     right: cursors.right,
        //     up: cursors.up,
        //     down: cursors.down,
        //     acceleration: 0.02,
        //     drag: 0.0005,
        //     maxSpeed: 1.0
        // };
    
        // this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
        this.cam = this.cameras.main;

        this.cam.setBounds(0, 0, 4096, 4096).setZoom(1);

        this.kinetic = this.game.plugins.get('kinetic');
        //this.sys.install('kinetic');
        this.kinetic.start(this, this.cam);

        // this.input.on('pointerdown', () => {
        //     if(this.controls._speedX != 0){
        //         this.controls._speedX = 0;
        //     }
        // })
    }

    gameover(){
        console.log('gameover');
    }

    emulate(){

    }

    update(time, delta){
        // this.controls.update(delta);
    }
}
