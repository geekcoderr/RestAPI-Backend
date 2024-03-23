const express=require('express');
const users=require('./MOCK_DATA.json');
const app=express();
const PORT=8000;

app.get('/users',(req,res)=>{
    const html=`
    <ul>
    ${users.map((user)=>`<li>${user.first_name}</li>`).join('')}
    </ul>
    `;
    return res.send(html);
});

app.get('/api/users',(req,res)=>{
    return  res.json(users);
});

app.get('/api/users/id/:id', (req, res) => {
    const id = Number(req.params.id);
    console.log('Requested ID:', id);
    const user = users.find((user) => user.id === id);
    console.log('User found:', user);
    return res.json(user);
});

app.get('/api/users/name/:name', (req, res) => {
    const name = req.params.name;
    console.log('Requested name:', name);
    const lowercaseName = name.toLowerCase();
    const user = users.find((user) => user.first_name.toLowerCase() === lowercaseName);
    console.log('User found:', user);
    return res.json(user);
});


app.listen(PORT,console.log('Server started'));