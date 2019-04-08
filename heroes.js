module.exports = heroes = {
    lightlord: {
        name: "Lightlord Francis",
        power: opponent => {
            if (opponent.field.length > 0) {
                let deadMinion = opponent.field.shift();
                return deadMinion;
            } else {
                return null;
            }
        }
    },
    brodia: {
        name: "Brodia",
        power: opponent => {
            if (this.damage > 3) {
                this.damage = 0;
            }
            return null;
        }
    },
    hundred_bats: {
        name: "One Hundred Bats",
        power: opponent => {
            opponent.life -= 2;
            return null;
        }
    },
    guuch: {
        name: "The Guuch",
        power: opponent => {
            this.mana += this.mana;
            return null;
        }
    },
    mindslayer: {
        name: "Michael Mindslayer",
        power: opponent => {
            if (this.hand < 5) {
                this.hand.push(this.deck.shift());
            }
            return null;
        }
    }
};
