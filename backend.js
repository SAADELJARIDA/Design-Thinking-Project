const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connexion à MongoDB
mongoose.connect("mongodb://localhost:27017/journal_ensabm", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Modèle d'actualité
const NewsSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: { type: Date, default: Date.now },
});

const News = mongoose.model("News", NewsSchema);

// Route pour récupérer les actualités
app.get("/api/news", async (req, res) => {
  const news = await News.find();
  res.json(news);
});

// Route pour ajouter une actualité
app.post("/api/news", async (req, res) => {
  const { title, content } = req.body;
  const newArticle = new News({ title, content });
  await newArticle.save();
  res.json({ message: "Article ajouté avec succès" });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
