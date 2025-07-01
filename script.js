import express from 'express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logoPath = join(__dirname, 'public', 'images', 'logo.png');
let posts = [];
const logoURLPath = '/images/logo.png';

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
// app.use((req, res, next) => {
//   res.locals.posts = [
//     { title: "Blog 1", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt..." },
//     { title: "Blog 2", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt..." },
//     { title: "Blog 3", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt..." }
//   ]
//   next();
// });
app.use((req, res, next) => {
  res.locals.posts = posts;
  res.locals.logoPath = logoURLPath; 

    next();
});

app.get('/', (req, res) => {
  res.render('index', { activePage: 'home'});
  console.log(logoPath);
  console.log(logoURLPath);
});

app.get('/about', (req,res) => {
    const textData = readFileSync(join(__dirname, 'public/data', 'AboutMe.html'), 'utf-8');
    res.render('about', { 
        activePage: 'about' ,
        text: textData
    });
});


// for (let j = 1; j <= posts.length; j++) {
//     const i = j; 
//     app.get(`/blog${i}`, (req,res) => {
//     res.render('blogViewer', {activePage: `blog${i}`, post: posts[i - 1] || { title: "Untitled Post", content: "No content available."  }});
// })
// }

app.get('/blog/:id', (req, res) => {
  const id = parseInt(req.params.id); // convert route param to number
  const post = posts[id - 1];         // get the corresponding post

  if (!post) {
    return res.status(404).send("Post not found");
  }

  res.render('blogViewer', { post, activePage: `blog${id}` });
});

// app.get('/blog2', (req,res) => {
//     let i = 3
//     console.log(`blog${i}`);
//     console.log(posts.length)
//     // res.render('blogViewer', {activePage: 'blog2', posts})
// })

// app.get('/blog3', (req,res) => {
//     res.render('blogViewer', {activePage: 'blog3', posts})
// })

app.get('/blogWriter', (req,res) => {
    res.render('blogWriter', {activePage: 'blogWriter'})
})

app.post('/view', (req, res) => {
  const { title, content } = req.body;
  
  posts.push({ title, content });
//   console.log(posts);
//   console.log(posts[0].title);
  res.render('index', { activePage: 'home', posts});
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});