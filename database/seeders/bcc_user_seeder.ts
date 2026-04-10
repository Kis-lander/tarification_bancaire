import User from '#models/user'
import env from '#start/env'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const email = env.get('BCC_SEED_EMAIL', 'bcc@tarification.cd')
    const password = env.get('BCC_SEED_PASSWORD', 'BccSecure123!')

    await User.updateOrCreate(
      { email },
      {
        email,
        password,
        rule: 'BCC',
      }
    )
  }
}
