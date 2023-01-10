const Task = require('../models/task');

//Este es el controlador

class TaskList {
    /**
     * Manejar APIs y despliega maneja los task
     * @param {Task} taskObjeto 
     */
    constructor(task){
        this.taskObjeto = taskObjeto;
    }

    async showTasks(req, res) {
        const querySpec = {
            query: "SELECT * FROM root r WHERE r.completed=@completed",
            parameters: {
                name: "@completed",
                value: false    
            }
        }

        const items = await this.taskObjeto.find(querySpec);
        res.render("index", {
            title: "Mi lista de pendientes",
            tasks: items
        });
    }

    async addTask(req,res) {
        const item = req.body;

        await this.taskObjeto.addItem(item);
        res.redirect('/');
    }

    async completeTask(req,res){
        const completedTask = Object.keys(req.body);
        const task = [];

        this.completeTask.forEach(task => {
            task.push(this.taskObjeto.updateItem(task));
        });

        await Promise.all(task);

        res.redirect("/");
    }
}

module.exports = TaskList;