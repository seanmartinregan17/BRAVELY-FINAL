#!/bin/bash

echo "🚀 Setting up Bravely App for deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo -e "${RED}Error: frontend and backend directories not found. Please run this script from the project root.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Project structure looks good${NC}"

# Install frontend dependencies
echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
cd frontend
if [ -f "package.json" ]; then
    npm install
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${RED}Error: frontend/package.json not found${NC}"
    exit 1
fi

# Install backend dependencies
echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
cd ../backend
if [ -f "package.json" ]; then
    npm install
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo -e "${RED}Error: backend/package.json not found${NC}"
    exit 1
fi

# Create .env file for backend if it doesn't exist
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}📝 Creating .env file from template...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created. Please update it with your actual values.${NC}"
else
    echo -e "${YELLOW}⚠️  .env file already exists${NC}"
fi

cd ..

echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Update backend/.env with your actual environment variables"
echo "2. Push your code to a GitHub repository"
echo "3. Follow the deployment guide in DEPLOYMENT_GUIDE.md"
echo ""
echo -e "${YELLOW}To test locally:${NC}"
echo "Frontend: cd frontend && npm run dev"
echo "Backend:  cd backend && npm run dev"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"