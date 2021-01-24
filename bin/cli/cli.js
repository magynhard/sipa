#!/usr/bin/env node

const commandLineArgs = require('command-line-args');
const chalk = require('chalk');

const SimparticCliTools = require('./_tools');
const SimparticCliHelp = require('./tasks/_help');

const taskDefinitions = [
    {name: 'command', type: String, multiple: true, defaultOption: true}, // fall back command
    {name: 'about', alias: 'a', type: Boolean},
    {name: 'build', alias: 'b', type: Boolean},
    {name: 'generate', alias: 'g', type: Boolean},
    {name: 'help', alias: 'h', type: Boolean},
    {name: 'indexer', alias: 'i', type: Boolean},
    {name: 'license', alias: 'l', type: Boolean},
    {name: 'new', alias: 'n', type: Boolean},
    {name: 'server', alias: 's', type: Boolean},
    {name: 'version', alias: 'v', type: Boolean},
]

const tasks = commandLineArgs(taskDefinitions, {partial: true});

function logo() {
    console.log(SimparticCliTools.logo());
}

//
// about
//
if (tasks.about || tasks.command && (tasks.command[0] === 'about' || tasks.command[0] === 'a')) {
    logo();
    const SimparticCliAbout = require('./tasks/_about');
    SimparticCliAbout.about();
}
//
// build
//
else if (tasks.build || tasks.command && (tasks.command[0] === 'build' || tasks.command[0] === 'b')) {
    logo();
    const SimparticCliBuild = require('./tasks/_build');
    SimparticCliBuild.build();
}
//
// version
//
else if (tasks.version || tasks.command && (tasks.command[0] === 'version' || tasks.command[0] === 'v')) {
    const SimparticCliVersion = require('./tasks/_version');
    SimparticCliVersion.version();
}
//
// license
//
else if (tasks.license || tasks.command && (tasks.command[0] === 'license' || tasks.command[0] === 'l')) {
    logo();
    const SimparticCliLicense = require('./tasks/_license');
    SimparticCliLicense.license();
}
//
// new
//
else if (tasks.new || tasks.command && (tasks.command[0] === 'new' || tasks.command[0] === 'n')) {
    logo();
    const SimparticCliNew = require('./tasks/_new');
    SimparticCliNew.new();
}
//
// generate
//
else if (tasks.generate || tasks.command && (tasks.command[0] === 'generate' || tasks.command[0] === 'g')) {
    logo();
    const SimparticCliGenerate = require('./tasks/_generate');
    SimparticCliGenerate.generate();
}
//
// server
//
else if (tasks.server || tasks.command && (tasks.command[0] === 'server' || tasks.command[0] === 's')) {
    logo();
    const SimparticCliServer = require('./tasks/_server');
    SimparticCliServer.server();
}
//
// help
//
else if (Object.keys(tasks).length === 0 || tasks.help || tasks.command && (tasks.command[0] === 'help' || tasks.command[0] === 'h')) {
    logo();
    SimparticCliHelp.help();
} else {
    logo();
    let unknown_option = tasks ? tasks.command ? tasks.command[0] : tasks._unknown[0].replace(/-/g,'') : tasks._unknown[0].replace(/-/g,'');
    SimparticCliHelp.unknown(unknown_option);
}