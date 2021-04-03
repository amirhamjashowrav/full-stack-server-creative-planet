const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()


const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.scuyw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bookCollection = client.db("creativePlanet").collection("books");
  const orderCollection = client.db("creativePlanet").collection("orders");
  
  app.get('/books', (req, res) => {
    bookCollection.find()
        .toArray((err, items) => {
            res.send(items)
        })
  })

  app.get('/bookdetail/:key', (req, res) => {
		bookCollection.find({
			_id: ObjectId(req.params.key)
		}).toArray((err, documents) =>{
      res.send(documents[0]);
		});
	});

  app.get('/orderList', (req, res) => {
    orderCollection.find({})
    .toArray((err, documents)=>{
      res.send(documents);
    })
  })

  app.post('/addOrder', (req, res) => {
    const order = req.body;
    orderCollection.insertOne(order)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
})

  app.post('/addbook', (req, res) =>{
    const newBook = req.body;
    console.log('adding new book: ', newBook)
    bookCollection.insertOne(newBook)
    .then(result => {
      console.log('inserted count', result.insertedCount);
      res.send(result.insertedCount > 0)
    })
  })
 
  app.delete('/delete/:key', (req, res) => {
		bookCollection.deleteOne({
			_id: ObjectId(req.params.key)
		}).then((result) => {
			res.send(result.deletedCount > 0);
		});
	});

});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})