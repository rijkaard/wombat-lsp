member int base_hp;

// Compute hit points from base and bonus
int get_hp(int bonus)
{
    int total = base_hp + bonus;
    return(total);
}

string get_name()
{
    return("parent");
}
