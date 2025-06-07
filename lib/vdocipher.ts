import { config } from "./config"

export class VdoCipherService {
  private apiSecret: string

  constructor() {
    this.apiSecret = config.VDOCIPHER_API_SECRET
  }

  async getVideoOTP(videoId: string) {
    try {
      const response = await fetch(`https://dev.vdocipher.com/api/videos/${videoId}/otp`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Apisecret ${this.apiSecret}`,
        },
        body: JSON.stringify({
          licenseRules: {
            canPersist: true,
            rentalDuration: 86400,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao obter OTP do VdoCipher")
      }

      return await response.json()
    } catch (error) {
      console.error("Erro VdoCipher:", error)
      throw error
    }
  }

  async uploadVideo(file: File) {
    try {
      // Primeiro, obter URL de upload
      const uploadResponse = await fetch("https://dev.vdocipher.com/api/videos", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Apisecret ${this.apiSecret}`,
        },
        body: JSON.stringify({
          title: file.name,
          folderId: "root",
        }),
      })

      if (!uploadResponse.ok) {
        throw new Error("Erro ao iniciar upload")
      }

      const uploadData = await uploadResponse.json()
      return uploadData
    } catch (error) {
      console.error("Erro no upload:", error)
      throw error
    }
  }
}

export const vdoCipher = new VdoCipherService()
