import { useState } from "react";
import { TodoTask } from "../models/TodoTask";

export const TodoForm = ({addTodoTask}) => {

    const [todoTask, setTodoTask] = useState(new TodoTask(""));
  
    const handleChange = (e) => {

        if (e.target.type === "text") {
            setTodoTask({ ...todoTask, [e.target.name]: e.target.value }); 
        }   
    };

    const handleSubmit = (e) => {
        e.preventDefault(); 
        addTodoTask(todoTask);
    };

    return (
        <form onSubmit={handleSubmit}>
             <label>Enter todo-task: </label>
            <input
                placeholder="Write a task"
                type="text"
                value={todoTask.content} 
                onChange={handleChange} 
                name="content"
                required 
            />
            <button>Save</button>
        </form>
    ); 
};