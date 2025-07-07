"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helloWorld = void 0;
const https_1 = require("firebase-functions/v2/https");
const firebase_functions_1 = require("firebase-functions");
// Limita el número de instancias por función
(0, firebase_functions_1.setGlobalOptions)({ maxInstances: 10 });
// Función HTTP simple de prueba
exports.helloWorld = (0, https_1.onRequest)((request, response) => {
    firebase_functions_1.logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
});
//# sourceMappingURL=index.js.map