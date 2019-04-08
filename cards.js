const keywords;

class Card {
    constructor(cardInfo, index) {
        this.name = cardInfo.name;
        this.attack = cardInfo.attack;
        this.health = cardInfo.health;
        this.cost = cardInfo.cost;
        this.keywords = cardInfo.keywords;

        this.GID = index;
    }
}

module.exports = Card;