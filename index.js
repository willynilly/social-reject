const _ = require('lodash');
const colors = require('colors');

const fileWriter = require('./file-writer');
const promptQuestions = require('./prompt-questions');
const templater = require('./templater');
const Game = require('./game');

const gameOptions = {
    name: 'Ball Game',
    maxPlayerCount: 3,
    maxRoundCount: 5,
    prizeDescription: 'a piece of candy',
    mainPlayerName: 'you',
    probabilityToPassToMainPlayer: .2,
    minWaitDuration: 200,
    maxWaitDuration: 3000
};
const game = new Game(gameOptions);

let experiment = {
    game: game
};

function intro(settings) {

    return new Promise((resolve, reject) => {
        templater.print();
        templater.print('welcome', game);

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