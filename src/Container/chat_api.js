import axios from 'axios';

const apiKey = "<GPT_KEY>";

async function queryGPT(contract, question) {
    const url = `https://ai-allen7845123692269ai150842469449.openai.azure.com/openai/deployments/gpt-35-turbo/chat/completions?api-version=2024-08-01-preview`

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
                        Question: ${question}
                        `

    try {
        const response = await axios.post(
            url,
            {
                messages: [
                    { role: "system", content: system_prompt },
                    { role: "user", content: user_prompt }
                ],
                max_tokens: 100,
                temperature: 0.7
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "api-key": apiKey
                }
            }
        );

        console.log("Response from GPT-35-Turbo:");
        console.log(response.data.choices[0].message.content);
    } catch (error) {
        console.error("Error querying GPT-35-Turbo:", error.response?.data || error.message);
    }
}

module.exports = queryGPT;