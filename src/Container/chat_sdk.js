import AzureOpenAI from 'openai';

const endpoint = "https://ai-allen7845123692269ai150842469449.openai.azure.com"
const apiKey = "<GPT_KEY>"
const apiVersion = "2024-08-01-preview";
const deployment = "gpt-35-turbo-2"; //This must match your deployment name.

async function queryGPT(contract, question) {

  const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });

  const system_prompt = "You are a contract analyst assistant. Your task is to help users understand the content of a provided contract. You will: \n \
                            1. Only respond based on the contract's content. \n \
                            2. If the contract doesn't contain the information requested, reply with \"The contract does not provide information about this.\" \n \
                            3. Always provide concise and clear answers based on the specific content of the contract.\n \
                            4. Assume the contract text has been fully loaded and is available to you in the context. \n \
                        "
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

  for (const choice of result.choices) {
    console.log(choice.message);
  }
}

module.exports = queryGPT;