import { initTRPC } from "@trpc/server";
import cors from "cors";
import {createExpressMiddleware} from "@trpc/server/adapters/express";
import axios from "axios"

require('dotenv').config();
const express = require('express');
const { OpenAI } = require("langchain/llms/openai");
const { TextLoader } = require("langchain/document_loaders/fs/text");
const { CheerioWebBaseLoader } = require("langchain/document_loaders/web/cheerio");
const { RecursiveCharacterTextSplitter } = require( "langchain/text_splitter");
const { OpenAIEmbeddings } = require( "langchain/embeddings/openai");
const { MemoryVectorStore } = require( "langchain/vectorstores/memory");
const { RetrievalQAChain } = require( "langchain/chains");
const { ChatOpenAI } = require("langchain/chat_models/openai");

const app=express();
app.use(cors());

const t=initTRPC.create();
export const router =t.router;
export const publicProcedure=t.procedure;

const llm = new OpenAI({
    openAIApiKey: "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",
    temperature: 0.9,
  });

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 0,
  });
  
  const loader = new CheerioWebBaseLoader(
    "https://github.com/sinore69/backend/blob/main/data.txt"
  );

  const embeddings = new OpenAIEmbeddings();

export const appRouter=router({
    get:publicProcedure.query(async()=>{
        const jokes=(await axios.get('https://api.chucknorris.io/jokes/random')).data
        //const res=await llm.call("Why do you think city lights would prevent you from seeing stars");
        const data = await loader.load();
        const splitDocs = await textSplitter.splitDocuments(data);
        const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);
        const model = new ChatOpenAI({ modelName: "gpt-3.5-turbo" });
        const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
        const res = await chain.call({
            query: "Why do you think city lights would prevent you from seeing stars"
          });
        return res;
    })
})


app.use("/api",createExpressMiddleware({router:appRouter}))
export type AppRouter = typeof appRouter;
app.listen(process.env.PORT)