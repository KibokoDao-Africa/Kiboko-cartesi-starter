import { Command } from '@oclif/core';
/* eslint-disable perfectionist/sort-objects */
// eslint-disable-next-line unicorn/prefer-node-protocol
import { execSync } from 'child_process';
// eslint-disable-next-line import/default
import fs from 'fs-extra'; // For file system operations
import inquirer from 'inquirer';
// eslint-disable-next-line unicorn/prefer-node-protocol
import path from 'path';
import { simpleGit } from 'simple-git';
export default class Init extends Command {
    async run() {
        await initProject();
    }
}
async function initProject() {
    const { projectName } = await inquirer.prompt([
        {
            type: 'input',
            name: 'projectName',
            message: 'Enter a name for your project:',
            // eslint-disable-next-line no-implicit-coercion
            validate: (input) => !!input || 'Please provide a project name', // Input validation
        }
    ]);
    const projectDir = path.join(process.cwd(), projectName);
    try {
        checkSunodoInstallation();
        // eslint-disable-next-line unicorn/prefer-optional-catch-binding
    }
    catch (error) {
        console.error("Error: 'sunodo' is not installed.");
        console.log("Please install using: npm install -g @sunodo/cli");
        return; // Stop execution
    }
    await setupProject(projectDir);
    console.log('Project initialization complete!');
}
async function setupProject(projectDir) {
    fs.ensureDirSync(projectDir); // Create the project directory
    process.chdir(projectDir); // Change into the project directory
    // ... Your frontend selection and cloneAndSetup logic ...
    const { frontendTemplate } = await inquirer.prompt([
        // Frontend selection
        {
            type: 'list',
            name: 'frontendTemplate',
            message: 'Select a frontend template:',
            choices: [{ name: 'React Template', value: 'https://github.com/prototyp3-dev/frontend-web-cartesi' }],
        },
    ]);
    await cloneAndSetup('frontend', frontendTemplate);
    process.chdir(projectDir); // Change back to the original directory 
    // backend selection and setupBackendWithCommand logic ...
    const { backendTemplate } = await inquirer.prompt([
        // Updated backend choices
        {
            type: 'list',
            name: 'backendTemplate',
            message: 'Select a cartesi server backend template:',
            choices: [
                { name: 'Typescript', value: 'sunodo create cartesi-typescript-backend --template typescript' },
                { name: 'Python', value: 'sunodo create cartesi-python-backend --template python' },
                { name: 'Go', value: 'sunodo create cartesi-go-backend --template go' },
                { name: 'C++', value: 'sunodo create cartesi-cpp-backend --template cpp' },
                { name: 'Rust', value: 'sunodo create cartesi-rust-backend --template rust' },
                { name: 'Ruby', value: 'sunodo create cartesi-ruby-backend --template ruby' },
                { name: 'Lua', value: 'sunodo create cartesi-lua-backend --template lua' },
            ],
        },
    ]);
    await setupBackendWithCommand(backendTemplate);
}
function checkSunodoInstallation() {
    try {
        execSync('sunodo --version', { stdio: 'ignore' }); // Try executing sunodo
        // eslint-disable-next-line unicorn/prefer-optional-catch-binding
    }
    catch (error) {
        throw new Error('sunodo not installed');
    }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function cloneAndSetup(targetDir, repoUrl) {
    const git = simpleGit();
    await git.clone(repoUrl, targetDir);
    // New Steps:
    process.chdir(targetDir); // Change into the cloned directory
    try {
        execSync('yarn install', { stdio: 'inherit' }); // Install dependencies
        fs.removeSync('.git'); // Delete the .git folder
    }
    catch (error) {
        console.error(`Error setting up frontend in ${targetDir}:`, error);
    }
}
async function setupBackendWithCommand(commandTemplate) {
    try {
        execSync(commandTemplate, { stdio: 'inherit' }); // Execute and inherit output
    }
    catch (error) {
        console.error('Error setting up backend:', error);
    }
}
``;
