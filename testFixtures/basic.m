// LSP test fixture — wombat-lsp E2E suite
member int armor_class;
member string guild_name;

forward int compute_ac(int base);

// Get the armor class
int compute_ac(int base)
{
    int result = base + armor_class;
    return(result);
}

trigger use {
    int ac = compute_ac(getObjVar(this, "armorClass"));
    return(0x01);
}
