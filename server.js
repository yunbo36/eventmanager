const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

const mockFileSystem = {
  '/home/project': [
    { name: 'Documents', path: '/home/project/Documents', is_directory: true },
    { name: 'Pictures', path: '/home/project/Pictures', is_directory: true },
    { name: 'readme.txt', path: '/home/project/readme.txt', is_directory: false },
  ],
  '/home/project/Documents': [
    { name: 'work', path: '/home/project/Documents/work', is_directory: true },
    { name: 'personal', path: '/home/project/Documents/personal', is_directory: true },
    { name: 'notes.txt', path: '/home/project/Documents/notes.txt', is_directory: false },
  ],
  '/home/project/Pictures': [
    { name: 'vacation', path: '/home/project/Pictures/vacation', is_directory: true },
    { name: 'profile.jpg', path: '/home/project/Pictures/profile.jpg', is_directory: false },
  ],
};

app.get('/api/list', (req, res) => {
  const dirPath = req.query.path || '/home/project';
  const items = mockFileSystem[dirPath] || [];
  res.json(items);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});