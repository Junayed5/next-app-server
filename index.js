const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


// user:end-game
// pass:egyHvm4I2YE5Yjfc


const uri = "mongodb+srv://end-game:egyHvm4I2YE5Yjfc@cluster0.myonw.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        await client.connect();
        const recipeCollection = client.db("end-game").collection("recipes");

        app.get('/recipes', async(req,res) => {
            const recipes = await recipeCollection.find({}).toArray();
            res.send(recipes)
        })
        app.get('/recipe/:id', async(req,res) => {
            const id = req.params.id;
            const filter = {_id: ObjectId(id)}
            const data = await recipeCollection.findOne(filter);
            res.send(data)
        })

        app.get('/my-recipe/:email', async(req,res) => {
            const email = req.params.email;
            const filter = {email: email};
            const data = await recipeCollection.find(filter).toArray();
            res.send(data)
        })

        app.post('/recipe', async(req,res) => {
            const recipe = req.body;
            const data = await recipeCollection.insertOne(recipe);
            res.send(data);
        })

        app.delete('/recipe/:id', async(req,res) => {
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const data = await recipeCollection.deleteOne(filter);
            res.send(data);
        })

        app.put('/recipe/:id', async(req,res) => {
            const id = req.params.id
            const filter = {_id: ObjectId(id)};
            const data = req.body;
            const options = { upsert: true };
            const updateDoc = {
                $set: data
            };
            const result = await recipeCollection.updateOne(filter,updateDoc,options);
            res.send(result)
        })
    }
    finally{}
    
}

run().catch(console.dir)


app.get('/', (req,res) => {
    res.send('Hello Next app')
})

app.listen(port, () =>{
    console.log('listening port', port);
})