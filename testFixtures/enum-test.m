trigger use {
    callbackAdvanced(this, 10, 5, 0);
    scriptTrig(this, 0x10, 0);
    setMobFlag(this, 0x40);
    walk(this, 4);
    getStat(this, 0);
    setAlignment(this, 2);
    equipObj(sword, this, 1);
    getSkillLevel(this, 25);
}
