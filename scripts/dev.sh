#!/usr/bin/env bash

# Start Docker containers in the background
echo "🐳 Starting Postgres and Mailpit Docker containers..."
docker compose up -d
echo "📧 Mailpit Web UI is available at: http://localhost:8025"
echo "🗄️  Postgres Database is running on localhost:5433"

# Define a cleanup function to gracefully shut down Docker when Next.js stops
cleanup() {
  echo ""
  echo "🛑 Shutting down Next.js and Docker containers..."
  docker compose down
  exit 0
}

# Trap the SIGINT (Ctrl+C) and EXIT signals to trigger the cleanup
trap cleanup EXIT INT

# Start the Next.js development server
echo "🚀 Starting Next.js..."
npx next dev
