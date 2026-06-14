import path from "path";
import { fileURLToPath } from "url";

const __dirname= path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.resolve(__dirname, "../../../uploads");


export const getFfmpegCommand = (videoId: string) => {
  const input  = path.join(UPLOADS_DIR, videoId);
  const outDir = path.join(UPLOADS_DIR, videoId + "_hls");

 return `mkdir -p ${outDir} && ffmpeg -i ${input} \
    -filter_complex "[0:v]split=3[v360][v720][v1080]; \
      [v360]scale=-2:360[out360]; \
      [v720]scale=-2:720[out720]; \
      [v1080]scale=-2:1080[out1080]" \
    -map "[out360]" -map 0:a? -c:v libx264 -preset fast -crf 28 -c:a aac \
      -hls_time 6 -hls_playlist_type vod -hls_segment_filename "${outDir}/360p_%03d.ts" "${outDir}/360p.m3u8" \
    -map "[out720]" -map 0:a? -c:v libx264 -preset fast -crf 23 -c:a aac \
      -hls_time 6 -hls_playlist_type vod -hls_segment_filename "${outDir}/720p_%03d.ts" "${outDir}/720p.m3u8" \
    -map "[out1080]" -map 0:a? -c:v libx264 -preset fast -crf 20 -c:a aac \
      -hls_time 6 -hls_playlist_type vod -hls_segment_filename "${outDir}/1080p_%03d.ts" "${outDir}/1080p.m3u8"`;
}

export const getMasterPlaylist = (videoId: string) => {
  //HLS(Http Live Streaming)
  //These formats are reliable for video playing.
  return `#EXTM3U
    #EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360
    360p.m3u8
    #EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720
    720p.m3u8
    #EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080
    1080p.m3u8`;
}