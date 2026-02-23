# Classroom Clarity Web App

Responsive web application built for Classroom Clarity, allowing students and educators to upload school documents and run AI-based Q&A workflows. The app features:
- **Astro** for lightning-fast frontend static generation and routing.
- **Tailwind CSS v4** for comprehensive, responsive styling and native Dark Mode.
- **Firebase Functions (Express.js proxy)** for routing all Q&A and document requests seamlessly to the core API without CORS issues.

## 🚀 Running Locally

To run the application locally and have the Firebase proxy target your local API (which should be running on `http://localhost:8080`):

### 1. Configure the Proxy
Ensure the `.env` file inside the `functions` directory points to your backend.
The environment variable should be:
```env
API_TARGET=http://localhost:8080
```
This is the default configuration, but you can alter it if your backend changes ports.

### 2. Build the Project
Firebase Hosting serves the built version of the site, so you must compile both Astro and the TypeScript proxy first:
```bash
# Build the Astro frontend
npm run build

# Build the Firebase functions
cd functions
npm run build
cd ..
```

### 3. Start the Firebase Emulators
Start both the local Hosting server and the Functions emulator. Note: Since we don't have a production project hardcoded, we use the `demo-test` project for the emulator suite:
```bash
npx firebase emulators:start --project demo-test
```

### 4. Verify

The emulators will boot up:
- The frontend will be served at **`http://localhost:5002`** (or whichever port Firebase assigns).
- Any network call the frontend makes to `http://localhost:5002/api/...` will automatically be routed to `http://localhost:8080/api/...` securely by the backend proxy function.

If you just want to develop the frontend components without running the Firebase proxy, you can start Astro's native dev server using:
```bash
npm run dev
```

## 📂 Project Structure

```text
/
├── designs/                 # Original Stitch HTML Screens
├── functions/               # Firebase Functions (Express proxy)
├── src/
│   ├── layouts/             # Shared page layouts (Sidebar, header)
│   ├── pages/               # Astro routes (index, library, upload, qa-dark)
│   └── styles/              # Global Tailwind configuration
├── astro.config.mjs         # Astro configuration
└── firebase.json            # Firebase Hosting and Functions configuration
```
