#! /usr/bin/env node

const _ = require('lodash');
const colors = require('colors');
const commandLineArgs = require('command-line-args')

const fileWriter = require('./file-writer');
const promptQuestions = require('./prompt-questions');
const templater = require('./templater');
const Game = require('./game');

const commandLineOptionDefinitions = [{
        name: 'players',
        alias: 'p',
        type: Number,
        defaultValue: 4
    },
    {
        name: 'rounds',
        alias: 'r',
        type: Number,
        defaultValue: 10
    },
    {
        name: 'targetProbability',
        alias: 't',
        type: Number,
        defaultValue: .2
    },
    {
        name: 'maxDecisionDuration',
        alias: 'd',
        type: Number,
        defaultValue: 6000
    }
];

const commandLineValues = commandLineArgs(commandLineOptionDefinitions);

const gameOptions = {
    name: 'Ball Game',
    maxPlayerCount: Math.max(2, Math.round(commandLineValues.players)),
    maxRoundCount: Math.max(1, Math.round(commandLineValues.rounds)),
    prizeDescription: 'a piece of candy',
    mainPlayerName: 'You',
    probabilityToPassToMainPlayer: Math.min(1, Math.max(0, commandLineValues.targetProbability)),
    minWaitDuration: 200,
    maxWaitDuration: Math.max(200, Math.round(commandLineValues.maxDecisionDuration)),
};

const game = new Game(gameOptions);

let experiment = {
    game: game
};

function intro(settings) {

    return new Promise((resolve, reject) => {
        templater.print();
        templater.print('welcome', game.options);

        askPreTestQuestions().then((preTestAnswers) => {
            experiment.preTestAnswers = preTestAnswers;
            templater.print();
            templater.print('instructions', game.options);

            let readyQuestion = promptQuestions.yesNoQuestion('readyToPlay', 'Are you ready to play?');
            promptQuestions.ask(readyQuestion).then((answers) => {
                if (!answers.readyToPlay) {
                    resolve(answers.readyToPlay);
                    return;
                }

                templater.print();
                templater.print('logged-in', game);

                game.start().then(() => {
                    resolve(answers.readyToPlay);
                }, (err) => {
                    reject(err);
                });

            }, (err) => {
                reject(err);
            })

        }, (err) => {
            reject(err);
        });
    })
}

function askPreTestQuestions() {
    let preTestQuestions = [
        promptQuestions.textQuestion('firstName', 'What is your first name?'),
        promptQuestions.ageQuestion(),
        promptQuestions.genderQuestion(),
        promptQuestions.raceQuestion(),
        promptQuestions.ethnicityQuestion(),
        promptQuestions.scaleQuestion('friendshipSupport', 'I feel supported by my friends.'),
    ];
    experiment.preTestQuestions = preTestQuestions;
    let shouldShuffleQuestions = false;
    return promptQuestions.ask(preTestQuestions);
}

function askPostTestQuestions() {
    let postTestQuestions = [
        promptQuestions.scaleQuestion('fairness', 'I think the rules of the game are fair.'),
        promptQuestions.scaleQuestion('enjoyed', 'I enjoyed the game.'),
        promptQuestions.scaleQuestion('ignored', 'I feel like the other players ignored me.'),
    ];
    let shouldShuffleQuestions = true;
    experiment.postTestQuestions = postTestQuestions;
    return promptQuestions.ask(postTestQuestions, shouldShuffleQuestions);
}

function finish(readyToPlay) {
    if (!readyToPlay) {
        fileWriter.writeToFile('data', experiment).then(() => {
            templater.print();
            templater.print('thankyou', game);
            process.exit();
            return;
        }, (err) => {
            templater.print();
            templater.print('thankyou', game);
            process.exit();
            return;
        });
    }

    showWinner().then(() => {
        askPostTestQuestions().then((postTestAnswers) => {
            experiment.postTestAnswers = postTestAnswers;
            fileWriter.writeToFile('data', experiment).then(() => {
                templater.print();
                templater.print('thankyou', game);
                process.exit();
                return;
            }, (err) => {
                templater.print();
                templater.print('thankyou', game);
                process.exit();
                return;
            });
        }, (err) => {
            console.log(err);
            process.exit();
        });
    }, (err) => {
        templater.print();
        templater.print('thankyou', game);
        process.exit();
        return;
    });
}

function showWinner() {
    return new Promise((resolve, reject) => {
        templater.print('winners', game);
        resolve();
    });
}

intro().then((readyToPlay) => {
    finish(readyToPlay);
});