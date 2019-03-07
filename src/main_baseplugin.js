//import 'phaser';
(function(){

class KineticScrolling extends Phaser.Plugins.BasePlugin{

    constructor(plugimManager){

        super(plugimManager);

        this.pointerId = null;
        this.dragging = false;
        this.pressedDown = false;
        this.timestamp = 0;
        //this.callbackID = 0;

        this.targetX = 0;
        this.targetY = 0;

        this.autoScrollX = false;
        this.autoScrollY = false;

        this.startX = 0;
        this.startY = 0;

        this.velocityX = 0;
        this.velocityY = 0;

        this.amplitudeX = 0;
        this.amplitudeY = 0;

        this.directionWheel = 0;

        this.velocityWheelX = 0;
        this.velocityWheelY = 0;

        // if less than the two values is a Tap
        this.thresholdOfTapTime = 100;
        this.thresholdOfTapDistance = 10;

        // for a smoother scrolling start
        this.thresholdReached = false;

        this.clickHelperActiveObjects = [];

        this.settings = {
            kineticMovement: true,
            timeConstantScroll: 325, //really mimic iOS
            hScroll: true,          // horizontal with pointer
            vScroll: true,          // vertical
            hWheel: false,          //horizontal scroll mouse wheel
            vWheel: true,           //vertiacal 
            deltaWheel: 20,
            onUpdate: 0 //(x, y) => {console.log('x=' + x + ', y='+ y)}
           // button: "" ? пока без настроки кнопки  `leftButton`, `rightButton`, `middleButton`
        };

        this.scene;
        this.camera;
        this.clearMovementTimer = 0; 
        this.kineticDown = false;
    }

    init(data){
        if (data) this.configure(data);
        console.log('kinetic init');
    }

    start(scene, camera){
        console.log('start');
        if(scene == undefined){
            return 0;
        }
        // если вызываем из конфига игры global то if scene == string then getScene(key);
        // иначе if scene typeof Phaser.Scene то
        this.scene = scene;

        this.eventEmitter = this.scene.events;

        this.scene.input.on('gameobjectdown', function (pointer, gameObject)
        {
            //gameObject.emit('clicked', gameObject);
            gameObject.showname();

        }, this);

        if(camera == undefined){
            this.camera = scene.cameras.main;
        }else{
            this.camera = camera;
        }

        this.eventEmitter = this.game.events;

        this.eventEmitter.on('step', this.update, this);

        this.scene.input.on('pointerdown', this.beginMove, this);
        
        //this.callbackID = 
        this.scene.input.on('pointermove', this.moveCamera, this);

        this.scene.input.on('pointerup', this.endMove, this);

        this.game.events.on('mouseout', this.endMove, this);

        if (window.addEventListener)
        {
            window.addEventListener('DOMMouseScroll', this.mouseWheel.bind(this), false);
            window.onmousewheel = this.mouseWheel.bind(this);
        }
    }

    boot(){
        console.log('boot');
    }

    beginMove(pointer) {
        this.pointerId = pointer.id;
        this.startX = this.game.input.x;
        this.startY = this.game.input.y;
        this.screenX = pointer.screenX;
        this.screenY = pointer.screenY;
        this.pressedDown = true;
        this.thresholdReached = false;
        this.timestamp = Date.now();
        this.beginTime = this.timestamp;
        this.velocityY = this.amplitudeY = this.velocityX = this.amplitudeX = 0;

        this.timerDown = setTimeout(() => {
            if(!this.thresholdReached){
                this.scene.input.emit('kineticDown');
                this.kineticDown = true;
            }
        }, this.thresholdOfTapTime + 10);
    }

    moveCamera(pointer) {

        let x = pointer.x;
        let y = pointer.y;

        clearTimeout(this.clearMovementTimer);
        // надо попробывать запускать pointermove после pointerdown
        if (!this.pressedDown) {
            return;
        }

        // If it is not the current pointer
        if (this.pointerId !== pointer.id) {
            return;
        }

        this.now = Date.now();
        var elapsed = this.now - this.timestamp;
        this.timestamp = this.now;

        var deltaX = 0;
        var deltaY = 0;

        // It`s a fast tap not move
        if ( this.isTap()
            && Math.abs(pointer.screenY - this.screenY) < this.thresholdOfTapDistance
            && Math.abs(pointer.screenX - this.screenX) < this.thresholdOfTapDistance
        ) {
            return;
        }

        if (!this.thresholdReached) {
            this.thresholdReached = true;
            this.startX = x;
            this.startY = y;
            if(this.kineticDown){
                this.scene.input.emit('kineticUp');
            }else{
                clearTimeout(this.timerDown);
                this.kineticDown = false;
            }
            this.scene.input.emit('kineticOff');
            return;
        }

        if (this.settings.hScroll) {
            deltaX = x - this.startX;
            if (deltaX !== 0) {
                this.dragging = true;
            }
            this.startX = x;
            this.velocityX = 0.8 * (1000 * deltaX / (1 + elapsed)) + 0.2 * this.velocityX;
            this.camera.scrollX -= deltaX;
        }

        if (this.settings.vScroll) {
            deltaY = y - this.startY;
            if (deltaY !== 0) {
                this.dragging = true;
            }
            this.startY = y;
            this.velocityY = 0.8 * (1000 * deltaY / (1 + elapsed)) + 0.2 * this.velocityY;
            this.camera.scrollY -= deltaY;
        }

        if (typeof this.settings.onUpdate === 'function') {
            var updateX = 0;
            if (this.canCameraMoveX(this.camera, deltaX)) {
                updateX = deltaX;
            }

            var updateY = 0;
            if (this.canCameraMoveY(this.camera, deltaY)) {
                updateY = deltaY;
            }

            this.settings.onUpdate(updateX, updateY);
        }

        this.clearMovementTimer = setTimeout(function () {
            this.velocityX = 0;
            this.velocityY = 0;
        }.bind(this), 20);
    }

    /**
    * Validate if the gesture is a tap
    * @return {boolean}
    */
    isTap() {
        return (this.now - this.beginTime) < this.thresholdOfTapTime;
    };

    endMove() {
        
        clearTimeout(this.timerDown);
        this.kineticDown = false;
        this.scene.input.emit('kineticUp');
        this.scene.input.emit('kineticClick');
        this.scene.input.emit('kineticOff');

        clearTimeout(this.clearMovementTimer);

        this.pointerId = null;
        this.pressedDown = false;
        this.autoScrollX = false;
        this.autoScrollY = false;

        if (!this.settings.kineticMovement) return;

        this.now = Date.now();

        if (this.game.isOver) {
            if (this.velocityX > 10 || this.velocityX < -10) {
                this.amplitudeX = 0.8 * this.velocityX;
                this.targetX = Math.round(this.camera.scrollX - this.amplitudeX);
                this.autoScrollX = true;
            }

            if (this.velocityY > 10 || this.velocityY < -10) {
                this.amplitudeY = 0.8 * this.velocityY;
                this.targetY = Math.round(this.camera.scrollY - this.amplitudeY);
                this.autoScrollY = true;
            }
        }
        if (!this.game.isOver) {
            this.velocityWheelXAbs = Math.abs(this.velocityWheelX);
            this.velocityWheelYAbs = Math.abs(this.velocityWheelY);
            if ( this.settings.hScroll) {
                this.autoScrollX = true;
            }
            if (this.settings.vScroll) {
                this.autoScrollY = true;
            }
        }
    }

    update(time, elapsed) {
        //console.log(this.scene.input.isOver);
        //console.log(time, delta);
        //if(!elapsed){
            this.elapsed = Date.now() - this.timestamp;
        //}else{
       //     this.elapsed = elapsed; 
       // }
        
        this.velocityWheelXAbs = Math.abs(this.velocityWheelX);
        this.velocityWheelYAbs = Math.abs(this.velocityWheelY);

        var delta = 0;
        if (this.autoScrollX && this.amplitudeX != 0) {

           // debugger;
            delta = -this.amplitudeX * Math.exp(-this.elapsed / this.settings.timeConstantScroll);
            if (this.canCameraMoveX(this.camera, delta) && (delta > 0.5 || delta < -0.5)) {
                this.camera.scrollX = this.targetX - delta;
            }
            else {
                this.autoScrollX = false;
                this.camera.scrollX = this.targetX;
            }
        }

        if (this.autoScrollY && this.amplitudeY != 0) {

            delta = -this.amplitudeY * Math.exp(-this.elapsed / this.settings.timeConstantScroll);
            if (this.canCameraMoveY(this.camera, delta) && (delta > 0.5 || delta < -0.5)) {
                this.camera.scrollY = this.targetY - delta;
            }
            else {
                this.autoScrollY = false;
                this.camera.scrollY = this.targetY;
            }
        }

        if (!this.autoScrollX && !this.autoScrollY) {
            this.dragging = false;
        }

        if (this.settings.hWheel && this.velocityWheelXAbs > 0.1) {
            this.dragging = true;
            this.amplitudeX = 0;
            this.autoScrollX = false;
            this.camera.scrollX -= this.velocityWheelX;
            this.velocityWheelX *= 0.95;
        }

        if (this.settings.vWheel && this.velocityWheelYAbs > 0.1) {
            this.dragging = true;
            this.autoScrollY = false;
            this.camera.scrollY -= this.velocityWheelY;
            this.velocityWheelY *= 0.95;
        }
    };

      /**
    * Indicates when camera can move in the x axis
    * @return {boolean}
    */
    canCameraMoveX(cam, delta) {
        let bounds = cam.getScroll(cam.scrollX + delta, 0);
        if(cam.scrollX != bounds.x){
            return true;
        }
        return false;
    };

          /**
    * Indicates when camera can move in the y axis
    * @return {boolean}
    */
    canCameraMoveY(cam, delta) {
        let bounds = cam.getScroll(0, cam.scrollY + delta);
        if(cam.scrollY != bounds.x){
            return true;
        }
        return false;
    };

    /**
    * Event called when the mousewheel is used, affect the direction of scrolling.
    */
    mouseWheel(event) {

        if (!this.settings.hWheel && !this.settings.vWheel) return;

        event.preventDefault();
        let delta = 0;
        let wheelDelta = 0;

        wheelDelta = event.wheelDelta || -event.detail;
        wheelDelta = Math.max(-1, Math.min(1, wheelDelta));
        delta = wheelDelta * 120 / this.settings.deltaWheel;

        if (this.directionWheel != wheelDelta) {
            this.velocityWheelX = 0;
            this.velocityWheelY = 0;
            this.directionWheel = wheelDelta;
        }

        let cam = this.camera;

        if (this.settings.hWheel) {
            this.autoScrollX = false;

            this.velocityWheelX += delta;

            if (typeof this.settings.onUpdate === 'function') {
                var deltaX = 0;
                if(this.canCameraMoveX(cam, delta)){
                    deltaX = delta;
                }

                this.settings.onUpdate(deltaX, 0);
            }
        }
        
        if (this.settings.vWheel) {
            this.autoScrollY = false;

            this.velocityWheelY += delta;

            if (typeof this.settings.onUpdate === 'function') {
                var deltaY = 0;
                if(this.canCameraMoveY(cam, delta)){
                    deltaY = delta;
                }
                this.settings.onUpdate(0, deltaY);
            }
        }
    };

    addInteractive(gameobject){
        gameobject.setInteractive();
        gameobject.on('pointerdown', function(){
            if(this.hasOwnProperty('onKineticDown')){
                this.scene.input.on('kineticDown', this.onKineticDown, this); 
            }
            //debugger;
            if(this.hasOwnProperty('onKineticUp')){
                this.scene.input.on('kineticUp', this.onKineticUp, this);
            }
            if(this.hasOwnProperty('onKineticClick')){
                this.scene.input.on('kineticClick', this.onKineticClick, this);
            }
            
            this.scene.input.on('kineticOff', function(){
                console.log('kineticOff', this.name);
                if(this.hasOwnProperty('onKineticDown')){
                    this.scene.input.off('kineticDown', this.onKineticDown, this); 
                }
                if(this.hasOwnProperty('onKineticUp')){
                    this.scene.input.off('kineticUp', this.onKineticUp, this);
                }
                if(this.hasOwnProperty('onKineticClick')){
                    this.scene.input.off('kineticClick', this.onKineticClick, this);
                }

                this.scene.input.off('kineticOff');
            }, this)
        }, gameobject);
    }

    stop(){
        this.eventEmitter.off('step', this.update);

        this.pressedDown = false;
        
        this.scene.input.off('pointerdown', this.this.beginMove, this);

        this.scene.input.off('pointermove', this.moveCamera, this);

        this.scene.input.off('pointerup', this.endMove, this);

        this.game.events.off('mouseout', this.endMove, this);

        if (window.addEventListener)
        {
            window.removeEventListener('DOMMouseScroll', this.mouseWheel.bind(this), false);
            window.onmousewheel = null;
        }
    }

    configure(data){
        //Object.assign(this, data);
        if (data) {
            for (var property in data) {
                if (this.settings.hasOwnProperty(property)) {
                    this.settings[property] = data[property];
                }
            }
        }
    }
}


})