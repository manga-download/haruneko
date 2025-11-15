# Puppeteer Setup for Manga Downloads

This API uses Puppeteer to scrape manga websites. Many manga sources require a browser to handle JavaScript rendering and anti-scraping protection.

## Problem

Downloads fail with errors like:
```
"8: \")\" not found"
```

This happens when Puppeteer cannot find a Chromium/Chrome browser.

## Solution

### Option 1: Install Chromium via npm (Recommended)

```bash
# Install dependencies without skipping Puppeteer downloads
npm install

# Or if already installed, reinstall Puppeteer
npm rebuild puppeteer
```

### Option 2: Use System Chrome/Chromium

If you have Chrome or Chromium installed on your system:

```bash
# Find your Chrome/Chromium path
which google-chrome chromium-browser chromium

# Set the environment variable
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
# or
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome

# Then start the server
npm run dev
```

### Option 3: Install System Chromium

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install chromium-browser
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
```

**CentOS/RHEL:**
```bash
sudo yum install chromium
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
```

**macOS:**
```bash
brew install chromium
export PUPPETEER_EXECUTABLE_PATH=/Applications/Chromium.app/Contents/MacOS/Chromium
```

**Docker:**
```dockerfile
FROM node:20

# Install Chromium
RUN apt-get update && apt-get install -y \
    chromium \
    ca-certificates \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

# Set Puppeteer to use system Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Copy and install app
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Build
RUN npm run build

# Start
CMD ["npm", "run", "start"]
```

## Environment Variables

Add these to your `.env` file:

```env
# Puppeteer configuration
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser  # Path to Chrome/Chromium
PUPPETEER_HEADLESS=true                               # Run in headless mode
PUPPETEER_MAX_BROWSERS=5                              # Maximum concurrent browser instances
PUPPETEER_TIMEOUT=150000                              # Page load timeout (ms)
```

## Verification

To verify Puppeteer is working:

```bash
# Start the server
npm run dev

# Try a download
curl -X 'POST' \
  'http://localhost:3000/api/v1/downloads' \
  -H 'Content-Type: application/json' \
  -d '{
    "sourceId": "mangalover",
    "mangaId": "{\"post\":\"1901\",\"slug\":\"/manga/berserk/\"}",
    "chapterIds": ["/manga/berserk/383/"],
    "format": "cbz"
  }'
```

Check the server logs for:
```
🌐 Launching Puppeteer browser...
✅ Puppeteer browser launched
```

If you see these messages, Puppeteer is working correctly!

## Troubleshooting

### Error: "Failed to launch the browser"
- Make sure Chrome/Chromium is installed
- Check the `PUPPETEER_EXECUTABLE_PATH` points to the correct location
- Try running with `PUPPETEER_HEADLESS=false` to see browser errors

### Error: "No usable sandbox!"
Add this to your Puppeteer args (already included in the code):
```javascript
args: ['--no-sandbox', '--disable-setuid-sandbox']
```

### Memory issues
Reduce `PUPPETEER_MAX_BROWSERS` to 2 or 3:
```env
PUPPETEER_MAX_BROWSERS=2
```
