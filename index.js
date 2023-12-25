const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port= process.env.PORT || 5000


// Midlewares
app.use(cors())
app.use(express.json())



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
    const taskCollection = client.db("Hotelbooking").collection("alltask");



 // create user
 app.post("/taskusers", async (req, res) => {
    const users = req.body;
    const result = await bookingCollection.insertOne(users);
    res.send(result);
  });
 app.post("/alltask", async (req, res) => {
    const taskes = req.body;
    const result = await taskCollection.insertOne(taskes);
    res.send(result);
  });

  // app.delete("/users/:id", async (req, res) => {
  //   const id = req.params.id;
  //   const query = { _id: new ObjectId(id) };
  //   const result = await userCollection.deleteOne(query);
  //   res.send(result);
  // });

  app.get("/alltask", async (req, res) => {
    const cursor = taskCollection.find();
    const result = await cursor.toArray();
    res.send(result);
  });

  // get all users
  app.get("/taskusers", async (req, res) => {
    const cursor = bookingCollection.find();
    const result = await cursor.toArray();
    res.send(result);
  });

  app.put("/taskusers/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
  
    try {
      // Assuming req.body contains the fields you want to update
      const updatedData = req.body;
  
      // Update the user information in the database
      const result = await bookingCollection.updateOne(query, { $set: updatedData });
  
      if (result.modifiedCount > 0) {
        res.send({ message: "User updated successfully" });
      } else {
        res.status(404).send({ message: "User not found or no updates applied" });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).send({ message: "Internal server error" });
    }
  });

  app.delete("/alltask/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await taskCollection.deleteOne(query);
    res.send(result);
  });

  // app.put("/updateTasksOrder/:id", async (req, res) => {
  //   try {
  //     // Assuming req.body contains the fields you want to update
  //     const updatedData = req.body;
  
  //     // Update the task order in the database
  //     const result = await taskCollection.updateOne({}, { $set: updatedData });
  
  //     if (result.modifiedCount > 0) {
  //       res.send({ message: "Task order updated successfully" });
  //     } else {
  //       res.status(404).send({ message: "No updates applied" });
  //     }
  //   } catch (error) {
  //     console.error("Error updating task order:", error);
  //     res.status(500).send({ message: "Internal server error" });
  //   }
  // });
  

  app.patch("/alltask/:id",async(req,res)=>{
    const {status} = req.body;
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const updatedStatus = {
      $set:{
        status: status
      }
    }
    const result = await taskCollection.updateOne(query,updatedStatus)
    res.send(result)
  })

  app.get("/taskusers/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await bookingCollection.findOne(query);
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
