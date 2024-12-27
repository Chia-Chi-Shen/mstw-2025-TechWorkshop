import { DocumentAnalysisClient, AzureKeyCredential } from "@azure/ai-form-recognizer";
import fs from 'fs';
import queryGPT from './chat_sdk';

const endpoint = "https://billy-doc-poc.cognitiveservices.azure.com/";
const apiKey = "<DOC_KEY>";

async function analyzePDF() {

  const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(apiKey));

  const pdfPath = "./sample.pdf";
  const pdfStream = fs.createReadStream(pdfPath);

  console.log("Uploading PDF and starting analysis...");
  const poller = await client.beginAnalyzeDocument("prebuilt-document", pdfStream, {
    contentType: "application/pdf",
  });
  const result = await poller.pollUntilDone();

  if (!result) {
    console.log("You fucked up :(");
    throw new Error("You fucked up :(")
  }

  console.log(result);
  return result;
}

analyzePDF()
  .then((data) => {
    const content = data.content;
    const question = "服務提供方需要保證服務的可用性為多少？"
    queryGPT(content, question);
  })
  .catch((err) => {
    console.error("Error:", err.message);
  });
