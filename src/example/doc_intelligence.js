import { DocumentAnalysisClient, AzureKeyCredential } from "@azure/ai-form-recognizer";

const endpoint_doc = "your_endpoint";
const docKey = "your_api_key";

async function analyzePDFWithUrl() {
    const client = new DocumentAnalysisClient(endpoint_doc, new AzureKeyCredential(docKey));

    const blobUrl = "https://workshoppoc.blob.core.windows.net/pdf/test.pdf";

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
