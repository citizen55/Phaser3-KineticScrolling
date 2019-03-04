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
        this.load.image('crate', '../assets/img/crate.png');
    }

    create() {
        this.grid = this.add.image(0, 0, 'grid').setOrigin(0);
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

        for(let i = 0; i < 40; i++){
            for(let j = 0; j < 40; j++){

                let x = i * 100 + 50;
                let y = j * 100 + 50;

                var box = this.add.image(x, y, 'crate');

               // Object.defineProperty(box, 'name', {});
                box.name = x + y;

                //  Make them all input enabled
                box.setInteractive();
        
                //  The images will dispatch a 'clicked' event when they are clicked on
               box.on('clicked', function(box) {
                   console.log('box: ', box.name);
                   console.dir(box);
               });

               box.showname = function(){
                    console.log(this.name);
               }

               box.onKineticDown = function(){
                   console.log('down', this.name);
                   //debugger;
                   this.scene.tweens.add({
                        targets: this,
                        rotation: 0.5,
                        duration: 200,
                        ease: 'Linear'
                    });
               }

               box.onKineticUp = function(){
                   console.log('up ' + this.name);
                   this.scene.tweens.add({
                        targets: this,
                        rotation: 0,
                        duration: 200,
                        ease: 'Linear'
                    });
               }

               box.onKineticClick = function(){
                   console.log('click ' + this.name);
               }

               this.kinetic.addInteractive(box);
            }
        }
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
