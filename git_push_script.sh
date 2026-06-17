#!/bin/bash

# Git Push Script for HKGD Platformer Ranking Updates
# This script will commit and push all the changes made to the platformer ranking system

echo "🚀 Starting git push process..."

# Navigate to the frontend directory and build
cd frontend || { echo "❌ Failed to enter frontend directory"; exit 1; }
echo "📦 Building frontend..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

# Navigate back to root
cd ..

# Add all changes to git
echo "📋 Adding changes to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "feat: Implement platformer manual ranking system

- Added drag-and-drop manual ranking for platformer levels
- Removed Pemonlist ranking system
- Platformer levels now have independent ranking starting from #1
- Updated Hero component to show only platformer level count
- Fixed LevelDetail to show platformer-specific ranks
- Added CSV export script for platformer data
- Improved admin interface with visual ranking controls

Signed-off-by: Mistral Vibe <vibe@mistral.ai>"

# Push changes
echo "🐙 Pushing to remote repository..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed all changes!"
    echo "🎉 Platformer ranking system is now live!"
else
    echo "❌ Failed to push changes"
    exit 1
fi