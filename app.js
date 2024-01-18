const express = require('express');
const { connectToDb, getDb } = require('./dB')
const { ObjectId } = require('mongodb')

// middleware
const app = express();
app.use(express.json())

let db
connectToDb((err)=>{
    if(!err){
        app.listen(3000,()=>{
            console.log('listening on port 3000');
        })
        db = getDb();
    }else{
        console.log('server error cannot connect')
    }
})


app.get('/books',(req,res)=>{
    books =[]
    db.collection('books')
    .find().sort({author:1})
    .forEach((book)=>{
        books.push(book)
    })
    .then(()=>{
      res.status(200).json(books)  
    })
    .catch(()=>{
        res.status(500).json({error:"couldn't find books"})
    })
})

app.get('/books/:id', (req, res) => {
    if(ObjectId.isValid(req.params.id)){
        db.collection('books')
        .findOne({ _id: new ObjectId(req.params.id) })
        .then((doc) => {
            res.status(200).json(doc);
        })
        .catch((err) => {
            res.status(500).json({ err: 'could not find book' });
        });
    }else{
        res.status(500).json({ err: 'use a valid ID' }); 
    }

});


app.post('/books', (req, res) => {
    const book = req.body
    db.collection('books')
    .insertOne(book)
    .then((result) => {
        res.status(200).json(result); 
    })
    .catch(()=>{
        res.status(500).json({ err: 'could not post book' });  
    })
})

app.delete('/books/:id',(req,res)=>{
    if(ObjectId.isValid(req.params.id)){
        db.collection('books')
        .deleteOne({ _id: new ObjectId(req.params.id) })
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            res.status(500).json({ err: 'could not delete book' });
        });
    }else{
        res.status(500).json({ err: 'use a valid ID' }); 
    } 
})

app.patch('/books/:id',(req, res)=>{
    const update = req.body

    if(ObjectId.isValid(req.params.id)){
        db.collection('books')
        .updateOne({ _id: new ObjectId(req.params.id)},{$set:{update}})
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            res.status(500).json({ err: 'could not update book' });
        });
    }else{
        res.status(500).json({ err: 'use a valid ID' }); 
    } 
})