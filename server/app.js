const express = require('express')
let users = require('./userData')
const cors = require('cors')
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const TaskModel = require('./Models/Todo')
const sequelize = require('./bdd/db')
require('dotenv').config()

const app = express()
const port = process.env.port || 3500

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Autoriser toutes les origines pour les débuts de développement, à ajuster en production
app.use(cors({ origin: 'http://localhost:3000' }));

const Task = TaskModel(sequelize, Sequelize);

app.use(express.json())
app.use(cors({ origin: 'http://localhost:3000' }));

app.get('/accueil', (req, res) => {
    res.send({
        msg: 'Bienvenue'
    })
})

app.get('/get', (req, res) => {
    Task.findAll()
        .then((result) => res.json(result))
        .catch((err) => res.json(err))
    return;
})

app.put('/update/:id', (req, res) => {
    const {id} = req.params;
    const {task} = req.body;

    Task.update({task: task}, {where: {id: id}})
        .then((result) => {
            if(result[0] === 1){
                res.json({message: 'La tâche a été mise à jour avec succès.'});
            }else{
                res.status(404).json({message: 'La tache n\'a pas été trouvée'});
            }
        })
        .catch((err) => res.status(500).json({error: err.message}))
})

app.delete('/delete/:id', (req, res) => {
    const {id} = req.params;
    Task.destroy({where: {id: id} })
        .then(result => res.json(result))
        .catch(err => res.json(err))
})

app.put('/done/:id', (req, res) => {
    const {id} = req.params;
    const {task} = req.params;
    Task.update({task: task}, {where: {id: id}})
        .then((result) => {
            if(result[0] === 1){
                res.json({message: 'La tâche a bien été mise à jour.'})
            }else{
                res.status(404).json({message: 'La tâche n\'a pas pu être mis à jour.'})
            } 
        })
        .catch((err) => res.status(500).json({error: err.message}))
})

app.post('/add', async (req, res) => {
    try{
        const task = req.body.task;

        // Vérifiez que la propriété task est définie et non nulle
        if (!task || task === null || task.task.trim() === '') {
            return res.status(400).json({ error: 'La propriété task est requise et ne peut pas être nulle.' });
        }
        console.log(task.task)
        const createdTask = await Task.create({
            ...task
        })
        await Task.update({task: createdTask.task},{where: {id: createdTask.id}})
        res.json({task: createdTask})
    }catch (error){
        console.error('Erreur lors de l\'ajout de la tâche :', error);
        res.status(500).json({ error: 'Erreur serveur lors de l\'ajout de la tâche' });
    }
});

app.get('/user/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const user = users.find(user => user.id === id)
    res.json(user)
})

app.get('/users', (req, res) => {
    res.json(user)
})

// Synchronisez le modèle avec la base de données
sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Le serveur est lancé sur le port http://localhost:${port}`)
    })
});