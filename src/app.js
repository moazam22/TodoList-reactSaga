const express = require('express');
const app = express();
const port = process.env.Port || 3001;
require('./db/conn');
const List = require('./models/lists');
app.use(express.json());

let cors = require('cors')
app.use(cors()) 



if(process.env.NODE_ENV === 'production'){
	app.use(express.static(path.join(__dirname, './build')));

	app.get('*', function(req,res){
		res.sendFile(path.join(__dirname,'./build', 'index.html'));
	});
}





app.get('/lists', async(req,res)=>{
	try{
		const listData = await List.find();
		res.status(200).send({data: {listData}});	
	}catch(e){
		res.status(400).send({error: "Cannot fetch data", reason: e});
	}
	
})

app.post('/lists', async(req,res)=>{
	const list = new List(req.body);
	try{
		const createList = await list.save();
		const newList = await List.find();
		res.status(201).send(newList); 
	}catch(e){
		res.status(400).send({res: "Error in posting data", reason: e})
	}
})

app.put('/lists/:id', async(req,res)=>{
	try{
		const { id } = req.params;
		const { name } = req.body;
		await List.updateOne({_id:id},{name:name});
		let newList = await List.find();
		res.status(200).send({data:newList});

	}catch(e){
		res.status(400).send({res: "Error in updating data", reason: e})
	}
})

app.delete('/lists/delete/:id', async(req,res)=>{
	const id = req.params.id;
	try{
		let deletedList = await List.findOneAndDelete({ _id: id });
		let listData = await List.find();
		res.status(200).send({Success: 'True', data: listData })
	}catch(e){
		res.status(400).send({res: "Error in posting data", reason: e})
	}
})


//-----------------------API's FOR TODOS---------------------------------

// Post todo

app.post('/list/todo/:id', async(req,res)=>{
	try{
		const {id} = req.params;
		const newTodo = req.body;
		let list = await List.findById(id);
		list.todos = [...list.todos,newTodo];
		let result = await List.updateOne({_id:id},{todos:list.todos})
		let newTodos = await List.findById(id);
		res.status(200).send(newTodos);
	}catch(e){
		console.log("Error", e);
		res.status(400).send({res: "Error in posting todos", reason: e})
	}
})


//update a todo


app.put('/list/todo/:id', async(req,res)=>{
	try{
		const {id} = req.params;
		const newTodo = req.body;
		let list = await List.findById(id);
		let todoToUpdate = list.todos.filter(todo=> todo._id.toString() !== newTodo.id)
		list.todos = [...todoToUpdate, newTodo]; 
		let re = await List.updateOne({_id:id},{todos:list.todos});
		let newTodos = await List.findById(id);
		res.status(200).send(newTodos);
	}catch(e){
		console.log(e)
		res.status(400).send({res: "Error in updating todos", reason: e})
	}
})


//ToggleStatus

app.put('/list/todo/changeStatus/:id', async(req,res)=>{
	try{
		const {id} = req.params;
		const newTodo = req.body;
		let list = await List.findById(id);
		let index = null;
		let todoToUpdate = list.todos.filter((todo,i)=> {
			if(todo._id.toString() === newTodo.id){
				index = i;
				return todo;
			}
		});
		list.todos[index] = {title: todoToUpdate[0].title, dueDate: todoToUpdate[0].dueDate, marked: !todoToUpdate[0].marked, _id: todoToUpdate[0]._id}
		await List.updateOne({_id:id},{todos: list.todos});
		let newTodos = await List.findById(id);
		res.status(200).send(newTodos);
	}catch(e){
		console.log(e)
		res.status(400).send({res: "Error in updating todos", reason: e})
	}
})


//Delete a todo

app.put('/list/todo/delete/:id', async(req,res)=>{
	try{
		const {id} = req.params;
		const todoId = req.body.id;
		let list = await List.findById(id);
		let todoToUpdate = list.todos.filter(todo=> todo._id.toString() !== todoId)
		list.todos = [...todoToUpdate]; 
		await List.updateOne({_id:id},{todos:list.todos});
		let newTodos = await List.findById(id);
		res.status(200).send(newTodos);
	}catch(e){
		res.status(400).send({res: "Error in delet todos", reason: e})
	}
})







app.listen(port, ()=>{
	console.log("Server is live and running on Port No. :",port);
})

