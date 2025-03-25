# Image Processing App

## Overview
This application processes image data from CSV files asynchronously. It downloads images, compresses them, and stores the processed images. Users can upload a CSV file with image URLs and later retrieve the output file containing processed image links.

## Features
- **Upload API**: Accepts a CSV file and returns a unique request ID.
- **Status API**: Check processing status using the request ID.
- **Asynchronous Processing**: Image compression runs in the background.
- **Webhook Support**: Notifies external services upon completion.
- **Database Storage**: Tracks request status and stores processed image URLs.

## Tech Stack
- **Backend**: Node.js (Express)
- **Database**: PostgreSQL / MongoDB
- **Message Queue**: Redis (BullMQ)
- **Storage**: AWS S3
- **Image Processing**: Sharp (Node.js library)

## Prerequisites
Ensure you have the following installed on your system:
- Node.js (v18+)
- PostgreSQL / MongoDB
- Redis
- Docker (optional, for containerized setup)
- AWS S3 bucket (for storing processed images)

## Installation
### 1. Clone the Repository
```sh
git clone https://github.com/your-username/Image_Processing_App.git
cd Image_Processing_App
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory and add the following:
```ini
PORT=3000
DATABASE_URL=postgres://username:password@localhost:5432/image_db
REDIS_URL=redis://localhost:6379
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET_NAME=your-bucket-name
```

### 4. Set Up Database
If using PostgreSQL, run migrations:
```sh
npm run migrate
```

### 5. Start Redis Server
Ensure Redis is running:
```sh
redis-server
```

## Running the Application
### Start the Server
```sh
npm start
```
The API will be available at `http://localhost:3000`

### Running with Docker
1. Build the Docker image:
```sh
docker build -t image_processing_app .
```
2. Run the container:
```sh
docker run -p 3000:3000 --env-file .env image_processing_app
```

## API Endpoints
### 1. Upload CSV File
**Endpoint:** `POST /upload`
- **Description:** Accepts a CSV file and returns a request ID.
- **Payload:** Multipart form-data with `file` field.
- **Response:**
```json
{
  "request_id": "12345"
}
```

### 2. Check Processing Status
**Endpoint:** `GET /status/:request_id`
- **Response:**
```json
{
  "status": "processing",
  "processed_count": 10,
  "total_count": 20
}
```

### 3. Webhook Callback (Optional)
- **Triggered after processing is complete**
- Sends JSON payload with processed data

## Folder Structure
```
Image_Processing_App/
│── src/
│   ├── controllers/
│   ├── services/
│   ├── workers/
│   ├── models/
│   ├── routes/
│── public/
│── config/
│── .env
│── package.json
│── README.md
```

## Testing the APIs
### Using Postman
1. Import the Postman collection (`postman_collection.json`) from the repo.
2. Send requests to the APIs.

### Running Tests
```sh
npm test
```

## Deployment
### Deploying on AWS EC2
1. Set up an EC2 instance with Node.js and Redis.
2. Pull the repository and install dependencies.
3. Set up environment variables and run the server.

### CI/CD Pipeline
Integrate with GitHub Actions / Jenkins for automated deployments.

## Contributing
1. Fork the repo
2. Create a new branch (`feature-branch`)
3. Commit changes and push to your branch
4. Open a pull request

## License
This project is licensed under the MIT License.
