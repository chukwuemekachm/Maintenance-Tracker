import express from 'express';
import AdminController from '../controllers/adminController';
import authenticateAdmin from '../middlewares/adminAuthentication';
import { checkRequestId, filterRequest } from '../middlewares/validation';
import { requestCheckPending, requestCheckApprove } from '../middlewares/checkRequest';

const router = express.Router();

router.get('/', authenticateAdmin, filterRequest, AdminController.getRequests);
router.put('/:requestId/approve', checkRequestId, authenticateAdmin, requestCheckPending, AdminController.approveRequest);
router.put('/:requestId/disapprove', checkRequestId, authenticateAdmin, requestCheckPending, AdminController.disapproveRequest);
router.put('/:requestId/resolve', checkRequestId, authenticateAdmin, requestCheckApprove, AdminController.resolveRequest);

export default router;
