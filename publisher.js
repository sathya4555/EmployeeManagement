"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var express1 = require('express');
var morgan1 = require('morgan');
var app1 = express1();
//const pool1=require('./db');
var swaggerJSDoc1 = require('swagger-jsdoc');
var swaggerUI1 = require('swagger-ui-express');
var amqp1 = require('amqplib');
app1.use(express1.json());
var fs1 = require("fs");
var channel, connection;
function assignId1(req, res, next) {
    req.id = 'Some ID';
}
function connect1() {
    return __awaiter(this, void 0, void 0, function () {
        var amqpServer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    amqpServer = "amqp://localhost:5672";
                    return [4 /*yield*/, amqp1.connect(amqpServer)];
                case 1:
                    connection = _a.sent();
                    return [4 /*yield*/, connection.createChannel()];
                case 2:
                    channel = _a.sent();
                    return [4 /*yield*/, channel.assertQueue("PRODUCT")];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
var access1 = fs1.createWriteStream(__dirname + "/info.log", { flags: "a" });
app1.use(morgan1({
    stream: access1
}));
var swaggerOptions1 = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Employee Management API',
            version: '1.0.0',
            description: 'Employee Management',
            contact: {
                name: 'Sathyakrishna T',
                url: 'https://traklabssample.com',
                email: 'sathyakrishnata@gmail.com'
            },
            servers: ["http://localhost:9090"]
        }
    },
    apis: ["publisher.ts"]
};
var swaggerDocs1 = swaggerJSDoc1(swaggerOptions1);
app1.use('/api-docs', swaggerUI1.serve, swaggerUI1.setup(swaggerDocs1));
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
app1.get("/employee/:id/:name/:depatment", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, name_1, department;
    return __generator(this, function (_b) {
        try {
            _a = req.params, id = _a.id, name_1 = _a.name, department = _a.department;
            // const employee_data=await pool.query("INSERT INTO EMPLOYEE(id,name,department) VALUES($1,$2,$3) returning *",
            //[id,name,department])
            // res.json(employee_data.rows[0]);
            //console.log(req.body);
            //  res.json(req.body); 
            channel.sendToQueue("ORDER", Buffer.from(JSON.stringify({
                id: id,
                name: name_1,
                department: department
            })));
        }
        catch (error) {
            res.status(500).json(error);
        }
        return [2 /*return*/];
    });
}); });
connect1();
app1.listen(9090, function () {
    console.log("Server 9090");
});
