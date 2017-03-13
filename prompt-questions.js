const inquirer = require('inquirer');
const _ = require('lodash');

function yesNoQuestion(name, message) {
    let question = {
        name: name,
        type: 'confirm',
        message: message,
    };
    return question;
}

function textQuestion(name, message) {
    let question = {
        name: name,
        type: 'input',
        message: message,
    };
    return question;
}

function multipleChoiceQuestion(name, message, choices, shouldShuffleChoices, defaultChoice) {
    let question = {
        name: name,
        type: 'rawlist',
        message: message,
        choices: shouldShuffleChoices ? _.shuffle(choices) : choices
    };
    if (defaultChoice != undefined) {
        question.default = defaultChoice;
    }
    return question;
}

function scaleQuestion(name, message) {
    let choices = [
        'Strongly Disagree',
        'Disagree',
        'Neutral',
        'Agree',
        'Strongly Agree'
    ];
    message = 'To what extent do you agree with the following statement: ' + "\n" + message + "\n";
    return multipleChoiceQuestion(name, message, choices, false, choices.indexOf('Neutral'));
}

function ageQuestion() {
    return textQuestion('age', 'What is your age?');
}

function genderQuestion() {
    return multipleChoiceQuestion('gender', 'What is your gender?', ['female', 'male'], true, 0);
}

function raceQuestion() {
    return multipleChoiceQuestion('race', 'What is your race/ethnicity', ['White', 'African American', 'Asian', 'Native American'], true, 0);
}

function ask(questions, shouldShuffleQuestions) {
    if (shouldShuffleQuestions) {
        questions = _.shuffle(questions);
    }
    return inquirer.prompt(questions);
}

module.exports = {
    raceQuestion: raceQuestion,
    genderQuestion: genderQuestion,
    ageQuestion: ageQuestion,
    scaleQuestion: scaleQuestion,
    multipleChoiceQuestion: multipleChoiceQuestion,
    yesNoQuestion: yesNoQuestion,
    textQuestion: textQuestion,
    ask: ask
}