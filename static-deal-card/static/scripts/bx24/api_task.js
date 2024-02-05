

export default class TaskMethods {
    constructor(bx24) {
        this.bx24 = bx24;
    }

    async get(taskId) {
        let task_data = await this.bx24.callMethod("tasks.task.get", {
            "taskId": taskId,
            "select": ['ID', 'TITLE']
        });
        return task_data;
    }
    
    async add(data) {
        let result = await this.bx24.callMethod("tasks.task.add", {
            fields: data
        });
        return result;
    }
    
    async update(taskId, dataTask) {
        let result = await this.bx24.callMethod("tasks.task.update", {
            "taskId": taskId,
            "fields": dataTask
        });
        return result;
    }
    
    async addComment(taskId, msg, authorId) {
        let data = await this.bx24.callMethod("task.commentitem.add", {
            "taskId": taskId,
            "fields": {
                "AUTHOR_ID": authorId,
                "POST_MESSAGE": msg
            }
        }
        );
        console.log("Отправлен комментарий, овет от Битрикс: ", data);
        return data;
    }
}