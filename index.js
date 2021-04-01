const express = require("express")
const cors = require("cors")
require("dotenv").config()
const MongoClient = require('mongodb').MongoClient;
console.log(process.env.DB_USER);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ipyl4.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const port = process.env.PORT || 5000;
const objectId = require("mongodb").ObjectID
const app = express()

app.use(cors())
app.use(express.json())




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const mobileCollection = client.db(process.env.DB_NAME).collection("mobiles");
  const orderList = client.db(process.env.DB_NAME).collection("orders");
  // perform actions on the collection object
  app.post("/addProduct",(req,res) => {
   console.log(req.body)
      mobileCollection.insertOne(req.body).then(result => {
        console.log(result);

      })
  })
 
  app.get("/products",(req,res) => {
mobileCollection.find({}).toArray((err,products) => {
    console.log(products);
    res.json(products)
})
    

})
app.get("/product/:id",(req,res) => {
    const id = req.params.id
    console.log(id);
    mobileCollection.findOne({_id:objectId(id)}).then(product => {
        console.log(product);
        res.json(product)
    })
})

// Delete product from manage product
app.delete("/delete/:id",(req,res) => {
    const productId = req.params.id
    mobileCollection.findOneAndDelete({_id:objectId(productId)}).then(result => {
        console.log(result);
    })
})

// save ordered product in database
app.post("/addOrder",(req,res) => {
    const order = req.body;
    console.log(req.body);
    orderList.insertOne(order).then(result => {
        console.log(result)
        res.send(result.insertedCount > 0)
    })
})

// Display orderList of specific user
app.get("/orders",(req,res) => {
    const email = req.query.email;
    orderList.find({email:email}).toArray((err,orders) => {
        res.json(orders)
    })
})
console.log(err)
});





app.listen(port)