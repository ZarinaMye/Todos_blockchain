export const ShowTodoList = ({removeTodoTask, todoList, changeTodoTaskCompleted}) => {

    return (
        <ul className="todoList">

            {todoList.map((todo) => {

                const taskDone = todo.completed === true ? 
                <p className="taskDone">Task done!</p>:<p className="taskUndone">Done?</p>

                return (

                    <li key={todo.id} className="todoTask"> 
                        <h3>{todo.text}</h3>
                       {/*  <p>{todo.completed.toString()}</p>  */}
                         <div> 
                            <input type = "checkbox" name="completed" onChange={() => changeTodoTaskCompleted(todo.id)} 
                            checked={todo.completed} readOnly></input>
                            {taskDone}
                        </div> 
                        <button onClick={() => removeTodoTask(todo.id)}>Remove</button>
                    </li>
                );    
            })};
        </ul>
    );    
};