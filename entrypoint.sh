#!/bin/sh
set -e

echo "🔄 Running Prisma Migrate..."
npx prisma migrate deploy

echo "🌱 Seeding database..."
npx prisma db seed

echo "🚀 Starting the app..."
npm run serve