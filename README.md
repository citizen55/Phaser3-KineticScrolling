Plugin for Phaser3 <br>
Base on https://github.com/jdnichollsc/Phaser-Kinetic-Scrolling-Plugin <br>
demo https://citizen55.github.io/res/kinetic/kinetic_phaser3.html<br>
testing with Phaser 3.15. Phaser3.16 got a lot of changes <br>

put dist/KineticScrolling.min.js in your folder then enable it 

// mainscene.js extends Phaser.Scene


    preload: function ()
    {
        if(this.kinetic == undefined){
            this.load.scenePlugin({
                key: 'KineticScrolling',
                url: 'dist/KineticScrolling.min.js',
                sceneKey: 'kinetic'
            });
        }
    },
    
    create: function ()
    {
        this.cam = this.cameras.main;

        let config = {
            kineticMovement: true,
            timeConstantScroll: 325, //really mimic iOS
            hScroll: false,          // horizontal with pointer
            vScroll: true,          // vertical
            hWheel: false,          //horizontal scroll mouse wheel
            vWheel: true,           //vertiacal 
            deltaWheel: 20,
            onUpdate: (x, y) => {console.log('x=' + x + ', y='+ y)}
        };

        this.kinetic.start(this.cam, config);
    },


Дополнение для фазер3
Позволяет удобно прокручивать страницу
Пример на гитхаб https://citizen55.github.io/res/kinetic/kinetic_phaser3.html
