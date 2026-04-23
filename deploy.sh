#!/bin/bash

# 1. Stop the script if any step fails
set -e

echo "🚀 Starting Automated Build Pipeline..."

# 2. Static Analysis Gate
echo "🔍 Running Static Analysis (ESLint)..."
npm run lint

# 3. Unit Test Gate
echo "🧪 Running Unit Tests..."
npm run test

# 4. Build Step
echo "🏗️  Building Code (Transpiling to /dist)..."
npm run build

# 5. Deployment Step
echo "📦 Deploying to Server..."
# (Replace this with your actual move command
mkdir -p ./mock-deployment-server
cp -r ./dist/* ./mock-deployment-server/
echo "Deployment complete."

# 6. Health Check
echo "🩺 Running Health Check..."
# This checks if your server returns a 200 OK
if curl -s --head http://localhost:3000 | grep "200" > /dev/null; then
  echo "Health Check Passed!"
else
  echo " Health Check Failed! Reverting..."
  exit 1
fi