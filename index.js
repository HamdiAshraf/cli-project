import fs from 'fs';
import fetch from 'node-fetch';
import inquirer from 'inquirer';
import { Command } from 'commander';
const program = new Command();


const questions = [
    {
        type: 'input',
        name: 'username',
        message: 'Enter GitHub username: ',
    },
];

program
    .name('get-repos')
    .description('CLI to get GitHub repositories for a user')
    .version('1.0.0');

program.command('get-repos')
    .description('get repositories for a user')
    .action(() => {
        inquirer
            .prompt(questions)
            .then(async (answers) => {
                const { username } = answers;
                try {
                    const response = await fetch(`https://api.github.com/users/${username}/repos`);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch repositories for user ${username}`);
                    }
                    const repositories = await response.json();
                    const repositoryNames = repositories.map(repo => repo.name);
                    const fileName = `${username}.txt`;
                    fs.writeFile(fileName, repositoryNames.join('\n'), 'utf8', (err) => {
                        if (err) {
                            throw new Error(`Failed to write to file ${fileName}`);
                        }
                        console.log(`Repository names for user ${username} saved to ${fileName}`);
                    });
                } catch (error) {
                    console.error(error.message);
                    process.exit(1);
                }
            });
    });

program.parse();
