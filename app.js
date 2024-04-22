const express = require('express');
const cors = require('cors')
const dotenv = require('dotenv')
const app = express()

dotenv.config()

app.route("/", (req, res) => {
    res.json({ message: "bonjour" });
})

app.use(express.json());
app.use(cors())

app.route("/", (req, res) => {
    res.json({ message: "bonjour" });
})

const userRouter = require("./routes/user.route")
app.use('/api/user', userRouter);
const specialiteRouter = require("./routes/specialite.route")
app.use('/api/specialite', specialiteRouter);
const niveauRouter = require("./routes/niveau.route")
app.use('/api/niveau', niveauRouter);
const espaceCoursRouter = require("./routes/espaceCours.route")
app.use('/api/espaceCours', espaceCoursRouter);
const espaceDepotRouter = require("./routes/espaceDepot.route")
app.use('/api/espaceDepot', espaceDepotRouter);
const depotRouter = require("./routes/depot.route")
app.use('/api/depot', depotRouter);
const banqueQuestionRouter = require("./routes/banqueQuestion.route")
app.use('/api/banqueQuestion', banqueQuestionRouter);
const commentaireRouter = require("./routes/commentaire.route")
app.use('/api/commentaire', commentaireRouter);
const gamificationRouter = require("./routes/gamification.route")
app.use('/api/gamification', gamificationRouter);
const reponseRouter = require("./routes/reponse.route")
app.use('/api/reponse', reponseRouter);
const ressourceRouter = require("./routes/ressource.route")
app.use('/api/ressource', ressourceRouter);
const resultatRouter = require("./routes/resultat.route")
app.use('/api/resultat', resultatRouter);
const testRouter = require("./routes/test.route")
app.use('/api/test', testRouter);
const testQuestionRouter = require("./routes/testQuestion.route")
app.use('/api/testQuestion', testQuestionRouter);
const themeRouter = require("./routes/theme.route")
app.use('/api/theme', themeRouter);

const PORT = process.env.PORT || 3005
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

module.exports = app;
