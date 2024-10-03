import path from 'path'
import fs from 'fs'
import { defineConfig } from "vite"

function ietfImagesDiff(html: string, buildDir: string) {
    const includeRegex =
      /<ietf-images-diff>(.*?)<\/ietf-images-diff>/g

    const lostPixelDir = path.resolve(buildDir, '..', '.lostpixel')
    const baselineDir = path.join(lostPixelDir, 'baseline')
    const currentDir = path.join(lostPixelDir, 'current')
    const differenceDir = path.join(lostPixelDir, 'difference')

    function dataUrl(buffer: Buffer): string {
        const mime = 'image/png'
        const encoding = 'base64'
        return `data:${mime};${encoding},${buffer.toString('base64')}`
    }

    return html.replace(includeRegex, () => {
        const dataUrls: Record<string, string> = {}
        const differences = fs.readdirSync(differenceDir)
        differences.forEach(difference => {
            dataUrls[`baseline/${difference}`] = dataUrl(fs.readFileSync(path.join(baselineDir, difference)))
            dataUrls[`current/${difference}`] = dataUrl(fs.readFileSync(path.join(currentDir, difference)))
            dataUrls[`difference/${difference}`] = dataUrl(fs.readFileSync(path.join(differenceDir, difference)))
        })
        return `<script id="ietf-images-diff" type="application/json">${JSON.stringify({ differences, dataUrls })}</script>`
    })
  }

function ietfImagesDiffPlugin() {
    return {
      name: "ietf-images-diff",
      transformIndexHtml(html: string, { filename }: { filename: string }) {
        return ietfImagesDiff(html, path.dirname(filename))
      },
    }
  }

export default defineConfig({
    plugins: [ietfImagesDiffPlugin()],
})
