import express from "express";
const router = express.Router();
// A importação do controller pode não ser mais necessária aqui, pois o user.handler.js
// agora é responsável por chamar os métodos do controller.

// A rota POST /api/users/register agora é gerenciada por:
// 1. Configuração do API Gateway que aponta para a função serverless user.handler.js
// 2. O arquivo api/handlers/user.handler.js que processa o evento e chama
//    userController.register.

// A rota POST /api/users/login agora é gerenciada pelo user.handler.js
// que chama userController.login.

export default router;