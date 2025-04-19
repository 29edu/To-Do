const express =  require('express')
const path = require('path')
const PORT = 8000
const cors = require('cors')
const fs = require('fs')

const app = express()
app.use(express.json())
app.use(express.static(__dirname))
app.use(cors())

const DATE_FILE = path.join(__dirname, 'task.json');

// Function to read tasks from the JSON file
function readTasksFromFile() {
    try {
        
        const data = fs.readFileSync(DATE_FILE, 'utf8');
        return JSON.parse(data)
    } catch(error) {
        console.error('Error reading task file', error);
        return [];
    }
}

function writeTasksToFile(tasks) {
    try {
        fs.writeFileSync(DATE_FILE, JSON.stringify(tasks,null, 2), 'utf8');
        return true;
    } catch(error) {
        
    }
}

let tasks = fs.existsSync(DATE_FILE) ? readTasksFromFile() : [];

app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/tasks', (req, res) => {
    res.json(tasks);
})

app.post('/tasks', (req, res) => {
    const {priority, task, startingDate, endingDate, timeLeft} = req.body;
    if(!priority || !task || !startingDate || !endingDate || !timeLeft) {
        return res.status(401).json('Something is missing');
    }

    const id = tasks.length > 0 ? Math.max(...tasks.map(t => t.id))+1:1;
    const TASK = {id, priority, task, startingDate, endingDate, timeLeft}
    tasks.push(TASK);

    if(writeTasksToFile(tasks)) {
        res.status(201).json(TASK)
    }
    else {
        res.status(501).json({error: 'Failed to save task'});
    }
})

// app.delete('/task/:id', (req, res) => {
//     const taskId = parseInt(body.params.id);

//     const taskIndex
// })

app.listen(PORT, () => {
    console.log(`The server is running at http://localhost:${PORT}`);
})
