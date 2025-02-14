// Learn more about clients at https://docs.boundaryml.com/docs/snippets/clients/overview

client<llm> MyDeepseekV3 {
  provider "openai-generic"
  options {
    base_url "https://api.together.ai/v1"
    api_key env.TOGETHER_API_KEY
    model "deepseek-ai/DeepSeek-V3"
    temperature 0
  }
}
