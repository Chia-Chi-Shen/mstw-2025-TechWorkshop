import { AzureOpenAI } from 'openai';

const endpoint_openai = "your_endpoint";
const openAiKey = "your_api_key";
const apiVersion = "your_api_version";
const deployment = "your_deployment";

async function queryModel(contract, question) {

  // Construct an AzureOpenAI instance with necessary information
  // It can used for query LLM created in AzureOpenAI
  const client = new AzureOpenAI({ 
    endpoint: endpoint_openai, 
    apiKey: openAiKey, 
    apiVersion, 
    deployment, 
    dangerouslyAllowBrowser: true });

  // System prompt is an initial instruction to guide the LLM's behavior and responses.
  const system_prompt = `You are a contract analyst assistant. Your task is to help users understand the content of a provided contract.`

  // User prompt is the input or question provided by the user to the LLM. 
  const user_prompt = `Below is the text of a contract. Please answer the question based on this contract. \n \
                        Contract:
                        ${contract} \n \
                        --- \n \
                        Question: ${question}`

  // Query LLM
  const result = await client.chat.completions.create({
    messages: [
      { role: "system", content: system_prompt },
      { role: "user", content: user_prompt },
    ],
    max_tokens: 100,
    temperature: 0.2
  });

  return result.choices[0].message.content;
}

export default queryModel;