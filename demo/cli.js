const inquirer = require('inquirer').default;
const axios = require('axios');

const BASE_URL = 'http://localhost:3000/todos';

async function showMenu(){
        const answer = await inquirer.prompt({
                type: 'list',
                name: 'action',
                message: 'What do you want to do?',
                choices: ['View todo', 'Add todo', 'Remove todo', 'Done todo', 'Exit'],
        });

        if(answer.action == 'View todo'){
                const res = await axios.get(BASE_URL);
                console.log('\n📋 Your Todos:');
                res.data.forEach(todo => {
                        console.log(`- [${todo.done ? 'X' : ' '}] \nID Task: ${todo.id} \nDate: ${todo.date} \nTask: ${todo.task} \n`);
                });
                console.log();
                return showMenu();
        }
        else if(answer.action == 'Add todo'){
                const { task } = await inquirer.prompt({
                        type: 'input',
                        name: 'task',
                        message: 'Enter a new task:'
                });

                await axios.post(BASE_URL, { task });

                console.log("Task added!\n");
                return showMenu();
        }
        else if(answer.action == 'Remove todo'){
                const res = await axios.get(BASE_URL);

                const choices = res.data.map(todo => ({
                        name: `[${todo.done ? 'x' : ' '}] ${todo.task}`,
                        value: todo.id,
                }));

                if(choices.length == 0){
                        console.log("Tidak ada todo!");
                        return showMenu();
                }

                const { id } = await inquirer.prompt({
                        type: 'list',
                        name: 'id',
                        message: 'Select ID to remove:',
                        choices
                });

                await axios.delete(`${BASE_URL}/${id}`);
                console.log("Task removed\n");
                return showMenu();
        }
        else if(answer.action  == 'Done todo'){
                const res = await axios.get(BASE_URL);
                
                if(res.data.length === 0){
                        console.log("No todos found!");
                        return showMenu();
                }

                const { id } = await inquirer.prompt({
                        type: 'list',
                        name: 'id',
                        message: 'Select todo to be marked done:',
                        choices: res.data.map(todo => ({
                                name: `[${todo.done ? 'X' : ' '}] ${todo.task}`,
                                value: todo.id       
                        }))
                });

                await axios.put(`${BASE_URL}/${id}/done`);
                console.log("Done!");
                return showMenu();
        }
}
showMenu();