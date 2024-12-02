import fs from 'fs';
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import https from 'https';
import pkg from 'uuid';

const { v4: uuidv4 } = pkg;

const app = express();
const port = 3003; // You can change this port if you want

// Loads your SSL cert! Make sure you ... uh, get one, with cerbot.
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/your.proxy.address/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/your.proxy.address/fullchain.pem')
};

// Skirt those f***ing CORS errors
app.use(cors());
app.use(bodyParser.json());

const commentsFilePath = './comments.json';
const forbiddenWordsFilePath = './forbidden-words.json';

// Load the comments
let comments = {};
if (fs.existsSync(commentsFilePath)) {
  const data = fs.readFileSync(commentsFilePath);
  comments = JSON.parse(data);
}

// Load up the bad word document
let forbiddenWords = [];
if (fs.existsSync(forbiddenWordsFilePath)) {
  const data = fs.readFileSync(forbiddenWordsFilePath);
  forbiddenWords = JSON.parse(data);
}

// Save the comments so that they don't vanish from your blog
function saveComments() {
  fs.writeFileSync(commentsFilePath, JSON.stringify(comments, null, 2));
}

app.post('/post-comments', (req, res) => {
  const { postId, author, fediverse, content } = req.body;
  if (!postId || !author || !content) {
    return res.status(400).send('Missing postId, author, or content');
  }

  // Check to make sure there aren't any bad words in a post
  const containsForbiddenWords = forbiddenWords.some(word => content.toLowerCase().includes(word.toLowerCase()));
  if (containsForbiddenWords) {
    return res.status(400).send('Your comment contains forbidden words and cannot be submitted.');
  }

  const commentId = uuidv4();
  const comment = { id: commentId, author, fediverse, content, timestamp: new Date().toISOString() };

  if (!comments[postId]) {
    comments[postId] = [];
  }

  comments[postId].push(comment);
  saveComments();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(201).send(comment);
});

app.get('/post-comments', (req, res) => {
  const postId = req.query.postId;
  if (!postId) {
    return res.status(400).send('Missing postId parameter');
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.send(comments[postId] || []);
});

https.createServer(options, app).listen(port, () => {
  console.log(`Post comments proxy server running at https://your.proxy.address:${port}`);
});





