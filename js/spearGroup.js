class spearGroup extends Phaser.Physics.Arcade.Group
{
    constructor(scene)
    {
        super(scene.physics.world, scene);
        this.createMultiple({
            classType: spearPrefab,
            frameQuantity: 30,
            active: false,
            visible: false,
            key: 'spear'
        }) 
    }

    fireSpear(x, y) {
        const spear = this.getFirstDead(false);
        if (spear) {
            spear.fire(x, y);
        }
    }
}