# Smart Fashion Microservices Architecture

This project is a multi-service e-commerce platform that uses Machine Learning to route users to the most relevant product catalog (Men or Women) based on their profile and interactions.

## Architecture
- **index-service (8080)**: Central gateway. Handles Auth (JWT) and routing.
- **ml-service (5000)**: Python Flask API that predicts user preference.
- **homme-service (8081)**: Catalog for Men's products.
- **femme-service (8082)**: Catalog for Women's products.
- **Frontend (3000)**: React SPA.
- **Databases**: 3 independent MySQL instances for isolation.

## Prerequisites
- Docker and Docker Compose
- Node.js (optional, for local frontend dev)
- Java 17 (optional, for local backend dev)

## Installation & Running

1. Clone or extract the project files.
2. Ensure you are in the root directory.
3. Run the entire stack:
    `docker-compose up --build`

Wait for all services to be "Healthy" (especially MySQL).

## Usage

1. Open your browser at `http://localhost:3000`.
2. **First Step: Create a User**. Since the DB starts empty, you need to register a user.
   You can use Postman or Curl to register:
    `curl -X POST http://localhost:8080/api/auth/register -H "Content-Type: application/json" -d '{"username":"john", "password":"password123", "email":"john@test.com"}'`
3. **Login** on the website with `john` / `password123`.
4. The system will automatically:
   - Call the `index-service`.
   - The `index-service` calls the `ml-service`.
   - The `ml-service` predicts which catalog to show.
   - The `index-service` fetches data from the recommended service (`homme` or `femme`).
   - The Frontend displays the products.

## Project logic
- If User ID is Even: ML service tends to recommend "HOMME".
- If User ID is Odd: ML service tends to recommend "FEMME".
- Both product services auto-seed their databases on the first run with high-quality Unsplash image URLs.

## Troubleshooting
- **Database Connection Error**: On first launch, the Java apps might start faster than MySQL. The `healthcheck` in docker-compose handles this, but if it fails, just run `docker-compose restart index-service homme-service femme-service`.
- **Port Conflict**: Ensure ports 3000, 5000, 8080, 8081, 8082 are free on your host.
