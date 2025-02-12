import swaggerJSDoc from "swagger-jsdoc";
import path from "path";
import { __dirname } from "./utils.js";
import fs from 'fs';

const opts = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Eccommerce Api Hiza",
            version: "1.0.0",
            description: "Ecommerce API Documentation"
        }
    },
    apis: [path.join(__dirname, "docs/*.yaml")]

};
const docSpec = swaggerJSDoc(opts);

export default docSpec;
