import express from "express";
import bodyParser from "body-parser";
import routes from './routes/index.js';

const app = express();

app.set('view engine', 'ejs');  
app.set('views', './views');   

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use("/", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
