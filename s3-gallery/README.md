# S3 Gallery PWA

A Progressive Web App for browsing and viewing images and videos from your Amazon S3 bucket. Built with Next.js and designed to work offline with secure credential storage.

## Features

- 📱 **Progressive Web App** - Install on any device, works offline
- 🔐 **Secure Credential Storage** - Safely store your AWS Access Key ID and Secret Access Key locally
- 🖼️ **Image Gallery** - View images from your S3 bucket in an elegant gallery interface
- 🎥 **Video Support** - Play videos directly from your S3 bucket
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS
- ⚡ **Fast Performance** - Built with Next.js and optimized for speed

## Getting Started

### Prerequisites

- Node.js 18 or later
- An AWS S3 bucket with images/videos
- AWS Access Key ID and Secret Access Key with S3 read permissions

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd s3-gallery
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Configuration

1. Click the settings icon in the top right corner
2. Enter your AWS credentials:
   - **Access Key ID**: Your AWS Access Key ID
   - **Secret Access Key**: Your AWS Secret Access Key
   - **Bucket Name**: Name of your S3 bucket
   - **Region**: AWS region where your bucket is located (e.g., us-east-1)

Your credentials are stored securely in your browser's local storage and never sent to any external servers.

## Building for Production

```bash
npm run build
npm start
```

## Installing as PWA

1. Open the app in your browser
2. Look for the "Install" prompt or click the install icon in your browser's address bar
3. Follow the prompts to install the app on your device

## Security

- All AWS credentials are stored locally in your browser
- No credentials are transmitted to any external servers
- The app communicates directly with AWS S3 using your credentials

## Tech Stack

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **AWS SDK** - S3 integration
- **next-pwa** - Progressive Web App functionality

## Project Structure

```
s3-gallery/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles
│   ├── components/
│   │   ├── Gallery.tsx     # Main gallery component
│   │   ├── LoadingSpinner.tsx
│   │   └── SettingsModal.tsx
│   └── lib/
│       ├── s3-client.ts    # S3 client configuration
│       └── storage.ts      # Local storage utilities
├── public/
│   ├── manifest.json       # PWA manifest
│   └── icons/             # App icons
└── package.json
```

## AWS Permissions

Your AWS user needs the following S3 permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::your-bucket-name",
                "arn:aws:s3:::your-bucket-name/*"
            ]
        }
    ]
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run lint` to check for issues
5. Submit a pull request

## License

[MIT License](LICENSE)