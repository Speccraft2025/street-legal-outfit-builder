#!/bin/bash
set -e

echo "🚀 Building Street Legal MVP Docker Image..."
gcloud builds submit --tag us-central1-docker.pkg.dev/simua-e911c/street-legal/web-app:latest

echo "🚀 Deploying to Cloud Run..."
gcloud run deploy street-legal-web \
  --image us-central1-docker.pkg.dev/simua-e911c/street-legal/web-app:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

echo "✅ Deployment Complete!"
