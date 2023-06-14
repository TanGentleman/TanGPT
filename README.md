# TanGPT

Built around privacy. Fully open-source. Supports new larger 16K context for gpt-3.5, and 32k for those with gpt-4 access.
Maintained by Tan.
Steps to run on MacOs:
1. Clone this repository.
2. cd into the repo named TanGPT
3. `yarn`
4. `yarn run build`
5. `yarn run dev` for WebUI, accessing via browser at localhost:$PORT as the url, substituting $PORT from the output.
5. `yarn run electron` for an Electron app instance
6. Include your api key when using the official OpenAI endpoint, it is locally stored as an environment variable.
Please do not abuse the personal endpoint I host and provide as a proxy for testing.