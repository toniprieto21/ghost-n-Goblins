class level1 extends Phaser.Scene {
    constructor() {
        super({ key: "level1" });
    }
    preload() {
        this.load.setPath("assets/sprites/");
        this.load.image('bg', 'bg_green_tile.png');
        //this.load.spritesheet('hero','hero.png',{frameWidth:32,frameHeight:32});

        //Este funconaba!
        //this.load.spritesheet('Arthur','Arthur_Run.png',{frameWidth:32,frameHeight:32}); //Dimensions de un frame no de totes les animacions!
        this.load.spritesheet('Arthur', 'Arthur_All_Move.png', { frameWidth: 32, frameHeight: 32 }); //Dimensions de un frame no de totes les animacions!

        //this.load.spritesheet('Arthur_idle','Arthur_Idle.png',{frameWidth:32,frameHeight:32}); //Dimensions de un frame no de totes les animacions!

        this.load.spritesheet('Zombie', 'Enemy_Zombie_23x32.png', { frameWidth: 23, frameHeight: 32 }); //Dimensions de un frame no de totes les animacions!

        this.load.setPath("assets/tilesets/");
        this.load.image('tileset_walls', 'tileset_walls.png');
        this.load.image('tileset_moss', 'tileset_moss.png');

        this.load.setPath("maps/");
        this.load.tilemapTiledJSON('level1', 'level1.json');
    }
    create() {

        //Pintamos el fondo
        this.bg = this.add.tileSprite(0, 0, gameOptions.level1Width, gameOptions.level1Height, 'bg').setOrigin(0);

        //Pintamos el nivel
        //Cargo el JSON
        this.map = this.add.tilemap('level1');
        //Cargo los Tilesets
        this.map.addTilesetImage('tileset_walls');
        this.map.addTilesetImage('tileset_moss');
        //Pintamos las capas/layers
        this.walls = this.map.createLayer('walls_layer', 'tileset_walls');
        this.map.createLayer('moss_top_layer', 'tileset_moss');
        this.map.createLayer('moss_left_layer', 'tileset_moss');
        this.map.createLayer('moss_right_layer', 'tileset_moss');
        this.map.createLayer('moss_bottom_layer', 'tileset_moss');
        //Indicamos las colisiones con paredes/suelo/techo
        this.map.setCollisionBetween(1, 11, true, true, 'walls_layer');

        //Pintamos al hero, en la posicion inicial del nivel
        //this.Arthur_idle = this.physics.add.sprite(65,250,'Arthur_idle');

        this.Zombie = this.physics.add.sprite(200, 250, 'Zombie');

        this.Arthur = this.physics.add.sprite(65, 250, 'Arthur');//(65,100,'Arthur');
        //Creamos un listener para detectar colisiones entre el hero y las paredes
        this.physics.add.collider(this.Arthur, this.walls);
        //this.physics.add.collider(this.Arthur_idle,this.walls);
        this.physics.add.collider(this.Zombie, this.walls);

        //Seguimiento camera
        this.cameras.main.startFollow(this.Arthur);
        this.cameras.main.setBounds(0, 0, gameOptions.level1Width, gameOptions.level1Height);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys({
            e: Phaser.Input.Keyboard.KeyCodes.E
        });
        //this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        //this.attack = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        this.anims.create(
            {
                //Run
                key: 'run',
                frames: this.anims.generateFrameNumbers('Arthur', { frames: [0, 1, 2, 3] }), frameRate: 9, repeat: -1,
            });

        this.anims.create(
            {
                //Arthur
                key: 'static',
                frames: this.anims.generateFrameNumbers('Arthur', { frames: [4] }), frameRate: 0, repeat: 0,
            });

        this.anims.create(
            {
                //Jump
                key: 'jump',
                frames: this.anims.generateFrameNumbers('Arthur', { frames: [5] }), frameRate: 5, repeat: 0,
            });

        this.anims.create(
            {
                //Crouch
                key: 'crouch',
                frames: this.anims.generateFrameNumbers('Arthur', { frames: [7] }), frameRate: 0, repeat: 0,

            });

        this.anims.create(
            {
                //Attack
                key: 'attack',
                frames: this.anims.generateFrameNumbers('Arthur', { frames: [8, 9] }), frameRate: 9, repeat: -1,

            });

        this.anims.create(
            {
                //Zombie
                key: 'walk_left',
                frames: this.anims.generateFrameNumbers('Zombie', { frames: [1, 2, 0] }), frameRate: 9, repeat: -1,
            });

        this.anims.create(
            {
                //Zombie    
                key: 'walk_right',
                frames: this.anims.generateFrameNumbers('Zombie', { frames: [7, 8, 6] }), frameRate: 9, repeat: -1,
            });
    }

    update() {
        // ARTHUR---------------------------
        //Movimiento Arthur izquierda-derecha
        if (this.Arthur.body.onFloor() && gameOptions.onTriggerFloor == false) {
            gameOptions.isOnJump = false;
            this.Arthur.play('jump', false);
            gameOptions.onTriggerFloor = true;
        }

        if (this.cursors.down.isDown && this.Arthur.body.onFloor()) {
            //veure si quan estic en crouch 
            this.Arthur.body.velocity.x = 0;
            gameOptions.onCrouch = true;
            this.Arthur.play('run', false);
            this.Arthur.play('crouch', true);
        }
        else if (gameOptions.onCrouch && !this.cursors.down.isDown) {
            gameOptions.onCrouch = false;
            this.Arthur.play('crouch', false);
        }

        if (this.cursors.left.isDown) {
            if (!gameOptions.onCrouch) { //Si no estoy agachado doy velocidad
                this.Arthur.body.velocity.x = -gameOptions.heroSpeed;
            }
            this.Arthur.flipX = true; //Este agachado o no hago flip de Arthur ya que agachado cambia de direccion si puslamos left/right
            //this.Arthur.play('static', false);
            //this.Arthur.play('idle', false);
            if (!gameOptions.isOnJump && !gameOptions.onCrouch) {
                //this.Arthur.play('crouch', false);
                this.Arthur.play('run', true);
            }
        }

        else if (this.cursors.right.isDown) {
            if (!gameOptions.onCrouch) { //Si no estoy agachado doy velocidad
                this.Arthur.body.velocity.x = gameOptions.heroSpeed;
            }
            this.Arthur.flipX = false;
            //this.Arthur.play('static', false);
            //this.Arthur.play('idle', false);
            if (!gameOptions.isOnJump && !gameOptions.onCrouch) {
                //this.Arthur.play('crouch', false);
                this.Arthur.play('run', true);
            }
        }
        else if (!this.cursors.left.isDown && !this.cursors.right.isDown && !this.cursors.down.isDown) {
            this.Arthur.body.velocity.x = 0;
            if (!gameOptions.isOnJump) {
                this.Arthur.play('run', false);
                this.Arthur.play('crouch', false);
                this.Arthur.play('static', true);
            }
            //this.Arthur.play('idle', true);
            //this.Arthur = this.physics.add.sprite(65,250,'Arthur_idle');               
        }

        //Salto
        if (this.cursors.up.isDown &&
            this.Arthur.body.onFloor() && //this.hero.body.blocked.down
            Phaser.Input.Keyboard.DownDuration(this.cursors.up, 250)) {
            this.Arthur.body.velocity.y = -gameOptions.heroJump;
            gameOptions.isOnJump = true;
            this.Arthur.play('jump', true);
            gameOptions.onTriggerFloor = false;
        }
        if (this.keys.e.isDown) {
            this.Arthur.play('attack', true);
        }

        // ZOMBIE---------------------------
        //Move Zombie
        if (zombie.currentTime < zombie.maxTime && zombie.movingRight) {
            zombie.currentTime += 0.33;
            this.Zombie.body.velocity.x = zombie.zombieSpeed;
            this.Zombie.play('walk_right', true);
        }

        else if (zombie.currentTime < zombie.maxTime && !zombie.movingRight) {
            zombie.currentTime += 0.33;
            this.Zombie.body.velocity.x = -zombie.zombieSpeed;
            this.Zombie.play('walk_left', true);
        }
        else {
            if (zombie.movingRight) {
                zombie.movingRight = false;
                this.Zombie.play('walk_right', false);
                this.Zombie.play('walk_left', true);
            }
            else {
                zombie.movingRight = true;
                this.Zombie.play('walk_left', false);
                this.Zombie.play('walk_right', true);
            }

            zombie.currentTime = 0;
        }
    }
}
