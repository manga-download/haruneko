# HakuNeko Manga Downloader API

A production-grade REST API for downloading manga from 788+ sources with built-in Cloudflare bypass capabilities.

## 🚀 Features

- **788+ Manga Sources**: Support for hundreds of manga websites
- **Cloudflare Bypass**: Automatic Cloudflare challenge solving using Puppeteer
- **Multiple Export Formats**: CBZ, PDF, EPUB, and raw images
- **REST API**: Well-documented RESTful API with OpenAPI/Swagger
- **Rate Limiting**: Built-in concurrency control and rate limiting
- **Download Management**: Queue, track, and manage manga downloads
- **Production Ready**: Comprehensive logging, error handling, and security

## 📋 Requirements

- **Node.js**: >= 22.13.0
- **npm**: >= 10.9.2
- **System**: Linux, macOS, or Windows
- **Memory**: Recommended 2GB+ RAM (Puppeteer runs headless browsers)

## 🔧 Installation

### Quick Start with Docker (Recommended)

The easiest way to run the API with all dependencies (including Chromium):

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# API available at http://localhost:3000
```

See [DOCKER_SETUP.md](./DOCKER_SETUP.md) for complete Docker documentation.

### Manual Installation

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd haruneko
```

#### 2. Install Dependencies

```bash
npm install
```

**Important:** Manga downloads require Chromium/Chrome for Puppeteer. See [PUPPETEER_SETUP.md](./PUPPETEER_SETUP.md) if downloads fail.

#### 3. Configure Environment

Copy the example environment file and customize:

```bash
cp .env.example .env
```

Edit `.env` with your preferred settings:

```env
# Server Configuration
PORT=3000
HOST=0.0.0.0
NODE_ENV=development

# Storage Paths
STORAGE_PATH=./storage

# Puppeteer Configuration
PUPPETEER_HEADLESS=true
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium  # Or your Chrome path
PUPPETEER_MAX_BROWSERS=5

# Download Configuration
MAX_CONCURRENT_DOWNLOADS=3
DEFAULT_FORMAT=cbz
DOWNLOAD_RETENTION_DAYS=7

# Logging
LOG_LEVEL=info
```

#### 4. Build the Project

```bash
npm run build
```

#### 5. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

## 📚 API Documentation

Once the server is running, access the interactive Swagger documentation at:

```
http://localhost:3000/api-docs
```

### Quick API Overview

#### Get All Sources
```bash
GET /api/v1/sources?page=1&limit=20
```

#### Search Manga
```bash
GET /api/v1/sources/{sourceId}/search?q=naruto&page=1&limit=20
```

#### Get Manga Chapters
```bash
GET /api/v1/sources/{sourceId}/manga/{mangaId}/chapters
```

#### Download Chapters
```bash
POST /api/v1/downloads
Content-Type: application/json

{
  "sourceId": "mangadex",
  "mangaId": "manga-id-here",
  "chapterIds": ["chapter-1-id", "chapter-2-id"],
  "format": "cbz",
  "options": {
    "quality": "high",
    "includeMetadata": true
  }
}
```

#### Check Download Status
```bash
GET /api/v1/downloads/{downloadId}
```

#### Download Completed File
```bash
GET /api/v1/downloads/{downloadId}/file
```

## 🔐 Cloudflare Handling

This API automatically handles Cloudflare challenges using Puppeteer:

- **Automatic Mode**: Most Cloudflare challenges are solved automatically
- **Headless Mode**: Runs in headless mode by default for efficiency
- **Interactive Mode**: For captchas, set `PUPPETEER_HEADLESS=false` to show browser window

### Cloudflare Best Practices

1. **Rate Limiting**: Respect rate limits to avoid triggering Cloudflare
2. **Browser Pool**: Configure `PUPPETEER_MAX_BROWSERS` based on your system resources
3. **Timeout**: Adjust `PUPPETEER_TIMEOUT` if sites are slow to load

## 📁 Project Structure

```
haruneko-api/
├── src/
│   ├── api/                          # REST API layer
│   │   ├── routes/                   # API routes
│   │   ├── controllers/              # Request handlers
│   │   ├── middleware/               # Express middleware
│   │   ├── services/                 # Business logic
│   │   └── types/                    # TypeScript types
│   ├── engine/                       # HakuNeko core engine
│   │   ├── websites/                 # 788 manga source scrapers
│   │   ├── providers/                # Base scraper classes
│   │   ├── exporters/                # Export format handlers
│   │   ├── platform/                 # Platform abstraction (Puppeteer)
│   │   └── ...
│   ├── config/                       # Configuration
│   └── index.ts                      # Application entry point
├── storage/                          # Runtime data
│   ├── downloads/                    # Downloaded files
│   ├── temp/                         # Temporary files
│   ├── database/                     # Persistent storage
│   └── cache/                        # Cache data
├── logs/                             # Application logs
├── openapi.yaml                      # API documentation
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Development

### Available Scripts

```bash
# Development with auto-reload
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Run tests
npm test

# Update website index
npm run update-website-index
```

### Adding New Manga Sources

The engine supports 788+ sources out of the box. Sources are located in:

```
src/engine/websites/
```

Each source is a TypeScript file implementing the `MangaScraper` interface.

## 🐳 Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:22-alpine

WORKDIR /app

# Install Puppeteer dependencies
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Set Puppeteer to use installed Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_DOWNLOAD=true

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t hakuneko-api .
docker run -p 3000:3000 -v $(pwd)/storage:/app/storage hakuneko-api
```

## 🔒 Security

### API Key Authentication (Optional)

Enable API key authentication:

```env
REQUIRE_API_KEY=true
API_KEY=your-secret-api-key-here
```

### Best Practices

- Use HTTPS in production (configure reverse proxy like nginx)
- Set appropriate `CORS_ORIGIN` to restrict access
- Configure `RATE_LIMIT_MAX` based on your needs
- Regularly update dependencies
- Monitor logs for suspicious activity

## 📊 Monitoring

### Logs

Logs are stored in the `logs/` directory:

- `combined.log`: All logs
- `error.log`: Error logs only

### Health Check

```bash
GET /health
```

Returns server health, uptime, and version information.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linter
5. Submit a pull request

## 📝 License

This project is licensed under the [Unlicense](https://unlicense.org/).

## 🙏 Credits

This API is built on top of the HakuNeko project, which provides the core manga scraping engine.

## 📞 Support

For issues and questions:

1. Check the [API Documentation](http://localhost:3000/api-docs)
2. Review the logs in `logs/` directory
3. Open an issue on GitHub

## 🎯 Roadmap

- [ ] WebSocket support for real-time download progress
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication and multi-user support
- [ ] Download queue priority management
- [ ] Batch download operations
- [ ] Docker Compose setup with database
- [ ] Kubernetes deployment manifests
- [ ] Grafana/Prometheus monitoring
- [ ] Advanced caching strategies
- [ ] CDN integration for file delivery

## ⚡ Performance Tips

1. **Concurrent Downloads**: Adjust `MAX_CONCURRENT_DOWNLOADS` based on your bandwidth
2. **Browser Pool**: Set `PUPPETEER_MAX_BROWSERS` to 3-5 for optimal performance
3. **Storage**: Use SSD storage for better I/O performance
4. **Memory**: Allocate at least 2GB RAM, more for heavy usage
5. **Network**: Stable internet connection recommended for Cloudflare challenges

## 🔍 Troubleshooting

### Puppeteer Fails to Launch

```bash
# Install dependencies (Ubuntu/Debian)
sudo apt-get install -y \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libgdk-pixbuf2.0-0 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils
```

### Cloudflare Still Blocking

1. Increase `PUPPETEER_TIMEOUT`
2. Set `PUPPETEER_HEADLESS=false` for interactive challenges
3. Reduce concurrent requests to avoid rate limiting

### Download Fails

1. Check source is still active: `GET /api/v1/sources/{sourceId}`
2. Verify chapter IDs are correct
3. Check logs for detailed error messages
4. Ensure sufficient disk space in `storage/` directory

---

**Built with ❤️ for manga enthusiasts worldwide**
