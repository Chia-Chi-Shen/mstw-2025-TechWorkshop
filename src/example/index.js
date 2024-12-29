import queryGPT from './openai_service.js';
import analyzePDFWithUrl from './doc_intelligence.js';

analyzePDFWithUrl()
  .then((data) => {
    const content = data.content;
    const question = "服務提供方需要保證服務的可用性為多少？"
    queryGPT(content, question);
  })
  .catch((err) => {
    console.error("Error:", err.message);
  });

// You can also use the async/await syntax.