module.exports = heroes = {
    lightlord: {
        name: "Lightlord Francis",
        desc: "Kill your opponent's strongest monster every turn.",
        power: opponent => {
            if (opponent.field.length > 0) {
                let deadMinion = opponent.field.reduce((prev, next) => {
                    return Math.max(prev.attack, next.attack);
                });
                let strongestIndex = opponent.field.indexOf(deadMinion);
                opponent.field = opponent.field.splice(deadMinion, 1);
                return deadMinion;
            } else {
                return null;
            }
        }
    },
    brodia: {
        name: "Brodia, The Vanguard",
        "desc": "You can only take up to 3 damage in a turn.",
        power: opponent => {
            if (this.damage > 3) {
                this.damage = 3;
            }
            return null;
        }
    },
    hundred_bats: {
        name: "One Hundred Bats",
        "desc": "Deal 2 direct damage every turn.",
        power: opponent => {
            opponent.life -= 2;
            return null;
        }
    },
    guuch: {
        name: "The Guuch",
        "desc": "You have 2x mana every turn.",
        power: opponent => {
            this.mana += this.mana;
            return null;
        }
    },
    brainum: {
        name: "Brainum",
        "desc": "Draw 2 cards every turn.",
        power: opponent => {
            if (this.hand < 5) {
                this.hand.push(this.deck.shift());
            }
            return null;
        }
    }
};
