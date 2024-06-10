# AI Voice Transcription Tool by [Builderkit.ai](https://www.builderkit.ai)

`nextjs` `typescript` `astria` `supabase`

## Introduction

The Voice Transcription tool uploads the recorded audio or selected audio file in supabase storage and creates the transcription of the audio using deepgram. It recieves the transcription response in webhook response and display the output using supabase realtime. It also generates a summary of the transcripted audio.

<a href="https://voice-transcription.builderkit.ai/home" target="_blank" rel="noopener">
  <picture>
    <img alt="AI Voice Transcription Tool" src="https://voice-transcription.builderkit.ai/github-cover.webp" />
  </picture>
</a>

## Features

- 💾 Converts audio files or recording into text using Deepgram's powerful API.
- 🕵️ Generate AI headshots using detailed prompts.
- 🔄 Real-time updates and image generation status.
- 💻 User-friendly interface for input and generation management using Shadcn.
- 🔗 Secure user authentication with OAuth support.

## Quickstart Guide

### Prerequisites

Ensure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**

   Use the Project Url based on your plan

   - Starter - https://github.com/1811-Labs-LLC/BuilderKit-Starter.git
   - Pro - https://github.com/1811-Labs-LLC/BuilderKit-Pro.git

   ```sh
   git clone <url>

   cd builderkit

   git checkout voice-transcription
   ```

2. **Install dependencies:**

   ```sh
   npm install
   # or
   yarn install
   ```

3. **Environment Variables:**

   Create a `.env.local` file in the root directory and add the following variables:

   ```plaintext
   NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
   SUPABASE_STORAGE_BUCKET_NAME=<your-supabase-storage-bucket-name>
   DEEPGRAM_API_KEY=<your-deepgram-api-key>
   OPENAI_API_KEY=<your-openai-api-key>
   NEXT_PUBLIC_GOOGLE_ANALYTICS_KEY=<your-google-analytics-key>
   ```

4. **Sync Supabase Types:**

   This will sync the table schema locally from Supabase. Run the below commands to login to supabase and sync the schema type.

   ```sh
   supabase login

   npx supabase gen types typescript --project-id <project-id> --schema public > src/types/supabase.ts
   ```

### Running the Application

1. **Run the development server:**

   ```sh
   npm run dev
   # or
   yarn dev
   ```

   This will start the development server on `http://localhost:3000`.

2. **Build for production:**

   ```sh
   npm run build
   # or
   yarn build
   ```

   This command compiles the application for production usage.

3. **Start the production server:**

   ```sh
   npm start
   # or
   yarn start
   ```

   This will start the application in production mode.

### Additional Scripts

- **Prepare Husky for Git hooks:**

  ```sh
  npm run prepare
  ```

- **Validate the code with Linting, Formatting & Typecheck:**

  ```sh
  npm run validate
  ```

## Requirements

- **Node.js**: Download and install from [here](https://nodejs.org/).
- **Supabase**: Create an account and a new project on [Supabase](https://supabase.com/). Obtain the required keys from your project settings.
- **Supabase Storage**: Create a bucket in your Supabase [Storage](https://supabase.com/storage) to get the bucket name (add required policies in the bucket)
- **OpenAI API Key**: Sign up for an API key on [OpenAI](https://openai.com/).
- **Deepgram**: Create an account to get $200 worth free credits and API key on [Deepgram](https://deepgram.com/)

## License

This project is licensed under the MIT License. See the [LICENSE](https://www.builderkit.ai/license) file for details.

## Contact

For any inquiries or issues, please open an issue on the [GitHub repository](https://github.com/1811-Labs-LLC/BuilderKit) or contact the author at [vatsal1811@gmail.com](mailto:vatsal1811@gmail.com).
# audioNotes
