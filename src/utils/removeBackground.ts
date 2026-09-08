/**
 * Client-side automatic background removal utility using HTML5 Canvas.
 * Samples corner pixels to detect solid/light background and feathers alpha channel.
 */
export function removeImageBackground(dataUrl: string, threshold = 45): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(dataUrl)
        return
      }

      canvas.width = img.naturalWidth || img.width
      canvas.height = img.naturalHeight || img.height

      ctx.drawImage(img, 0, 0)
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imgData.data

      // Sample corners to find background color
      const corners = [
        [0, 0],
        [(canvas.width - 1) * 4, 0],
        [0, (canvas.height - 1) * 4 * canvas.width],
        [(canvas.width - 1) * 4 + (canvas.height - 1) * 4 * canvas.width],
      ]

      let totalR = 0, totalG = 0, totalB = 0
      corners.forEach(([idx]) => {
        totalR += data[idx]
        totalG += data[idx + 1]
        totalB += data[idx + 2]
      })

      const bgR = Math.round(totalR / 4)
      const bgG = Math.round(totalG / 4)
      const bgB = Math.round(totalB / 4)

      // Feathering tolerance range
      const lowerThreshold = threshold
      const upperThreshold = threshold + 30

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]

        // Euclidean distance to sampled background color
        const dist = Math.sqrt(
          Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2)
        )

        if (dist < lowerThreshold) {
          data[i + 3] = 0 // Fully transparent
        } else if (dist < upperThreshold) {
          // Feather alpha edge smoothly
          const alphaFactor = (dist - lowerThreshold) / (upperThreshold - lowerThreshold)
          data[i + 3] = Math.floor(data[i + 3] * alphaFactor)
        }
      }

      ctx.putImageData(imgData, 0, 0)
      resolve(canvas.toDataURL('image/png'))
    }

    img.onerror = (err) => reject(err)
    img.src = dataUrl
  })
}
