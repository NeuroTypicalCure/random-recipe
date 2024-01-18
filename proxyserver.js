import express from 'express';
import https from 'node:https';
import {Buffer} from 'node:buffer';
import * as cheerio from 'cheerio';

const server = express();
const PORT = 3001;

// CORS IS A PAIN IN MY ASS
server.use((req, res, next) => {
  // Allow requests from any origin (replace '*' with your actual front-end server address)
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Allow specific HTTP methods
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Allow specific headers
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // Allow cookies to be sent with the request
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
});

server.get('/*', (req,res) => {
  const target = req.params[0];

  fetchHTML(target, (error, result) => {
    if(error){
      console.error('Error:',error);
      res.send(error);
    }else{
      // result is already stringified in fetchHTML
      res.send(result);
    }
  });
})

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function fetchHTML(url, callback){
  https.get(url, res => {
    let data = [];
    const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
    console.log('Status Code:', res.statusCode);
    console.log('Date in Response header:', headerDate);

    res.on('data', chunk => {
      data.push(chunk);
    });

    res.on('end', () => {
      console.log('Response ended: ');
      const ogData = parseMetaTags(Buffer.concat(data).toString());
      callback(null, JSON.stringify(ogData))
    });
  }).on('error', err => {
    console.log('Error: ', err.message);
    callback(err,null);
  });
}

const parseMetaTags = (html) => {
  const $ = cheerio.load(html);

  const ogMetaTags = {};

  $('meta').each((_, element) => {
    const name = $(element).attr('name');
    const property = $(element).attr('property');
    const content = $(element).attr('content');

    if (name && name.startsWith('og:') && content) {
      ogMetaTags[name] = content;
    }

    if (property && property.startsWith('og:') && content) {
      ogMetaTags[property] = content;
    }
  });

  return ogMetaTags;
};

