import { initTRPC } from "@trpc/server";
import cors from "cors";
import {createExpressMiddleware} from "@trpc/server/adapters/express";
import axios from "axios"

require('dotenv').config();
const express = require('express');
const { OpenAI } = require("langchain/llms/openai");
const { TextLoader } = require("langchain/document_loaders/fs/text");

const app=express();
app.use(cors());

const t=initTRPC.create();
export const router =t.router;
export const publicProcedure=t.procedure;

const llm = new OpenAI({
    openAIApiKey: "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",
    temperature: 0.9,
  });


  const loader = new TextLoader("src/document_loaders/example_data/example.txt");
  
  
  

export const appRouter=router({
    get:publicProcedure.query(async()=>{
        const jokes=(await axios.get('https://api.chucknorris.io/jokes/random')).data
        const res=await llm.call("What would be a good company name for a company that makes colorful socks?");
        
        const docs = await loader.load();

        return res;
    })
})


app.use("/api",createExpressMiddleware({router:appRouter}))
export type AppRouter = typeof appRouter;
app.listen(process.env.PORT)