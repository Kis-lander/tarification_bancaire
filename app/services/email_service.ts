import env from '#start/env'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

export default class EmailService {
  private mailer = env.get('MAIL_MAILER')
  private apiKey = env.get('RESEND_API_KEY')
  private fromAddress = env.get('MAIL_FROM_ADDRESS')
  private fromName = env.get('MAIL_FROM_NAME', 'Tarification Bancaire')
  private smtpHost = env.get('SMTP_HOST')
  private smtpPort = env.get('SMTP_PORT')
  private smtpUsername = env.get('SMTP_USERNAME')
  private smtpPassword = env.get('SMTP_PASSWORD')

  private get from() {
    if (!this.fromAddress) {
      return null
    }

    return `${this.fromName} <${this.fromAddress}>`
  }

  private escapePowerShell(value: string) {
    return value.replace(/'/g, "''")
  }

  private async sendWithSmtp(to: string, subject: string, html: string) {
    if (
      !this.smtpHost ||
      !this.smtpPort ||
      !this.smtpUsername ||
      !this.smtpPassword ||
      !this.fromAddress
    ) {
      throw new Error('Configuration SMTP incomplete')
    }

    const command = `
      $securePassword = ConvertTo-SecureString '${this.escapePowerShell(this.smtpPassword)}' -AsPlainText -Force
      $credential = New-Object System.Management.Automation.PSCredential ('${this.escapePowerShell(this.smtpUsername)}', $securePassword)
      Send-MailMessage -From '${this.escapePowerShell(this.from!)}' -To '${this.escapePowerShell(to)}' -Subject '${this.escapePowerShell(subject)}' -BodyAsHtml -Body '${this.escapePowerShell(html)}' -SmtpServer '${this.escapePowerShell(this.smtpHost)}' -Port ${this.smtpPort} -UseSsl -Credential $credential
    `

    const encodedCommand = Buffer.from(command, 'utf16le').toString('base64')
    await execFileAsync('powershell.exe', ['-NoProfile', '-EncodedCommand', encodedCommand])
  }

  private async sendEmail(to: string, subject: string, html: string, text: string) {
    if (this.mailer === 'smtp') {
      await this.sendWithSmtp(to, subject, html)
      return
    }

    if (!this.apiKey || !this.from) {
      console.info(`[MAIL-DEV] To: ${to} | Subject: ${subject} | Text: ${text}`)
      return
    }

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: this.from,
        to: [to],
        subject,
        html,
        text,
      }),
    })
  }

  async sendBankSignupOtp(to: string, otp: string) {
    const subject = 'Votre code OTP de verification'
    const text = `Votre code OTP est ${otp}. Il expire dans 10 minutes.`
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2>Verification de votre demande BANK</h2>
        <p>Voici votre code OTP a 6 chiffres :</p>
        <p style="font-size: 28px; font-weight: 700; letter-spacing: 0.3em;">${otp}</p>
        <p>Ce code expire dans 10 minutes.</p>
      </div>
    `

    await this.sendEmail(to, subject, html, text)
  }

  async sendBankApprovalDecision(to: string, bankName: string, approved: boolean) {
    const decision = approved ? 'validee' : 'invalidee'
    const subject = approved ? 'Votre banque a ete validee' : 'Votre banque n a pas ete validee'
    const text = approved
      ? `Votre banque ${bankName} a ete validee par la BCC. Vous pouvez maintenant vous connecter.`
      : `Votre banque ${bankName} n a pas ete validee par la BCC.`
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2>Decision de la BCC</h2>
        <p>Votre demande pour la banque <strong>${bankName}</strong> a ete <strong>${decision}</strong>.</p>
        ${
          approved
            ? '<p>Vous pouvez maintenant vous connecter a votre espace BANK.</p>'
            : '<p>Veuillez contacter la BCC pour plus d informations si necessaire.</p>'
        }
      </div>
    `

    await this.sendEmail(to, subject, html, text)
  }

  async sendTariffReviewDecision(
    to: string,
    bankName: string,
    serviceName: string,
    amount: string,
    currency: string,
    approved: boolean,
    rejectionReason?: string | null
  ) {
    const subject = approved
      ? 'Votre tarif a ete approuve par la BCC'
      : 'Votre tarif a ete rejete par la BCC'
    const text = approved
      ? `La BCC a approuve le tarif ${serviceName} de ${bankName} pour ${amount} ${currency}.`
      : `La BCC a rejete le tarif ${serviceName} de ${bankName} pour ${amount} ${currency}. Motif: ${rejectionReason || 'Tarif rejete par la BCC.'}`
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2>Decision sur votre tarif bancaire</h2>
        <p>
          La BCC a <strong>${approved ? 'approuve' : 'rejete'}</strong> le tarif soumis pour
          <strong>${serviceName}</strong> par la banque <strong>${bankName}</strong>.
        </p>
        <p>
          Montant soumis : <strong>${amount} ${currency}</strong>
        </p>
        ${
          approved
            ? '<p>Votre tarif peut maintenant etre considere comme valide dans le portail.</p>'
            : `<p>Motif communique par la BCC : <strong>${rejectionReason || 'Tarif rejete par la BCC.'}</strong></p>`
        }
      </div>
    `

    await this.sendEmail(to, subject, html, text)
  }
}
