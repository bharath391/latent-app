import {Router} from 'express';
import eventController from './events.controller.js';
import adminAuth from '../middleware/admin.auth.js';
import userAuth from '../middleware/user.auth.js';
const router:Router = Router();

router.get('/all-events',userAuth,eventController.getAllEvents);
router.get('/event',userAuth,eventController.getEvent);//single event
router.post('/post',adminAuth,eventController.createEvent);
router.patch('/update',adminAuth,eventController.updateEvent);
router.delete('/delete',adminAuth,eventController.deleteEvent);


export default router;