const jsrender = require('jsrender');
const path = require('path');
const relPath = './' + path.relative(process.cwd(), path.dirname(require.main.filename));

function print(templateNameOrString, templateData, isString) {
    if (Array.isArray(templateNameOrString)) {
        templateNameOrString.forEach((e) => {
            print(e, templateData, isString);
        })
    } else if (templateNameOrString != '' && templateNameOrString !== null && templateNameOrString !== undefined) {
        let templateFilePathOrString = !isString ? relPath + '/templates/' + templateNameOrString + '.txt' : templateNameOrString
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