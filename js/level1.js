class level1 extends Phaser.Scene {
    constructor() {
        super(
            { 
                key: "level1" 
            });
    }
    preload() {
        this.load.setPath("assets/sprites/");
        this.load.image('bg', 'bg_green_tile.png');
        //this.load.spritesheet('hero','hero.png',{frameWidth:32,frameHeight:32});

        //Este funconaba!
        //this.load.spritesheet('Arthur','Arthur_Run.png',{frameWidth:32,frameHeight:32}); //Dimensions de un frame no de totes les animacions!
        this.load.spritesheet('Arthur', 'Arthur_All_Move.png', { frameWidth: 32, frameHeight: 32 }); //Dimensions de un frame no de totes les animacions!

        // Cargamos el sprite de la lanza
        this.load.image('spear', 'spear.png');
        this.load.image('dagger', 'dagger.png');

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
    

        this.Arthur = this.physics.add.sprite(65, 250, 'Arthur');//(65,100,'Arthur');
        
        this.Zombie = this.physics.add.sprite(200, 250, 'Zombie');

        //Creamos un listener para detectar colisiones entre el hero y las paredes
        this.physics.add.collider(this.Arthur, this.walls);

        this.physics.add.collider(this.Zombie,this.walls);
        //this.physics.add.collider(this.Zombie, this.walls); DESCOMENTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAR

        //Seguimiento camera
        this.cameras.main.startFollow(this.Arthur);
        this.cameras.main.setBounds(0, 0, gameOptions.level1Width, gameOptions.level1Height);



        this.loadPools();
        this.loadAnimations();

        // Controlamos los inputs de los cursores del teclado
        this.cursors = this.input.keyboard.createCursorKeys();

        // Controlamos los inputs del teclado sin contar los cursores
        this.keys = this.input.keyboard.addKeys({
            e: Phaser.Input.Keyboard.KeyCodes.E
        });

        // Intentamos spawnear lanzas
        //this.spearGroup = new spearGroup(this);
        this.addEvents();
    }

    addEvents()
    {

        this.inputKeys = [
            this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
        ];

    }

    shootSpear()
    {
        this.spearGroup.fireSpear(this.Arthur.x, this.Arthur.y, this.Arthur.x);
    }
    shootDagger()
    {
        this.daggerGroup.fireDagger(this.Arthur.x, this.Arthur.y, this.Arthur.x);
    }

    loadAnimations()
    {

        this.anims.create( //Arthur
            {
                key: 'static',
                frames: this.anims.generateFrameNumbers('Arthur', { frames: [4] }), frameRate: 0, repeat: 0,
            });

        this.anims.create( //Run
                {
                    
                    key: 'run',
                    frames: this.anims.generateFrameNumbers('Arthur', { frames: [0, 1, 2, 3] }), frameRate: 9, repeat: -1,
            });

        this.anims.create( //Jump
            {
               
                key: 'jump',
                frames: this.anims.generateFrameNumbers('Arthur', { frames: [5] }), frameRate: 5, repeat: 0,
            });

        this.anims.create( //Crouch
            {
                
                key: 'crouch',
                frames: this.anims.generateFrameNumbers('Arthur', { frames: [7] }), frameRate: 0, repeat: 0,

            });

        this.anims.create( //Attack
            {
                
                key: 'attack',
                frames: this.anims.generateFrameNumbers('Arthur', { frames: [8, 9] }), frameRate: 20, repeat: 0,
            });

        this.anims.create( // Crouch attack
            {
                
                key: 'crouch_attack',
                frames: this.anims.generateFrameNumbers('Arthur', { frames: [10, 11] }), frameRate: 20, repeat: 0,

            });

        // ZOMBIE----------
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

    loadPools() 
    {
        this.spears = this.physics.add.group();
        this.daggers = this.physics.add.group();
    }

    createSpear() //onCrouch s'haura de variar X,Y o mirar de variar collider primer ja que sera més petit i potser ja queda be cuan s'implementi 
    {
        var _spear = this.spears.getFirst(false);
        if (!_spear) 
        {
            _spear = this.add.image(this.Arthur.x, this.Arthur.y - 10, 'spear')
            this.spears.add(_spear);
        }else 
        {
            _spear.active = true;
            _spear.body.reset(this.Arthur.x, this.Arthur.y);
        }
        if (this.Arthur.flipX == true) {
            _spear.flipX = true;
            _spear.body.setVelocityX(-gameOptions.spearSpeed);
        }else{
            _spear.flipX = false;
            _spear.body.setVelocityX(gameOptions.spearSpeed);
        }
        _spear.body.allowGravity = false;
    }

    createDagger() //onCrouch s'haura de variar X,Y o mirar de variar collider primer ja que sera més petit i potser ja queda be cuan s'implementi 
    {
        var _dagger = this.daggers.getFirst(false);
        if (!_dagger) 
        {
            _dagger = this.add.image(this.Arthur.x, this.Arthur.y - 10, 'dagger')
            this.daggers.add(_dagger);
        }else 
        {
            _dagger.active = true;
            _dagger.body.reset(this.Arthur.x, this.Arthur.y);
        }
        if (this.Arthur.flipX == true) {
            _dagger.flipX = true;
            _dagger.body.setVelocityX(-gameOptions.daggerSpeed);
        }else{
            _dagger.flipX = false;
            _dagger.body.setVelocityX(gameOptions.daggerSpeed);
        }
        _dagger.body.allowGravity = false;
    }

    setIsAttacking()
    {
        gameOptions.isAttacking = false;
    }

    //Es tindria que controlar gameOptions.isAttacking amb un timer en el momnet d'atgacar, fer que durant aquest temps el jugador no es pugui moure i tambe controlar les animacions d'attack,
 
    update() {

        //gameOptions.isAttacking = false;

        //Tenir un enum amb armes i una variable en hero que sigui el arma actual que te.
        this.inputKeys.forEach(key => {
            if (Phaser.Input.Keyboard.JustDown(key)) {
                //CAMBI DE ARMA!!!!!!!!!!!!!!
                this.createDagger();    
                //this.createSpear();
                if (!gameOptions.isOnJump && !gameOptions.onCrouch) { //?¿
                    this.Arthur.play('attack', true);
                    //gameOptions.isAttacking = true;
                }
                else if(gameOptions.onCrouch){
                    this.Arthur.play('crouch_attack', true);
                }
            }
        });

        // ARTHUR---------------------------
        //Movimiento Arthur izquierda-derecha
        if (this.Arthur.body.onFloor() && gameOptions.onTriggerFloor == false) {
            gameOptions.isOnJump = false;
            this.Arthur.play('jump', false);
            gameOptions.onTriggerFloor = true;
        }
        if (this.cursors.down.isDown && this.Arthur.body.onFloor()) {
            this.Arthur.body.velocity.x = 0;
            gameOptions.onCrouch = true;
            if(!gameOptions.isAttacking)
            {
            this.Arthur.play('run', false);
            this.Arthur.play('crouch', true);
            }
            // else
            // {           
            //     this.Arthur.play('crouch', false);
            //     this.Arthur.play('crouch_attack', true);
            // }

        }
        /*else*/if(this.cursors.down.isDown && this.keys.e.isDown) {
            this.Arthur.play('crouch', false);
             this.Arthur.play('crouch_attack', true);
             gameOptions.isAttacking = true;
        }
        else if (gameOptions.onCrouch && !this.cursors.down.isDown) {
            gameOptions.onCrouch = false;
            this.Arthur.play('crouch', false);
        }






        // MOVEMENT 
        if (this.cursors.left.isDown) {
            this.Arthur.flipX = true;
            if (!gameOptions.isOnJump && !gameOptions.onCrouch) {
                this.Arthur.play('run', true);
                this.Arthur.body.velocity.x = -gameOptions.heroSpeed;
            }
        }
        else if (this.cursors.right.isDown) {
            this.Arthur.flipX = false;
            if (!gameOptions.isOnJump && !gameOptions.onCrouch) {
                this.Arthur.play('run', true);
                this.Arthur.body.velocity.x = gameOptions.heroSpeed;
            }
        }
        // ATTACK
        else if (this.keys.e.isDown) { 
            if (!gameOptions.isOnJump && !gameOptions.onCrouch) {
                //this.Arthur.play('attack', true);
            }
        }
        else if (!this.cursors.left.isDown && !this.cursors.right.isDown && !this.cursors.down.isDown) {
            this.Arthur.body.velocity.x = 0;
            if (!gameOptions.isOnJump) {
                this.Arthur.play('run', false);
                this.Arthur.play('crouch', false);
                this.Arthur.play('static', true);
            }              
        }
        //Salto
        if (this.cursors.up.isDown &&
            this.Arthur.body.onFloor() &&
            Phaser.Input.Keyboard.DownDuration(this.cursors.up, 250)) {
            this.Arthur.body.velocity.y = -gameOptions.heroJump;
            gameOptions.isOnJump = true;
            this.Arthur.play('jump', true);
            gameOptions.onTriggerFloor = false;
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
