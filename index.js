const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.hzyrwol.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)




// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const CartData = client.db('cartDB').collection('cart')
    const productCollection = client.db('productDB').collection('product')


    // myCart post

    app.post('/carts', async (req, res) => {
        const newAddCart = req.body
        const result = await CartData.insertOne(newAddCart)
        res.send(result)

    })
    // 
    app.get('/carts', async (req, res) => {
        const cursor = CartData.find()
        const result = await cursor.toArray()
        res.send(result)
    })

    

    app.get('/product',async(req,res)=>{
      const cursor = productCollection.find()
      const result = await cursor.toArray()
      res.send(result);
    })



    app.post('/product',async(req,res)=>{
      const newProduct = req.body;
      console.log(newProduct)
      const result = await productCollection.insertOne(newProduct)
      res.send(result);
    })


    // for filter the brand name 
    app.get('/product/:id',async(req,res)=>{
      const id = req.params.id
      const result = await productCollection.find({brand:id}).toArray()
      res.send(result)
    })

    // for update a product
    app.put('/details/:id',async(req,res)=>{
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)}
      const options = {upsert : true}
      const updatedCard = req.body
      const card = {
        $set: {
          name:updatedCard.name,
           photo:updatedCard.photo,
           brand:updatedCard.brand,
           price:updatedCard.price,
           type:updatedCard.type,
           description:updatedCard.description,
           rating:updatedCard.rating
        }
      }
      const result = await productCollection.updateOne(filter,card, options)
      res.send(result);
    })

    // Delete a card
    app.delete('/delete/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await CartData.deleteOne(query);
      res.send(result);
    })

    // for showing one card details inside the brand
    app.get('/details/:id',async(req,res)=>{
      const id = req.params.id
      const query = {_id : new ObjectId(id)}
      const result = await productCollection.findOne(query)
      res.send(result);
    })




  //   app.get('/deatils/:id', async (req, res) => {
  //     const id = req.params.id
  //     const query = { _id: new ObjectId(id) }
  //     const result = await addedProductCollection.findOne(query)
  //     res.send(result)
  // })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
  res.send('tech shop is running')
})



app.listen(port,()=>{
  console.log(`the server is running on port:${port}`)
})