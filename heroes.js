module.exports = heroes = {
    lightlord: {
        name: "Lightlord Francis",
        desc: "Kill your opponent's strongest monster every turn.",
        power: (pID, opponent) => {
            if (opponent.field.length > 0) {
                let deadMinion = opponent.field.reduce((prev, next) => {
                    return Math.max(prev.attack, next.attack);
                });
                let strongestIndex = opponent.field.indexOf(deadMinion);
                opponent.field = opponent.field.splice(deadMinion, 1);
                return `${pID}: enemy ${deadMinion.name} obliterated!`;
            } else {
                return `${pID}: Nothing to kill!`;
            }
        }
    },
    brodia: {
        name: "Brodia, The Vanguard",
        desc: "You can only take up to 3 damage in a turn.",
        power: (pID, opponent) => {
            if (this.damage > 3) {
                this.damage = 3;
            }
            return `${pID}: damage reduced!`;
        }
    },
    hundred_bats: {
        name: "One Hundred Bats",
        desc: "Deal 2 direct damage every turn.",
        power: (pID, opponent) => {
            opponent.life -= 2;
            return `${pID}: opponent bleeds for 2 damage!`;
        }
    },
    guuch: {
        name: "The Guuch",
        desc: "You have 2x mana every turn.",
        power: (pID, opponent) => {
            if (this.mana < 10) {
                this.mana++;
            }
            return `${pID}: your mana overcharges!`;
        }
    },
    brainum: {
        name: "Brainum",
        desc: "Draw 2 cards every turn.",
        power: (pID, opponent) => {
            if (this.hand < 5) {
                this.hand.push(this.deck.shift());
            }
            return `${pID}: you draw another card!`;
        }
    }
};
