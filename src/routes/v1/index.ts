import { Router } from 'express';

import allEvents from './allEvents';
import myEvents from './myEvents';
import install from './install';
import uninstall from './uninstall';
import modifyEvents from './modifyEvents';
import hmacValidatorMiddleware from '@middlewares/hmacValidator';
import parametersMiddleware from '@middlewares/parameters';
import edusignApiMiddleware from '@middlewares/edusignApi';
import createEvent from "@routes/v1/createEvent";

/**
 * Creates and initializes a new router instance for handling API routes.
 * This router serves as the entry point for version 1 (v1) of the application's API.
 *
 * @constant
 */
const router = Router();

router.post('/homeRoute', edusignApiMiddleware, hmacValidatorMiddleware, parametersMiddleware, allEvents);
router.post('/myEvents', myEvents);
router.post('/allEvents', allEvents);
router.post('/createEvent', createEvent);
router.post('/install', install);
router.post('/modifyEvents', modifyEvents);
router.post('/uninstall', hmacValidatorMiddleware, uninstall);

export default router;
