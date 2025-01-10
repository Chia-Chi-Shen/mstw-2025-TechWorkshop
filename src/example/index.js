import queryModel from './openai_service.js';
import analyzePDFWithUrl from './doc_intelligence.js';

// A sample PDF file hosted in Azure Blob Storage
const blobUrl = "https://workshoppoc.blob.core.windows.net/pdf/test.pdf";
// You can replace the question with your own.
const question = "服務提供方需要保證服務的可用性為多少？";

analyzePDFWithUrl(blobUrl)
  .then((data) => {
    return queryModel(data.content, question);
  })
  .then((modelResponse) => {
    console.log("Model Response:\n", modelResponse, "\n");
  })
  .catch((err) => {
    console.error("Error:", err.message);
  });


// You can rewrite the code in async/await syntax.