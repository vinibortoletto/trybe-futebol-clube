import { Router } from 'express';
import UserController from '../controllers/UserController';
import ValidateLogin from '../middlewares/ValidateLogin';
import UserService from '../services/UserService';

const router = Router();
const service = new UserService();
const controller = new UserController(service);

router.post('/login', ValidateLogin.validate, controller.login.bind(controller));

export default router;
