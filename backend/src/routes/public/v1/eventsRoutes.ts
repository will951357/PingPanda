import express  from "express";
import {createEvent} from "@/controllers/public/eventsController";


export const eventRouter = express.Router();

eventRouter.post('/events', createEvent)

export default eventRouter
