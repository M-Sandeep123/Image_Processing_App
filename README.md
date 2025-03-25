# Image Processing App

## Overview
This application processes images from a CSV file asynchronously. It accepts a CSV file with image URLs, compresses the images by 50%, stores the results in a PostgreSQL database, and provides APIs to check processing status.

## Tech Stack
- **Backend:** Node.js (Express.js)
- **Database:** PostgreSQL
- **Queue Processing:** Redis (BullMQ)
- **Storage:** Local or Cloud (AWS S3, Google Cloud Storage)

## Features
- Asynchronous image processing
- CSV file upload & validation
- Image compression (50%)
- Database storage for processed images
- Status check API
- Webhook for completion notification

## Setup Instructions
### Prerequisites
Ensure you have the following installed:
- Node.js (>=16.x)
- PostgreSQL
- Redis

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/M-Sandeep123/Image_Processing_App
   cd Image_Processing_App
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file and configure the following:
   ```env
   PORT=3000
   DATABASE_URL=postgres://user:password@localhost:5432/image_processing_db
   REDIS_URL=redis://localhost:6379
   STORAGE_PATH=./processed_images
   ```
4. Start PostgreSQL and Redis:
   ```sh
   sudo service postgresql start
   redis-server
   ```
5. Run database migrations:
   ```sh
   npm run migrate
   ```
6. Start the application:
   ```sh
   npm start
   ```

## API Endpoints
### 1. Upload CSV File
- **Endpoint:** `POST /upload`
- **Description:** Accepts a CSV file, validates it, and returns a request ID.
- **Request:**
  ```sh
  curl -X POST -F "file=@sample.csv" http://localhost:3000/api/v1/upload
  ```
- **Response:**
  ```json
  { "requestId": "12345" }
  ```

### 2. Check Processing Status
- **Endpoint:** `GET /status/:requestId`
- **Description:** Returns the processing status for a given request ID.
- **Response:**
  ```json
  { "status": "Processing", "completed": 50 }
  ```

## Running with Docker
1. Build and start the containers:
   ```sh
   docker-compose up --build
   ```
2. Stop the containers:
   ```sh
   docker-compose down
   ```

## Testing
Run tests with:
```sh
npm test
```

## Webhook Integration
After processing all images, a webhook notification is sent.
- Configure the webhook URL in `.env`:
  ```env
  WEBHOOK_URL=http://example.com/webhook
  ```

## Contributing
1. Fork the repository
2. Create a new branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push (`git push origin feature-name`)
5. Open a Pull Request

## License
MIT License