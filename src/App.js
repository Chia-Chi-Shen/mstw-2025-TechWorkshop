import { useState, useRef } from 'react';
import { DocumentAnalysisClient, AzureKeyCredential } from "@azure/ai-form-recognizer";
import { AzureOpenAI } from 'openai';
import './App.css';

const testMessages = [
  { text: 'Hello', side: 'left' },
  { text: 'Hi', side: 'right' },
  { text: 'How are you?', side: 'left' },
  { text: 'I am fine', side: 'right' },
  { text: 'Good to hear', side: 'left' },
  { text: 'Hello', side: 'left' },
  { text: 'Hi', side: 'right' },
  { text: 'How are you?', side: 'left' },
  { text: 'I am fine', side: 'right' },
  { text: 'Good to hear', side: 'left' },
  { text: 'Hello', side: 'left' },
  { text: 'Hi', side: 'right' },
  { text: 'How are you?', side: 'left' },
  { text: 'I am fine', side: 'right' },
  { text: 'Good to hear', side: 'left' },
  { text: 'Hello', side: 'left' },
  { text: 'Hi', side: 'right' },
  { text: 'How are you?', side: 'left' },
  { text: 'I am fine', side: 'right' },
  { text: 'Good to hear', side: 'left' },
];

const pdfList = [
  { title: 'demo1.pdf', url: 'https://workshoppoc.blob.core.windows.net/pdf/demo1.pdf' },
  { title: 'demo2.pdf', url: 'https://workshoppoc.blob.core.windows.net/pdf/demo2.pdf' },
  { title: 'demo3.pdf', url: 'https://workshoppoc.blob.core.windows.net/pdf/demo3.pdf' },
];

const endpoint = "https://ai-allen7845123692269ai150842469449.openai.azure.com"
const apiVersion = "2024-08-01-preview";
const deployment = "gpt-35-turbo-2";

function App() {
  const [messages, setMessages] = useState(testMessages);
  const [apiKey, setApiKey] = useState(localStorage.getItem('ApiKey') || '');
  const [docKey, setDocKey] = useState(localStorage.getItem('DocKey') || '');
  const messageEndRef = useRef(null);

  const sendQuestion = async () => {
    if (!apiKey) {
      window.alert('Please enter the API Key');
      return;
    }
    if (!docKey) {
      window.alert('Please enter the DOC Key');
      return;
    }
    // Get the question from the textarea and update the messages.
    const question = document.querySelector('.chat-box textarea').value;
    setMessages([...messages, { text: question, side: 'left' }]);

    // Start the analysis process.
    try {
      // First, analyze the PDF file.
      const data = await analyzePDFWithUrl()
      const content = data.content;
      // Then, query the GPT model.
      const result = await queryGPT(content, question);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  // Implement the analyzePDF function here
  async function analyzePDFWithUrl() {
    const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(apiKey));

    const blobUrl = "https://workshoppoc.blob.core.windows.net/pdf/test.pdf";

    console.log("Starting analysis from Blob Storage URL...");
    const poller = await client.beginAnalyzeDocumentFromUrl("prebuilt-document", blobUrl);

    const result = await poller.pollUntilDone();

    if (!result) {
      console.log("You fucked up :(");
      throw new Error("You fucked up :(");
    }

    console.log(result);
    return result;
  }

  // Implement the queryGPT function here
  const queryGPT = async (contract, question) => {
    question = "服務提供方需要保證服務的可用性為多少？"
    console.log('API Key:', apiKey);
    const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment, dangerouslyAllowBrowser: true });

    const system_prompt = `You are a contract analyst assistant. Your task is to help users understand the content of a provided contract. You will: \n \
                              1. Only respond based on the contract's content. \n \
                              2. If the contract doesn't contain the information requested, reply with \"The contract does not provide information about this.\" \n \
                              3. Always provide concise and clear answers based on the specific content of the contract.\n \
                              4. Assume the contract text has been fully loaded and is available to you in the context. \n \
                          `
    const user_prompt = `Below is the text of a contract. Please answer the question based on this contract. \n \
                          Contract:
                          ---
                          ${contract} \n \
                          \n \
                          --- \n \
                          \n \
                          Question: ${question}`

    const result = await client.chat.completions.create({
      messages: [
        { role: "system", content: system_prompt },
        { role: "user", content: user_prompt },
      ],
      max_tokens: 100,
      temperature: 0.5
    });

    setMessages([...messages, { text: result.choices[0].message.content, side: 'left' }]);

    // Scroll to the end of the messages.
    messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  }

  const handleApiKey = () => {
    const target = document.querySelector('.api-key')
    const ApiKey = target.value;
    localStorage.setItem('ApiKey', ApiKey);
    setApiKey(ApiKey);
    window.alert('API Key saved successfully');
  }

  const handleDocKey = () => {
    const target = document.querySelector('.doc-key')
    const DocKey = target.value;
    localStorage.setItem('DocKey', DocKey);
    setDocKey(DocKey);
    window.alert('DOC Key saved successfully');
  }


  return (
    <div className="page-container">
      <section className='container'>
        <h1>PDF Viewer</h1>
        <div className="key-container">
          <div className="key-row">
            <span className="key-label">DOC Key:</span>
            <input className="key-input doc-key" type="password" />
            <button className="key-button" onClick={handleDocKey}>Save</button>
          </div>
          <div className="key-row">
            <span className="key-label">API Key:</span>
            <input className="key-input api-key" type="password" />
            <button className="key-button" onClick={handleApiKey}>Save</button>
          </div>
        </div>
        <ul className="pdf-list">
          {pdfList.map((pdf, index) => (
            <li key={index}><input type="radio" value="pdf2" />
              <a href={pdf.url} target="_blank">{pdf.title}</a>
            </li>
          ))}
        </ul>
      </section>
      <section className='container' style={{ backgroundColor: '#eeeded' }}>
        <h1>Chatroom</h1>
        <div className="chatroom-container">
          {messages.map((message, index) => (
            <div key={index} className="message-container">
              <div className={`message message-${message.side}`}>{message.text}</div>
            </div>
          ))}
          <div ref={messageEndRef}></div>
        </div>
        <div className="chat-box">
          <textarea placeholder="Enter your message..."></textarea>
          <button onClick={sendQuestion}>Send</button>
        </div>
      </section>
    </div>
  );
}

export default App;
