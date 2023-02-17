const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", require("./routes/api"));

app.get("/", (req, res) => {
  try {
    const ipAddress = req.header("x-forwarded-for") || req.socket.remoteAddress;
    res.send(`
      <center>
        <h1>Welcome To Denonime API</h1>
        <h4>Client From ${ipAddress}</h4>
      <center>
    `);
  } catch (error) {
    res.send("Terjadi Kegagalan pada server cek log...");
  }
});

app.all("*", (req, res) => {
  res.status(404);
  res.json({
    status: "fail",
    message: "Url Not Found",
  });
});

const port = 3000 || process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running in http://localhost:${port}`);
});
