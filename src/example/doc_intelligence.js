import { DocumentAnalysisClient, AzureKeyCredential } from "@azure/ai-form-recognizer";

const endpoint = "your_endpoint";
const apiKey = "your_api_key";

async function analyzePDFWithUrl(blobUrl) {
    const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(apiKey));
    console.log("Starting analysis from Blob Storage URL...");

    const poller = await client.beginAnalyzeDocumentFromUrl("prebuilt-document", blobUrl);

    const result = await poller.pollUntilDone();

    if (!result) {
        console.log("Failed to analyze the PDF file. :(");
        throw new Error("Failed to analyze the PDF file. :(");
    }

    return result;
}

export default analyzePDFWithUrl;
