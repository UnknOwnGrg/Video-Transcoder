# Video Transcoder
 
A self-hosted HLS video transcoding pipeline built with TypeScript, BullMQ, Redis, and FFmpeg — packaged as a Turborepo monorepo.
 
Upload a video, get back adaptive-bitrate HLS streams at **360p, 720p, and 1080p** — ready to serve directly to a video player.
 
---
 
## Architecture
 
```
Client (Upload)
     │
     ▼
Express API (apps/api)
     │  adds job to queue
     ▼
BullMQ Queue ──── Redis
     │
     ▼
Worker (apps/worker)
     │  runs FFmpeg
     ▼
HLS Output (.m3u8 + .ts segments)
```
 
### Monorepo Structure
 
```
video-transcoder/
├── apps/
│   ├── api/          # Express upload server
│   └── worker/       # BullMQ worker + FFmpeg processor
├── packages/
│   └── queue/        # Shared BullMQ queue config
├── uploads/          # Raw uploaded files
├── turbo.json
└── pnpm-workspace.yaml
```
 
---
 
## Tech Stack
 
| Layer | Technology |
|-------|-----------|
| Monorepo | Turborepo + pnpm workspaces |
| Language | TypeScript (ESM) |
| API | Express |
| Queue | BullMQ |
| Cache/Broker | Redis (via IORedis) |
| Transcoding | FFmpeg |
| Streaming Format | HLS (HTTP Live Streaming) |
 
---
 
## How It Works
 
1. User uploads a video file via `POST /upload`
2. The API saves the file and pushes a job to the BullMQ queue
3. The worker picks up the job and runs an FFmpeg command
4. FFmpeg splits the video in a **single pass** using `filter_complex` into 3 quality levels
5. Output is a set of `.ts` segment files and `.m3u8` playlists per quality
6. A `master.m3u8` is generated to tie all streams together for adaptive playback
### HLS Output Structure
 
```
uploads/<videoId>_hls/
├── 360p.m3u8
├── 360p_000.ts
├── 360p_001.ts
├── 720p.m3u8
├── 720p_000.ts
├── 720p_001.ts
├── 1080p.m3u8
├── 1080p_000.ts
├── 1080p_001.ts
└── master.m3u8       ← serve this to the player
```
 
---
 
## Getting Started
 
### Prerequisites
 
- Node.js 18+
- pnpm
- Docker (for Redis)
- FFmpeg
```bash
sudo apt install ffmpeg
```
 
### Install Dependencies
 
```bash
pnpm install
```
 
### Start Redis
 
```bash
docker run -d -p 6379:6379 redis
```
 
### Run in Development
 
```bash
# Start all apps (api + worker) via Turborepo
pnpm dev
 
# Or run individually
pnpm --filter @repo/api dev
pnpm --filter @repo/worker dev
```
 
### Upload a Video
 
```bash
curl -X POST http://localhost:3000/upload \
  -F "video=@/path/to/your/video.mp4"
```
 
---
 
## Roadmap
 
- [x] File upload API
- [x] BullMQ job queue with Redis
- [x] FFmpeg multi-quality HLS transcoding (360p / 720p / 1080p)
- [x] Master HLS playlist generation
- [ ] Frontend video player with adaptive quality switching
- [ ] Timestamp-based thumbnail preview generation
- [ ] Job progress tracking via WebSockets
- [ ] Docker Compose setup for full local stack
---
 
## Contributing
 
Pull requests are welcome. For major changes, open an issue first.
 
---
 
## License
 
MIT
 