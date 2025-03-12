import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "http://localhost:4000";

app.use(express.static('public'));

app.get("/" , (req,res)=> {
    res.render('home.ejs');
});

app.get("/tutorials" , (req,res) => {
res.render("tutorials.ejs");
}
)

app.get("/login", (req,res) => {
    res.render("login.ejs");
})

app.get("/translator",(req,res)=>{
    res.render("translator.ejs");
})

app.get("/tutorials/basics", (req,res)=>{
    res.render("basics.ejs")
})

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get("/tutorials/videoplay.ejs" , async (req,res)=> {
    try {
        const response = await axios.get(`${API_URL}/videolib`);
        console.log(response.data);
        res.render("videoplay.ejs", {
            videos: response.data,
        })
      }  catch(error){
        res.status(500).json({message : "Eroor fetching the video"})
    }
    }
);

app.listen(port , ()=>{
    console.log("server listening on port"+port );
})
