import BccUser from '#models/bcc_user'
import env from '#start/env'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const email = env.get('BCC_SEED_EMAIL', 'bcc@tarification.cd')
    const password = env.get('BCC_SEED_PASSWORD', 'BccSecure123!')

    await BccUser.updateOrCreate(
      { email },
      {
        email,
        password,
        role: 'BCC',
      }
    )
  }
}
