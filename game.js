const faker = require('Faker');
const _ = require('lodash');

const promptQuestions = require('./prompt-questions');
const wait = require('./wait');
const templater = require('./templater');
const probably = require('./probably');

class Game {
    constructor(options) {
        this.startTime = (new Date()).getTime();
        this.roundNumber = 0;
        this.players = [];
        this.options = options;
        this.rounds = [];
        this.addMainPlayer();
        this.addOtherPlayers(this.getMaxPlayerCount() - 1);
        this.playerWithBall = _.sample(this.players);
    }

    start() {
        return new Promise((resolve, reject) => {
            this.nextRound().then(() => {
                resolve();
            }, (err) => {
                reject(err);
            });
        });
    }

    getPlayers() {
        return this.players;
    }

    getOtherPlayers() {
        return this.otherPlayers;
    }

    getMainPlayerName() {
        return this.options.mainPlayerName;
    }

    getMaxPlayerCount() {
        return this.options.maxPlayerCount;
    }

    getProbabilityToPassToMainPlayer() {
        return this.options.probabilityToPassToMainPlayer;
    }

    addMainPlayer() {
        this.mainPlayer = {
            name: this.getMainPlayerName(),
            points: 0
        };
        this.players.push(this.mainPlayer);
    }

    addOtherPlayers(playerCount) {
        for (let i = 1; i <= playerCount; i++) {
            let otherPlayer = {
                name: faker.Name.firstName(),
                points: 0
            };
            this.players.push(otherPlayer);
        }
        this.otherPlayers = this.players.slice(1);
        this.otherPlayerCount = this.otherPlayers.length;

        // create probability distributions for passing a ball to players
        let probPassToMainPlayer = this.getProbabilityToPassToMainPlayer();
        for (let otherPlayerIndex in this.otherPlayers) {
            let otherPlayer = this.otherPlayers[otherPlayerIndex];
            otherPlayer.passingProbabilityDistribution = [probPassToMainPlayer]; // probability to pass to the main player
            let probPassToDifferentOtherPlayer = (1 - probPassToMainPlayer) / (this.otherPlayerCount - 1); // make passing to other players equally likely
            _.times(this.otherPlayerCount, (i) => {
                if (i == otherPlayerIndex) {
                    otherPlayer.passingProbabilityDistribution.push(0); // pr of passing to oneself
                } else {
                    otherPlayer.passingProbabilityDistribution.push(probPassToDifferentOtherPlayer);
                }
            });
        }
    }

    getName() {
        return this.options.name;
    }

    getMaxRoundCount() {
        return this.options.maxRoundCount;
    }

    determineWinners() {
        let initialOutcome = {
            maxPoints: 0,
            winners: []
        }
        let outcome = _.reduce(this.players, (outcome, player) => {
            if (player.points == outcome.maxPoints) {
                outcome.winners.push(player);
            } else if (player.points > outcome.maxPoints) {
                outcome.maxPoints = player.points;
                outcome.winners = [player];
            }
            return outcome;
        }, initialOutcome);
        this.winners = outcome.winners;
    }

    nextRound() {
        return new Promise((resolve, reject) => {
            this.roundNumber += 1;
            let round = {};
            this.rounds.push(round);
            this.round = round;
            this.round.startTime = (new Date()).getTime();
            templater.print('roundStart', this);
            this.passBall().then(() => {
                templater.print('roundEnd', this);
                if (this.roundNumber < this.getMaxRoundCount()) {
                    this.nextRound().then(() => {
                        resolve();
                    }, (err) => {
                        reject(err);
                    });
                } else {
                    this.stopTime = (new Date()).getTime();
                    this.determineWinners();
                    resolve();
                }
            }, (err) => {
                reject(err);
            });
        });
    }

    getMaxWaitDuration() {
        return this.options.maxWaitDuration;
    }

    getMinWaitDuration() {
        return this.options.minWaitDuration;
    }

    passBall() {
        return new Promise((resolve, reject) => {
            let round = this.round;
            round.fromPlayer = this.playerWithBall;
            if (round.fromPlayer.name != this.getMainPlayerName()) {
                wait.randomWait(this.getMaxWaitDuration(), this.getMaxWaitDuration()).then(() => {
                    round.toPlayer = probably.getRandomElement(this.players, round.fromPlayer.passingProbabilityDistribution);
                    round.toPlayer.points += 1;
                    this.playerWithBall = round.toPlayer;
                    resolve();
                });
            } else {
                let otherPlayerNames = this.otherPlayers.map((player) => {
                    return player.name;
                });
                let selectOtherPlayerNameQuestion = promptQuestions.multipleChoiceQuestion('otherPlayerName', 'Who do you want to pass the ball to?', otherPlayerNames, true);
                promptQuestions.ask(selectOtherPlayerNameQuestion).then((answers) => {
                    round.toPlayer = _.find(this.otherPlayers, (player) => {
                        return player.name == answers.otherPlayerName;
                    });
                    round.toPlayer.points += 1;
                    this.playerWithBall = round.toPlayer;
                    resolve();
                }, (err) => {
                    reject(err);
                });
            }
        });
    }
}


module.exports = Game