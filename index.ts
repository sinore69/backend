import { initTRPC } from "@trpc/server";
import cors from "cors";
import {createExpressMiddleware} from "@trpc/server/adapters/express";
import axios from "axios"

require('dotenv').config();
const express = require('express');
const app=express();
app.use(cors());

const t=initTRPC.create();
export const router =t.router;
export const publicProcedure=t.procedure;


export const appRouter=router({
    get:publicProcedure.query(async()=>{
        const jokes=(await axios.get('https://api.chucknorris.io/jokes/random')).data
        return jokes.value
    })
})


app.use("/api",createExpressMiddleware({router:appRouter}))
export type AppRouter = typeof appRouter;
app.listen(process.env.PORT)