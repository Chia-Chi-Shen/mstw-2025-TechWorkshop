import { useState, useRef } from 'react';
import { DocumentAnalysisClient, AzureKeyCredential } from "@azure/ai-form-recognizer";
import AzureOpenAI from 'openai';
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
  { title: 'PDF 1', url: '/sample.pdf' },
  { title: 'PDF 2', url: '/sample.pdf' },
  { title: 'PDF 3', url: '/sample.pdf' },
  { title: 'PDF 4', url: '/sample.pdf' },
  { title: 'PDF 5', url: '/sample.pdf' },
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
      const data = await analyzePDF()
      const content = data.content;
      // Then, query the GPT model.
      const result = await queryGPT(content, question);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  // Implement the analyzePDF function here
  const analyzePDF = async () => {

    const result = {
      content: "This is a sample contract. It contains information about the terms and conditions of the agreement between the parties. The contract is legally binding and enforceable in a court of law. The contract is written in English and is in PDF format. The contract is signed by the parties and contains their names and signatures. The contract contains provisions relating to the payment of money, the delivery of goods, and the performance of services. The contract also contains provisions relating to the termination of the agreement and the resolution of disputes between the parties. The contract is dated and contains the date of the agreement. The contract is valid and enforceable in accordance with the laws of the jurisdiction in which it was signed."
    }
    // const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(docKey));

    // const pdfUrl = "https://storage.googleapis.com/[BUCKET_NAME]/[FILE_NAME].pdf"; // 你的雲端檔案連結
    // const response = await fetch(pdfUrl);

    // if (!response.ok) {
    //   throw new Error("Failed to fetch the PDF file");
    // }

    // // 將 PDF 轉換為 Blob
    // const pdfBlob = await response.blob();

    // console.log("Uploading PDF and starting analysis...");
    // const poller = await client.beginAnalyzeDocument("prebuilt-document", pdfBlob, {
    //   contentType: "application/pdf",
    // });
    // const result = await poller.pollUntilDone();

    // if (!result) {
    //   console.log("Something went wrong :(");
    //   throw new Error("Analysis failed.");
    // }

    // console.log(result);
    return result;
  }

  // Implement the queryGPT function here
  const queryGPT = async (contract, question) => {
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

    setMessages([...messages, { text: result.choices[0].message.content, side: 'right' }]);

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
              <a href="sample.pdf" target="_blank">{pdf.title}</a>
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
