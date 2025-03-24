require('dotenv').config();
const express = require('express');
const cors = require("cors");
const { sequelize } = require("./models");
const uploadRoutes = require("./routes/uploadRoutes");
const statusRoutes = require("./routes/statusRoutes");
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/compressed', express.static(path.join(__dirname, 'public', 'compressed')));
app.use('/output', express.static('output'));
 
app.use("/api/v1/request", uploadRoutes);
app.use("/api/v1/status", statusRoutes);


const PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
  console.log(`🚀 Server is running on port ${PORT}`);

  try {
    await sequelize.authenticate({ logging: false });
    console.log(
      "✅ Connection to the database has been established successfully."
    );

    await sequelize.sync({ alter: true, logging: false });
    console.log("✅ Database synchronized.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
});
