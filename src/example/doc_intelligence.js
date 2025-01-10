import { DocumentAnalysisClient, AzureKeyCredential } from "@azure/ai-form-recognizer";

const endpoint_doc = "your_endpoint";
const docKey = "your_api_key";

async function analyzePDFWithUrl() {

  // Construct an DocumentAnalysisClient instance with necessary information
  // It can used for query the resource created in Document Intelligence
  const client = new DocumentAnalysisClient(endpoint_doc, new AzureKeyCredential(docKey));

  // Sample pdf url
  const blobUrl = "https://workshoppoc.blob.core.windows.net/pdf/demo1.pdf";

  console.log("Starting analysis from Blob Storage URL...");

  // Start document analyze process
  const poller = await client.beginAnalyzeDocumentFromUrl("prebuilt-document", blobUrl);

  // Polling job process until it finish
  const result = await poller.pollUntilDone();

  if (!result) {
    console.log("Failed to analyze the PDF file. :(");
    throw new Error("Failed to analyze the PDF file. :(");
  }

  return result;
}

export default analyzePDFWithUrl;
