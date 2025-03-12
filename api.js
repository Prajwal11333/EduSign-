import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 4000;


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.get("/videolib", (req,res)=>{ {
        // const vid = videolib.find((v) => v.id === parseInt(req.params.id));
        // if (!vid) return res.status(404).json({ message: "Post not found" });
        console.log(videolib);
        res.json(videolib);
    
}});



const videolib = 
    {
        id: "01",
        title: "Introduction",
        video: encodeURI("/assets/videos/Introduction.mp4"),

    }

app.listen(port, () => {
    console.log(`API is running at http://localhost:${port}`);
  });