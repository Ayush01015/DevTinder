// app.get('/', (req, res) => {
//   res.send('Hello, World!');
// });

// app.use('/test/2', (req, res, next) => { 
//   res.send('This is a test endpoint 2');
// });

// app.use('/test', (req, res, next) => {
//   res.send('This is a test endpoint');
// });


// const allData = [
//     { id: '1', name: 'Ayush Shrivastav'},   
//     { id: '2', name: 'Bob' },
//     { id: '3', name: 'Charlie' }
// ]
// app.post('/data', (req, res) => {
//     if(req.body.id) {
//         const user = allData.find(user => user.id === req.body.id);
//         return res.send(user);
//     }
//     //   req.body = {...req.body, id: '1' };
//     //   res.send(req.body);
// });

// // app.delete('/data/:id', (req, res) => {
// //     if(req.params.id){
// //         const user = allData.find(user => user.id === req.params.id);
// //         const index = allData.indexOf(user);
// //         let newArr = index !== -1 ? [...allData.slice(0,index),...allData.slice(index + 1)] : "User not found";
// //         res.send(newArr);
// //     }else{
// //         res.send("Id not Found !!!");
// //     }
// // });


// app.delete('/data/:id', (req, res) => {
//     const idToDelete = req.params.id;
//     const newArr = allData.filter(user => user.id !== idToDelete);
//     if (newArr.length === allData.length) {
//         return res.status(404).send("User not found");
//     }
//     res.send(newArr);
// });

// //we can use regular expression and regex over here in route "ab+c", ab*bc, /a/, /*Ag/
// app.get("/ayush/:id/:name/:password",(req,res)=>{
//     res.send({
//         id:req.params.id,
//         name:req.params.name,
//         password:req.params.password,
//     })
// })

// // http://localhost:3000/ayush2?id=23&name=ayush&points=90 

// app.get("/ayush22",(req,res)=>{
//     console.log(typeof req);
//     req.name = "ayush shrivastav";
//     res.send(req.query);
// })


// app.get('/getinfo',(req,res,next)=>{
//     console.log("Learning middleware");
//     next()
// },(req,res,next)=>{
//     res.send({
//         reqNo:"2"    
//     })

//     next()
// },(req,res,next)=>{
//     next()
// })


// app.get("/getinfo",[req1,req2,req3],req4,req5)
// {
//     "id": "23",
//     "name": "ayush",
//     "points": "90"
// }