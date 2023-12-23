const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port= process.env.PORT || 5000



// midewaare
app.use(cors({
  origin: [
      'http://localhost:5173',
  ],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());


// const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}
:${process.env.DB_PASS}@hotelhaven-database.n0h5vlk.mongodb.net/?retryWrites=true&w=majority`;

// console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const bookingCollection = client.db("Hotelbooking").collection("taskusers");
    // const bookingCollection = client.db("Hotelbooking").collection("bookings");



 // booking
 app.post("/taskusers", async (req, res) => {
    const users = req.body;
    const result = await bookingCollection.insertOne(users);
    res.send(result);
  });

  // all data
  app.get("/taskusers", async (req, res) => {
    const cursor = bookingCollection.find();
    const result = await cursor.toArray();
    res.send(result);
  });



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Crud is running...");
});

app.listen(port, () => {
  console.log(`Simple Crud is Running on port ${port}`);
});