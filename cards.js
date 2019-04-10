module.exports = class Card {
    constructor(cardInfo, cardKey) {
        this.name = cardInfo.name;
        this.attack = cardInfo.attack;
        this.health = cardInfo.health;
        this.cost = cardInfo.cost;
        this.keywords = cardInfo.keywords;
        this.cardKey = cardKey;
    }
};
