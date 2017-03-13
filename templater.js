const jsrender = require('jsrender');

function print(templateNameOrString, templateData, isString) {
    if (Array.isArray(templateNameOrString)) {
        templateNameOrString.forEach((e) => {
            print(e, templateData, isString);
        })
    } else if (templateNameOrString != '' && templateNameOrString !== null && templateNameOrString !== undefined) {
        let templateFilePathOrString = !isString ? './templates/' + templateNameOrString + '.txt' : templateNameOrString
        let template = jsrender.templates(templateFilePathOrString);
        let rendered = template.render(templateData);
        console.log(rendered);
        console.log('');
    } else {
        console.log('');
    }
}

module.exports = {
    print: print
}