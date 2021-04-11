#!/usr/bin/env node

const chalk = require('chalk');
const commandLineUsage = require('command-line-usage');
const tools = require('./../_tools');
const fs = require('fs-extra');
const LuckyCase = require('lucky-case/string');
const glob = require('glob');
const CurlyBracketParser = require('curly-bracket-parser');

class SipaCliNew {
    static new() {
        const self = SipaCliNew;
        let section = tools.colorizeValues(self.SECTIONS.new_begin, ['desc'], 'green');
        const usage = commandLineUsage(section);
        console.log(usage);
        self._enterVariables();
        self._createProjectStructure();
    }

    static _enterVariables() {
        const self = SipaCliNew;
        let project_name = null;
        while(true) {
            project_name = tools.cliQuestion('Please enter your project name', null, null, true);
            const project_dir = process.cwd() + '/' + project_name.toDashCase();
            if(fs.existsSync(project_dir)) {
                console.log(chalk.red(`  Invalid project name '${project_name}'. There is already a directory '${project_name.toDashCase()}'.`));
            } else {
                break;
            }
        }
        self.options.project_name = project_name;
        self.options.project_version = tools.cliQuestion('Please enter your initial project version', null, self.options.project_version);
        self.options.author = tools.cliQuestion('Please enter your project author name', null, '');
        self.options.email = tools.cliQuestion('Please enter your project author email address', null, '');
    }

    static _createProjectStructure() {
        const self = SipaCliNew;
        let section = tools.colorizeValues(self.SECTIONS.new_create, ['desc'], 'green');
        let usage = commandLineUsage(section);
        console.log(usage);
        // create project dir
        const project_dir = process.cwd() + '/' + self.options.project_name.toDashCase();
        tools.print(`Creating project dir ...`);
        if (!fs.existsSync(project_dir)) {
            fs.mkdirSync(project_dir);
        }
        tools.printLine(chalk.green(project_dir));
        tools.printLine();
        // copy project template
        tools.print(`Copying default project template ...`);
        const template_src = tools.sipaRootPath() + '/lib/templates/project/default';
        fs.copySync(template_src, project_dir);
        tools.printLine(chalk.green('done'));
        // fit project files
        tools.printLine();
        tools.print(`Fitting project template ...`);
        const package_json = {
            name: LuckyCase.toDashCase(self.options.project_name),
            description: self.options.project_name,
            version: self.options.project_version,
            author: { name: self.options.author, email: self.options.email }
        };
        const final_json = JSON.stringify(package_json, null, 2);
        fs.writeFileSync(project_dir + '/package.json', final_json);
        // replace vars in files
        const file_variables = {
            version: package_json.version,
            project_name: package_json.name,
        }
        glob(project_dir + "/**/*", { nodir: true }, function (er, files) {
            files.forEach((file) => {
                CurlyBracketParser.parseFileWrite(file,file_variables, { unresolved_vars: 'keep' });
            });
        });
        tools.printLine(chalk.green('done'));
        // final message
        section = tools.colorizeValues(self.SECTIONS.new_ready, ['desc'], 'green');
        usage = commandLineUsage(section);
        console.log(usage);
    }
}

SipaCliNew.options = {
    project_name: null,
    project_version: '0.0.1',
    author: null
};

SipaCliNew.SECTIONS = {};
SipaCliNew.SECTIONS.new_begin = [
    {
        header: 'Create new project',
        content: [
            'Welcome to the project wizard to create a new Sipa project! 🧙',
            'Answer the questions wisely!',
        ]
    },
    {
        header: "Let's get started ...",
    }
];
SipaCliNew.SECTIONS.new_create = [
    {
        header: 'Creating project ...'
    }
];
SipaCliNew.SECTIONS.new_ready = [
    {
        header: 'Ready to start!',
        content: [
            `Hey, your basic project has been created, it's time to have fun again! 🎁`,
            '',
            `If you have no idea how to get started, read the documentation 📄 at {underline.blue https://github.com/magynhard/sipa#readme}`,
            '',
            "And don't forget to tell one person today, that you love him or her! ❤️",
            '',
            "To start and run your development live web server {green cd} into your project directory and then run {green sipa server} or its shortcut {green sipa s}!"
        ]
    }
];

module.exports = SipaCliNew;