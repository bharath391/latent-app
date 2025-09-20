import dotenv from "dotenv";
dotenv.config();
import express from "express";
import v1Router from "./routes/v1/index.js";

const app = express();

app.use(express.json());

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  const start = Date.now();

  console.log(`➡ Incoming Request: [${req.method}] ${req.path}`);

  // Listen for when the response finishes
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `⬅ Response: [${req.method}] ${req.path} -> ${res.statusCode} (${duration}ms)`
    );
  });

  next();
});
app.use("/api/v1",v1Router);


app.listen(process.env.PORT ||8080 ,() =>{
    console.log('Server listening on port 8080');
})