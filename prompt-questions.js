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
    let choices = getAgreementScale();
    message = 'To what extent do you agree with the following statement: ' + "\n" + message + "\n";
    return multipleChoiceQuestion(name, message, choices, false, choices.indexOf('Neutral'));
}

function getAgreementScale() {
    let agreementScale = [
        'Strongly Disagree',
        'Disagree',
        'Neutral',
        'Agree',
        'Strongly Agree'
    ];
    return agreementScale;
}

function ageQuestion() {
    return textQuestion('age', 'What is your age?');
}

function genderQuestion() {
    let genders = getGenders();
    return multipleChoiceQuestion('gender', 'What is your gender?', genders, true, 0);
}

function getGenders() {
    let genders = ['female', 'male', 'transgender'];
    return genders;
}

function raceQuestion() {
    let races = getRaces();
    return multipleChoiceQuestion('race', 'What is your race?', races, true, 0);
}

function getRaces() {
    let races = [
        'American Indian or Alaska Native',
        'Asian',
        'Black or African American',
        'Native Hawaiian or Other Pacific Islander',
        'White'
    ];
    return races;
}

function ethnicityQuestion() {
    let ethnicities = getEthnicities();
    return multipleChoiceQuestion('ethnicity', 'What is your ethnicity?', ethnicities, true, 0);
}

function getEthnicities() {
    let ethnicities = [
        'Hispanic or Latino',
        'Not Hispanic or Latino'
    ];
    return ethnicities;
}

function ask(questions, shouldShuffleQuestions) {
    if (shouldShuffleQuestions) {
        questions = _.shuffle(questions);
    }
    return inquirer.prompt(questions);
}

module.exports = {
    raceQuestion: raceQuestion,
    ethnicityQuestion: ethnicityQuestion,
    genderQuestion: genderQuestion,
    ageQuestion: ageQuestion,
    scaleQuestion: scaleQuestion,
    multipleChoiceQuestion: multipleChoiceQuestion,
    yesNoQuestion: yesNoQuestion,
    textQuestion: textQuestion,
    ask: ask,
    getEthnicities: getEthnicities,
    getRaces: getRaces,
    getGenders: getGenders,
    getAgreementScale: getAgreementScale,
}