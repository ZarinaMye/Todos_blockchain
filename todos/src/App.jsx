import './App.css';
import { useEffect, useState } from "react";
import Web3 from "web3";
import { TodoForm } from './components/TodoForm'; 
import { Text } from './components/Text';
import { TODOLIST_ADRESS, TODOLIST_ABI } from "./config";
import { ShowTodoList} from './components/ShowTodoList'; 

function App() {

  const [account, setAccount] = useState();
  const [contract, setContract] = useState(); 
  const [todoList, setTodoList] = useState([]);  

  useEffect (() =>{

    const getAccounts = async () => {

      const web3 = new Web3(Web3.givenProvider||"http://localhost:7545");//ta reda på vem som är inloggad
      const accountLoggedIn = await web3.eth.getAccounts(); //inbyggd funktion, hämtar alla konton
      
      setAccount(accountLoggedIn[0]); 
      //dvs ta den första(som är inloggad) och lägga i vårt state. Behövs för att kunna spara info till blockkedjan
      //console.log(accountLoggedIn);

      const contract = new web3.eth.Contract(TODOLIST_ABI, TODOLIST_ADRESS); 
      //Contract = klass med konstruktor som ger oss ett objekt tillbaka
      //todoListContract = variabel som motsvarar vårt kontrakt, i react 
      setContract(contract); // för att skicka till blockkedjan
      
      await updatedTodoList(contract);
    };

    if(account) return; //kolla om konto finns
    getAccounts();
  });

  const updatedTodoList = async (contract) => {
    let todoIndexes = await contract.methods.todoCount().call(); // [1, 2, 3] =ger id

    let todoList = [];
    for (let i =1; i <= todoIndexes; i++) {
      let todo = await contract.methods.todos(i).call();
      if (todo.id && todo.text) { //För att ta bort de block som är deleteade från att visas
        todoList.push(todo);
      };        
    };

    setTodoList(todoList);
  }; 

  const addTodoTask = async(todoTask) => {

    await contract.methods
    .createTodo(todoTask.content) //todoTask.completed
    .send({ from: account }) //när vi ändar i bc
    .once("receipt", async (receipt) => { //när användare ok trans i metamask, får vi kvitto tillbaka
      console.log(receipt);

      updatedTodoList(contract); //skriver ut alla våra todos...//await?
    });
  }; 

  const removeTodoTask = async(id) => { //id
    
    await contract.methods
    .removeTodo(id)
    .send({ from: account })
    .once("receipt", async (receipt) => { 
      console.log(receipt);

      updatedTodoList(contract);
    });
  }; 

  const changeTodoTaskCompleted = async(id) =>{

    await contract.methods
    .toggleTodo(id) //härifrån gör om till en js fil och åberopa den funktionen härifrån!
    .send({ from: account })
    .once("receipt", async (receipt) => { //Behövs ej eg.
      console.log(receipt);

      updatedTodoList(contract);
    });
  };
  
  return (
    <div className="App">
      <Text/>
      <TodoForm
        addTodoTask={addTodoTask} 
      /> 
      <p>Connected account: {account}</p>
      <ShowTodoList
        todoList={todoList}
        removeTodoTask={removeTodoTask}  
        changeTodoTaskCompleted={changeTodoTaskCompleted}
      /> 
    </div>
  ); 
};

export default App;