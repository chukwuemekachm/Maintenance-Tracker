import express from 'express';
import AdminController from '../controllers/adminController';
import authenticateAdmin from '../middlewares/adminAuthentication';
import { checkRequestId } from '../middlewares/validation';
import { requestCheckPending, requestCheckApprove } from '../middlewares/checkRequest';

const router = express.Router();

router.get('/', authenticateAdmin, AdminController.getRequests);
router.put('/:requestId/approve', checkRequestId, authenticateAdmin, requestCheckPending, AdminController.approveRequest);
router.put('/:requestId/disapprove', checkRequestId, authenticateAdmin, requestCheckPending, AdminController.disapproveRequest);
router.put('/:requestId/resolve', checkRequestId, authenticateAdmin, requestCheckApprove, AdminController.resolveRequest);

router.all('*', (req, res) => res.status(404).json({
  status: 'error',
  code: 404,
  message: 'Route not supported on server.',
}));

export default router;
