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
var express = require('express');
var morgan = require('morgan');
var app = express();
var Pool = require('pg').Pool;
var swaggerJSDoc = require('swagger-jsdoc');
var swaggerUI = require('swagger-ui-express');
var amqp = require('amqplib');
app.use(express.json());
var fs = require("fs");
var channel, connection;
function assignId(req, res, next) {
    req.id = 'Some ID';
}
var pool = new Pool({
    user: "postgres",
    password: "password",
    host: "localhost",
    port: 5433,
    database: "postgres"
});
function connect() {
    return __awaiter(this, void 0, void 0, function () {
        var amqpServer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    amqpServer = "amqp://localhost:5672";
                    return [4 /*yield*/, amqp.connect(amqpServer)];
                case 1:
                    connection = _a.sent();
                    return [4 /*yield*/, connection.createChannel()];
                case 2:
                    channel = _a.sent();
                    return [4 /*yield*/, channel.assertQueue("ORDER")];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
connect().then(function () {
    channel.consume("ORDER", function (data) {
        var _a = JSON.parse(data.content), id = _a.id, name = _a.name, department = _a.department;
        console.log("Consuming ORDER");
        console.log(id, name, department);
        channel.ack(data);
    });
});
var access = fs.createWriteStream(__dirname + "/info.log", { flags: "a" });
app.use(morgan({
    stream: access
}));
var swaggerOptions = {
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
            servers: ["http://localhost:8811"]
        }
    },
    apis: ["index.ts"]
};
var swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
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
 * /employee:
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
app.post("/employee/post", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, name_1, department, employee_data, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, id = _a.id, name_1 = _a.name, department = _a.department;
                return [4 /*yield*/, pool.query("INSERT INTO EMPLOYEE(id,name,department) VALUES($1,$2,$3) returning *", [id, name_1, department])
                    // res.json(employee_data.rows[0]);
                    //console.log(req.body);
                    //  res.json(req.body); 
                ];
            case 1:
                employee_data = _b.sent();
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                res.status(500).json(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
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
app.get('/employee', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var employee_data, data, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, pool.query("SELECT * FROM EMPLOYEE")];
            case 1:
                employee_data = _a.sent();
                res.json(employee_data.rows);
                data = employee_data.rows;
                console.log(data);
                //res.json(req.body); 
                module.exports.variableName = data;
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                res.status(500).json(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
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
app.get('/sortemployee/name', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var employee_data, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, pool.query("SELECT * FROM EMPLOYEE ORDER BY name ASC;")];
            case 1:
                employee_data = _a.sent();
                res.json(employee_data.rows);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                res.status(500).json(error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
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
app.get('/sortemployee/department', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var employee_data, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, pool.query("SELECT * FROM EMPLOYEE ORDER BY department ASC;")];
            case 1:
                employee_data = _a.sent();
                res.json(employee_data.rows);
                console.log(req.body);
                res.json(req.body);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                res.status(500).json(error_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @swagger
 * /employee/{employee_id}:
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
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description: error
 */
app.get('/employee/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, data, employee_data, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                data = {};
                return [4 /*yield*/, pool.query("SELECT * FROM EMPLOYEE where id=$1", [id])];
            case 1:
                employee_data = _a.sent();
                data = employee_data;
                res.json(data);
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                res.status(500).json(error_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
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
app.put("/updateemployee/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, name_2, department, employee_data;
    return __generator(this, function (_b) {
        try {
            id = req.params.id;
            _a = req.body, name_2 = _a.name, department = _a.department;
            employee_data = pool.query("UPDATE EMPLOYEE SET name=$1, department=$2 where id=$3 returning *", [name_2, department, id]);
            res.json(employee_data.rows[0]);
        }
        catch (error) {
            res.status(500).json(error);
        }
        return [2 /*return*/];
    });
}); });
/**
 * @swagger
 * /employee/{employee_id}:
 *  delete:
 *   summary: delete employee
 *   description: delete employee
 *   parameters:
 *    - in: path
 *      name: employee_id
 *      schema:
 *       type: integer
 *      required: true
 *      description: id of the employee
 *      example: 2
 *   responses:
 *    200:
 *     description: success
 */
app.delete("/employee/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, employee_data_delete, data, data_1;
    return __generator(this, function (_a) {
        id = req.params.id;
        employee_data_delete = pool.query("DELETE FROM EMPLOYEE WHERE id=$1 returning *", [id]);
        data = employee_data_delete.rows;
        //console.log(data);
        if (data) {
            console.log("Data deleted");
        }
        else {
            data_1 = {
                info: "No Employee to Delete"
            };
        }
        res.json(data);
        return [2 /*return*/];
    });
}); });
// old API
app.listen(8811, function () {
    console.log("Server 8811");
});
