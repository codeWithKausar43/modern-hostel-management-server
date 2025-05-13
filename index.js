const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5ceog.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const usersCollection = client
      .db("modern-hostel-management")
      .collection("users");
    const mealsCollection = client
      .db("modern-hostel-management")
      .collection("meals");
    const reviewsCollection = client
      .db("modern-hostel-management")
      .collection("reviews");

    // users apis
    app.post("/users", async (req, res) => {
      const users = req.body;
      const result = await usersCollection.insertOne(users);
      res.send(result);
    });

    app.get("/users", async(req, res) => {
      const users = await usersCollection.find().toArray()
      res.send(users)
    })
    
     
app.delete("/users/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await usersCollection.deleteOne(query);
  res.send(result);
});
    // meals releted apis
    app.get("/meals", async (req, res) => {
      const meals = await mealsCollection.find().toArray();
      res.send(meals);
    });

    app.get("/meals/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await mealsCollection.findOne(query);
      res.send(result);
    });

    app.post("/meals", async (req, res) => {
      const meal = req.body;
      const result = await mealsCollection.insertOne(meal);
      res.send(result);
    });

    // reviews collection
    app.post("/review", async (req, res) => {
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("jos is filling for they sky");
});

app.listen(port, () => {
  console.log(`job is running : ${port}`);
});
