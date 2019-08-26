const express = require("express");
const connectDB = require("./config/db");
const path = require('path')
//Server UP
const app = express();

//Connect Database
// connectDB()
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "OPTIONS, GET, POST, PUT, PATCH, DELETE"
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });
//Init Middleware to get data from req.body in models
app.use(express.json({ extended: false }));

app.use("/products", require("./routes/products"));
app.use("/settings", require("./routes/settings"));

//Serve static assets in production
if(process.env.NODE_ENV === 'production'){
  //Set static folder
   app.use(express.static('client/build'))
   app.get('*', (req,res)=>{
     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html' ))
   })
}

//Server runs on port
const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
