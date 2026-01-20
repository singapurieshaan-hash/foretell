# Deployment Guide

## Vercel Deployment (Recommended)

### Prerequisites
- Vercel account (free at https://vercel.com)
- Git repository (already configured)

### Option 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy from project root
cd /workspaces/foretell
vercel

# Follow the prompts:
# - Link to existing project: No
# - Project name: foretell
# - Framework preset: Next.js
# - Root directory: ./
# - Build command: npm run build
# - Install command: npm install
# - Output directory: .next
```

### Option 2: Deploy via GitHub

1. Push code to GitHub:
```bash
git add .
git commit -m "Initial Foretell deployment"
git push origin main
```

2. Go to https://vercel.com/import
3. Import your GitHub repository
4. Vercel will auto-detect Next.js and configure build settings
5. Click "Deploy"

## Docker Deployment

### Build Docker Image

```bash
docker build -t foretell:latest .
```

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production

# Start application
CMD ["npm", "start"]
```

### Run Container

```bash
docker run -p 3000:3000 foretell:latest
```

## Railway Deployment

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Connect your GitHub account and select foretell repo
5. Railway will auto-detect and deploy

## Netlify Deployment (Alternative)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy to Netlify
netlify deploy --build --prod
```

## Traditional VPS/Server Deployment

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- PM2 for process management (optional)

### Deployment Steps

```bash
# Connect to your server
ssh user@your-server.com

# Clone repository
git clone <your-repo-url> foretell
cd foretell

# Install dependencies
npm install --production

# Build application
npm run build

# Start with PM2
npm install -g pm2
pm2 start npm --name "foretell" -- start
pm2 save
pm2 startup

# Or start directly
npm start
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Environment Variables

Currently, Foretell has no required environment variables. All data is mocked locally.

### Optional Future Variables (for extensions):
```
NEXT_PUBLIC_API_URL=
DATABASE_URL=
BLOCKCHAIN_RPC_URL=
```

## Performance Optimization

### Build Output
```
Route (app)
┌ ○ /
├ ○ /_not-found
└ ƒ /markets/[id]

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

### Production Build Size
- Total bundle: ~500KB (gzipped ~150KB)
- CSS: Optimized with Tailwind PurgeCSS
- JavaScript: Tree-shaken with Turbopack

## Monitoring & Logging

### Vercel Dashboard
- Real-time build logs
- Deployment history
- Edge Function analytics
- Error tracking

### Docker Container Logs
```bash
docker logs -f foretell
```

### PM2 Logs
```bash
pm2 logs foretell
```

## Troubleshooting

### Build Fails
- Clear `.next` folder: `rm -rf .next`
- Reinstall: `npm ci`
- Rebuild: `npm run build`

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

## Maintenance

### Updating Dependencies
```bash
npm update
npm audit fix
npm run build
```

### Zero-Downtime Deployment
On Vercel or Railway, deployments are automatic and don't cause downtime.

For manual servers with PM2:
```bash
pm2 reload foretell
```

## Rollback

### Vercel
- Go to Deployments tab
- Click "Rollback" on previous deployment

### GitHub
```bash
git revert <commit-hash>
git push origin main
```

---

**Questions?** Check the main README.md for architecture details.
