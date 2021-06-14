const express1 = require('express')
const morgan1 = require('morgan')
const app1 = express1()
//const pool1=require('./db');
const swaggerJSDoc1=require('swagger-jsdoc');
const swaggerUI1=require('swagger-ui-express')
const amqp1=require('amqplib')
app1.use(express1.json())
const fs1=require("fs");
var channel,connection;
function assignId1(req,res,next){
    req.id = 'Some ID'
}

async function connect1(){
    const amqpServer="amqp://localhost:5672";
    connection=await amqp1.connect(amqpServer)
    channel= await connection.createChannel();
    await channel.assertQueue("PRODUCT")
}

const access1=fs1.createWriteStream(__dirname + "/info.log",{flags:"a"})
app1.use(morgan1( {
    stream: access1
} ));


const swaggerOptions1={
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
            servers: ["http://localhost:9090"]
        }
    },
    apis: ["publisher.ts"]
}

const swaggerDocs1=swaggerJSDoc1(swaggerOptions1);
app1.use('/api-docs',swaggerUI1.serve,swaggerUI1.setup(swaggerDocs1));

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
 * /employee/{employee_id}/{name}/{department}:
 *  get:
 *   summary: get employee
 *   description: get employee
 *   parameters:
 *    - in: path
 *      name: employee_id
 *      schema:
 *       type: integer
 *      required: true
 *      description: id of the employee
 *      example: 2
 *    - in: path
 *      name: name
 *      schema:
 *       type: string
 *      required: true
 *      description: name of the employee
 *      example: Sathya
 *    - in: path
 *      name: department
 *      schema:
 *       type: string
 *      required: true
 *      description: Dept of the employee
 *      example: System Engineer
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description: error
 */
app1.get("/employee/:id/:name/:depatment", async(req,res)=>{
    try{
        const {id,name,department}=req.params;
       // const employee_data=await pool.query("INSERT INTO EMPLOYEE(id,name,department) VALUES($1,$2,$3) returning *",
        //[id,name,department])
       // res.json(employee_data.rows[0]);
        //console.log(req.body);
      //  res.json(req.body); 
        channel.sendToQueue("ORDER", Buffer.from(JSON.stringify({
            id,
            name,
            department
        })))
    }
    catch(error){
        res.status(500).json(error); 
    }
})






connect1()




app1.listen(9090,()=>{
    console.log("Server 9090");
})

