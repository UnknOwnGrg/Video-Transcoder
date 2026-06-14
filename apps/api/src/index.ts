import express from 'express';
import multer from 'multer';
import queue from '@repo/queue';

const app = express();
app.use(express.json());


const upload = multer({ dest: "../../uploads/"})

app.post('/upload',upload.single('video'),(req, res) => {
  const file = req.file;
  if(!file) {
    return res.status(400).send('No file uploaded');
  }

  console.log(file.filename);
  //No Database
  // Attach Queue
  queue.add('video', {
    id: file.filename
  })

  res.json({
    id: file.filename
  })
})


app.get('/', (req, res) => {
  res.send('Hello world')
})

app.listen(3000,() => console.log('Server is running'));