import queue from "@repo/queue";
import { getFfmpegCommand, getMasterPlaylist } from "./utils.js";
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from "url";
import { writeFileSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.resolve(__dirname, "../../../uploads");

queue.work('video', async(job) => {
  const videoId = job.data.id;
  if(!videoId) return;

  const command = getFfmpegCommand(videoId);

  const cmd = exec(command);

  if(!cmd.stdout || !cmd.stderr) return   

  cmd.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  cmd.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  cmd.on('close', (code) => {
    console.log(`child process exited with code ${code}`)
    if(code === 0 ){
      const outDir = path.join(UPLOADS_DIR, videoId + "_hls");
      writeFileSync(
        path.join(outDir, "master.m3u8"),
        getMasterPlaylist(videoId),
      );
      console.log(`HLS ouput ready at ${outDir}/master.m3u8`)
    }
  });
});

console.log('Worker started')