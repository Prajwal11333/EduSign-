import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 4000;


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


// In your index.js or api.js file
app.get("/videolib/:id", (req, res) => {
    // Get the video
    const video = videolib.find((v) => v.id === (req.params.id));
    if (!video) return res.status(404).json({ message: "Video not found" });
    
    // We'll still return the video data, but the client-side code will handle access control
    res.json(video);
});



const videolib = [
    {
        id: "001",
        title: "Introduction",
        video: encodeURI("/assets/videos/Introduction.mp4"),
    },
    {
        id: "002",
        title: "Alphabets",
        video: encodeURI("/assets/videos/Alphabets.mp4"),
    },
    {
        id: "003",
        title: "Numbers",
        video: encodeURI("/assets/videos/Numbers.mp4"),
    },
    {
        id: "004",
        title: "Family Signs",
        video: encodeURI("/assets/videos/family.mp4"),
    },
    {
        id: "005",
        title: "Parents Signs",
        video: encodeURI("/assets/videos/feelings.mp4"),
    },
]
app.listen(port, () => {
    console.log(`API is running at http://localhost:${port}`);
  });