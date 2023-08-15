module.exports = {
    name: 'phys-mc-abilities',
    description: 'Calculating pmc abilities',
    perseverance(level)
    {
        if(level = "0")
        {
            return "0";
        }
        else return level*2+8;
    },
    readyForBattle(level)
    {
        if(level = "0")
        {
            return "0";
        }
        else return level*3+12;
    },
    fighitingWill(level)
    {
        if(level = "0")
        {
            return "0";
        }
        else return (level*0.5+24.5)*0.01;
    }
}