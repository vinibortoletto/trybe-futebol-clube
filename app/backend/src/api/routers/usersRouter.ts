import { Router } from 'express';
import UserController from '../controllers/UserController';
import { ValidateLogin } from '../middlewares';
import ValidateToken from '../middlewares/ValidateToken';
import UserService from '../services/UserService';

const router = Router();
const service = new UserService();
const controller = new UserController(service);

router.post('/login', ValidateLogin.validate, controller.login.bind(controller));
router.get('/login/role', ValidateToken.validate, controller.getRole.bind(controller));

export default router;
