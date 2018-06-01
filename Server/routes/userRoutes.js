import express from 'express';
import RequestController from '../controllers/requestController';
import authenticateUser from '../middlewares/userAuthentication';
import { requestCheckUser, requestCheckUserDuplicate } from '../middlewares/checkRequest';
import { checkRequestId, createRequest, updateRequest } from '../middlewares/validation';

const router = express.Router();

router.get('/requests', authenticateUser, RequestController.getUserRequests);
router.get('/requests/:requestId', checkRequestId, authenticateUser, RequestController.getUserRequest);
router.post('/requests', createRequest, authenticateUser, requestCheckUserDuplicate, RequestController.createRequest);
router.put('/requests/:requestId', checkRequestId, authenticateUser, updateRequest, requestCheckUser, RequestController.updateUserRequest);

export default router;
