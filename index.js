const express=require('express');
const users=require('./MOCK_DATA.json');
const file=require('fs');
const app=express();
const PORT=8000;

app.use(express.urlencoded( { extended: false } ));  // middleware for parsing application/x-www-form
app.use((req,res,next)=>{
    if(req.headers['x-uname']!=='geekcoderr'){
        return res.json({'message':'Unauthorized'});
    }
    console.log(`At[${(new Date()).toDateString()}] recieved ${req.method} Request On [${req.url}] from IP: ${req.ip}`);
    file.appendFile('requestLogs.txt',`Time: ${(new Date()).toDateString()} , Method: ${req.method} , URL/Path: ${req.url} , IP: ${req.ip}\n`,(err,data)=>{
        next();
    });
});

console.log('Middleware Bypassed');
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

app.route('/api/users/id/:id')
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find((user) => user.id === id);
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
        }
        return res.json(user);
    })
    .patch((req, res) => {
        const id = Number(req.params.id);
        const index = users.findIndex((user) => user.id === id);
        if (index>0) {
            const updatedUser={...users[index],...req.body};
            users[index]=updatedUser;
            file.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
                console.log("Data Updated for user with ID: " + id);
                return res.json({"Status": `Patch Success with ID->${id}`});
            });
        } else {
            return res.json({"Status": `Patch Unsuccessful with Invalid ID->${id}`});
        }
    })
    .delete((req, res) => {
        const id = Number(req.params.id);
        const index = users.findIndex((user) => user.id === id);
        if (index>0 && index<=users.length) {
            users.splice(index, 1);
            file.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({"error": "An error occurred while deleting data"});
                }
                console.log("Data Deleted with index:"+index);
                return res.json({"Status": `Delete Success with ID->${id}`});
            });
        } else {
            return res.json({"Status": `Delete Unsuccessful with Invalid ID->${id}`});
        }
    });


app.post('/api/users',(req,res)=>{
    const body=req.body;
    if(!body 
        || !body.first_name 
        || !body.last_name
        || !body.email
        || !body.gender
        || !body.profile){
            return res.status(400).json({'Error':'Missing Field'});
        }
    console.log(body);
    users.push({...body, id: users.length + 1});
    file.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
        return res.status(201).json({"Status": `Posted with ID : ${users.length+1}`}), console.log("Data Posted");
});
});

app.listen(PORT,console.log('Server started'));