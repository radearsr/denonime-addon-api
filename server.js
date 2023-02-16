const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", require("./routes/api"));

const port = 3000 || process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running in http://localhost:${port}`);
});
