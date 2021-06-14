

const express = require('express')
const morgan = require('morgan')
const app = express()
const Pool=require('pg').Pool
const swaggerJSDoc=require('swagger-jsdoc');
const swaggerUI=require('swagger-ui-express')
const amqp=require('amqplib')
var JSAlert = require("js-alert");
app.use(express.json())
const fs=require("fs");
var channel,connection;
function assignId(req,res,next){
    req.id = 'Some ID'
}

// Listening Port at line 520




//Database Info
const pool=new Pool({
    user: "postgres",
    password: "password",
    host: "localhost",
    port: 5433,
    database:"postgres"
})


async function connect(){  
    const amqpServer="amqp://localhost:5672";
    connection=await amqp.connect(amqpServer)
    channel= await connection.createChannel();
    await channel.assertQueue("ORDER")
}

connect().then(()=>{
    channel.consume("ORDER",data =>{
        const {id,name,department}=JSON.parse(data.content)
        console.log("Consuming ORDER")
        console.log(id,
             name,
             department)
             channel.ack(data);
    })
});




const access=fs.createWriteStream(__dirname + "/log_data.log",{flags:"a"})
app.use(morgan( {
    stream: access
} ));

app.use(express.urlencoded({
    extended:true
}))

app.use((req,res,next)=>{
    next();
})

const swaggerOptions={
    definition:{
        openapi:'3.0.0',
        info: {
            title: 'Employee Management API',
            version: '1.0.0',
            description: 'Employee Management',
            contact:{
                name: 'Sathyakrishna T',
                url: 'https://traklabssample.com',
                email:'sathyakrishnata@gmail.com'
            },
            servers: ["http://localhost:8811"]
        }
    },
    apis: ["indexts.ts"]
}

const swaggerDocs=swaggerJSDoc(swaggerOptions);
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocs));






/**
 * @swagger
 * definitions:
 *  Employee:
 *   type: object
 *   properties:
 *    id:
 *     type: integer
 *     description: ID of the employee
 *    name:
 *     type: string
 *     description: Name of the employee
 *    department:
 *     type: string
 *     description: Department of the employee
 *     example: 'System Enginner'
 */



 /**
  * @swagger
  * /employee/post:
  *  post:
  *   summary: create employee
  *   description: create employee for the organisation
  *   requestBody:
  *    content:
  *     application/json:
  *      schema:
  *       $ref: '#/definitions/Employee'
  *   responses:
  *    200:
  *     description: employee created succesfully
  *    500:
  *     description: failure in creating employee
  */

app.post("/employee/post", async(req,res)=>{
    try{
        const {id,name,department}=req.body;
        const employee_data=await pool.query("INSERT INTO EMPLOYEE(id,name,department) VALUES($1,$2,$3) returning *", [id,name,department])
       // res.json(employee_data.rows[0]);
        console.log(req.body);
        res.json(req.body); 
        
    }
    catch(error){
        res.status(500).json(error); 
    }
})


/**
 * @swagger
 * /employee:
 *  get:
 *   summary: get all employees
 *   description: get all employees
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description: error
 */

 app.get('/employee/html',(req,res)=>{
    res.send(`<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, 
         shrink-to-fit=no">
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
    
      <title>EXAM</title>

      <style>
    .ii{
        width:300px;
        text-align:center;
    }
      </style>
      </head>
      <h1 style="text-align:center;">
        Sort Data
      </h1>
      <body>
      <br><br><br><br><br><br><br>
      <center>
      <table>
     <tr>
     <td><form action="/employee"  method="GET" >
    <input class="ii" type="submit" value="GET">
    </form></td></tr>
    <tr>
    <td>
    <form action="/employee/sort/id"  method="GET" >
    <input class="ii" type="submit" value="SORT BY ID">
    </form></td>
    </tr>
    <tr>
    <td>
    <form action="/employee/sort/name"  method="GET" >
    <input class="ii" type="submit" value="SORT BY NAME">
    </form></td>
    </TR>
    <TR>
    <td>
    <form action="/employee/searchid"  method="POST" >
    <input class="ii" type="text" placeholder="Search">
    <input class="ii" type="submit" value="Search">
    </form></td>
    </tr>
    </table>
    </center>
    </body>
    </html>
    
    `)
})



app.get('/employee',async(req,res)=>{
    try{
       /* pool.connect(async(error,client,release)=>{
            let employee_data=await client.query("SELECT * FROM EMPLOYEE");
            res.send(employee_data.rows);
        })*/
       
       
        const employee_data=await pool.query("SELECT * FROM EMPLOYEE;");
        res.json(employee_data.rows);
       // JSAlert.alert("Employee Table JSON file").dismissIn(1000 * 3);
        // var data=employee_data.rows
        //console.log(data);
        //console.log(req.body);
       // res.send(data);
        //res.json(req.body); 
        //module.exports.variableName = data;
        //var name = data;
       // res.render(__dirname + "main.html", {name:name});
       
    }
    catch(error){
        res.status(500).json(error); 
    }
})


app.get('/employee/sort/id',async(req,res)=>{
    try{
       /* pool.connect(async(error,client,release)=>{
            let employee_data=await client.query("SELECT * FROM EMPLOYEE");
            res.send(employee_data.rows);
        })*/
       
       
        const employee_data=await pool.query("SELECT * FROM EMPLOYEE ORDER BY id ASC;");
        res.json(employee_data.rows);
         var data=employee_data.rows
        console.log(data);
        console.log(req.body);
       // res.send(data);
        //res.json(req.body); 
        //module.exports.variableName = data;
        //var name = data;
       // res.render(__dirname + "main.html", {name:name});
       
    }
    catch(error){
        res.status(500).json(error); 
    }
})

app.get('/employee/sort/name',async(req,res)=>{
    try{
       /* pool.connect(async(error,client,release)=>{
            let employee_data=await client.query("SELECT * FROM EMPLOYEE");
            res.send(employee_data.rows);
        })*/
       
       
        const employee_data=await pool.query("SELECT * FROM EMPLOYEE ORDER BY name ASC;");
        res.json(employee_data.rows);
         var data=employee_data.rows
        console.log(data);
        data=JSON.stringify(data)
        console.log(req.body);
       // res.send(data);
        //res.json(req.body); 
        //module.exports.variableName = data;
        //var name = data;
       // res.render(__dirname + "main.html", {name:name});
       
    }
    catch(error){
        res.status(500).json(error); 
    }
})

app.post("/employee/search/id", async(req,res)=>{
    try{
        const{id}=req.params;
        const employee_data=await pool.query("SELECT * FROM EMPLOYEE where id=$1",[id]);
       // res.json(employee_data.rows[0]);
       // console.log(req.body);
       // res.json(req.body); 
       
         var data=employee_data.rows
        console.log(data);
        console.log(req.body);
        res.json(data);
    }
    catch(error){
        res.status(500).json(error); 
    }
})



/**
 * @swagger
 * /sortemployee/name:
 *  get:
 *   summary: get all employees sorted by name
 *   description: get all employees sorted by name
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description: error
 */



 app.get('/sortemployee/name',async(req,res)=>{
    try{
       
        const employee_data=await pool.query("SELECT * FROM EMPLOYEE ORDER BY name ASC;");
        res.json(employee_data.rows);
        //console.log(req.body);
      //  res.json(req.body); 

    }
    catch(error){
        res.status(500).json(error); 
    }
})

/**
 * @swagger
 * /sortemployee/department:
 *  get:
 *   summary: get all employees sorted by department
 *   description: get all employees sorted by department
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description: error
 */



 app.get('/sortemployee/department',async(req,res)=>{
    try{
        const employee_data=await pool.query("SELECT * FROM EMPLOYEE ORDER BY department ASC;");
        res.json(employee_data.rows);
        console.log(req.body);
        res.json(req.body); 

    }
    catch(error){
        res.status(500).json(error); 
    }
})

/**
 * @swagger
 * /employee/{employee_id}:
 *  get:
 *   summary: get employee by id
 *   description: get employee by id
 *   parameters:
 *    - in: path
 *      name: employee_id
 *      schema:
 *       type: integer
 *      required: true
 *      description: id of the employee
 *      example: 12321
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description: error
 */

app.get('/employee/:id',async(req,res)=>{
    try{
        const{id}=req.params;
        let data={};
        const employee_data=await pool.query("SELECT * FROM EMPLOYEE where id=$1",[id]);
        data=employee_data
        res.json(data);
        //console.log(req.body);
      //  res.json(req.body); 

    }
    catch(error){
        res.status(500).json(error); 
    }
})

/**
 * @swagger
 * /updateemployee/{id}:
 *  put:
 *   summary: update employee
 *   description: update employee
 *   consumes:
 *    - application/json
 *   produces:
 *    - application/json
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *      required: true
 *      description: id of the employee
 *      example: 2
 *    - in: body
 *      name: body
 *      required: true
 *      description: body object
 *      schema:
 *       $ref: '#/definitions/Employee'
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Employee'
 *   responses:
 *    200:
 *     description: success
 */


app.put("/updateemployee/:id", async(req, res) =>{
     try{
        const{id}=req.params;
        const {name,department}=req.body;
        const employee_data=pool.query("UPDATE EMPLOYEE SET name=$1, department=$2 where id=$3 returning *",[name,department,id])
        res.json(employee_data.rows[0]);
     }
     catch(error){
        res.status(500).json(error);
     }
})

/**
 * @swagger
 * /employee/{id}:
 *  delete:
 *   summary: delete employee
 *   description: delete employee
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *      required: true
 *      description: id of the employee
 *      example: 2
 *   responses:
 *    200:
 *     description: success
 */


app.delete("/employee/:id", async (req,res) =>{
    const{id}=req.params;
    const employee_data_delete=pool.query("DELETE FROM EMPLOYEE WHERE id=$1 returning *",[id])
    const data=employee_data_delete.rows
    //console.log(data);
    if (data){
        console.log("Data deleted");
    }
    else{
        const data={
            info: "No Employee to Delete"
        }
    }
    res.json(data)
})



app.get('/details/:regn_no', async(req, res, next) => {

      const regn_no = req.params.regn_no;

      const results = [];

/*
        const query = pool.query('select * from employee where id= $1',[regn_no]);

        query.on('row', (row) => {
          results.push(row);
        });
        query.on('end', () => {
          //done();
          return res.json(results);*/

          await pool.connect();
          var res = await pool.query("select * from employee where id= $1',[regn_no]");
          res.rows.forEach(row=>{
            results.push(row);
          });
          await pool.end();       


        });



// Listening PORT


app.listen(8811,()=>{
    console.log("Server 8811");
})