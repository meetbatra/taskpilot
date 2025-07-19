// It contains the logic of CRUD
// var obj = {key:value, key:value}
const todoOperations = {
    // addTask : function(){

    // }
    tasks:[], 
    getTotal(){
        return this.tasks.length;
    },
    addTask(task){
        this.tasks.push(task);
    },
    removeTask(){
        this.tasks = this.tasks.filter(task => !task.isMarked);
    },
    searchTask(){

    },
    updateTask(updatedTask){
        this.tasks = this.tasks.map(task => task.id === updatedTask.id ? {...updatedTask} : task);
    },
    sortTask(toAsc){
        if(toAsc){
            this.tasks.sort((a,b) => a.name.localeCompare(b.name));
        } else {
            this.tasks.sort((a,b) => b.name.localeCompare(a.name));
        }
    },
    saveTasks(){
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    },
    loadTasks(){
        const tasks = localStorage.getItem('tasks')
        if(tasks){
            this.tasks = JSON.parse(tasks);
        }
    },
    clearAll(){
        localStorage.removeItem('tasks');
    },
    toggleTask(id){
        const task = this.tasks.find(task => task.id == id);
        task.isMarked = !task.isMarked;
    },
    getMarked(){
        return this.tasks.filter(task => task.isMarked).length;
    },
    getUnmarked(){
        return this.tasks.filter(task => !task.isMarked).length
    }
}
export default todoOperations;
