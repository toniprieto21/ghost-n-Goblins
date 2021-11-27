class daggerGroup extends Phaser.Physics.Arcade.Group
{
    constructor(scene)
    {
        super(scene.physics.world, scene);
        this.createMultiple({
            classType: daggerPrefab,
            frameQuantity: 50,
            active: false,
            visible: false,
            key: 'dagger'
        }) 
    }

    fireDagger(x, y) {
        const dagger = this.getFirstDead(false);
        if (dagger) {
            dagger.fire(x, y);
        }
    }
}