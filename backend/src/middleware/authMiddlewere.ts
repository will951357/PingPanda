import { Request, Response } from "express"; 


// tipagem opcional
export interface AuthRequest extends Request {
    userId?: string
    email?: string
  }