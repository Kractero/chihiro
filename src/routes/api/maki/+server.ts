import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from '../$types'

export const GET: RequestHandler = async ({ url }) => {
  const nation = url.searchParams.get('nation')
  if (!nation) throw error(400, 'Missing nation parameter')

  const res = await fetch(
    `https://maki.kractero.com/api/trades-wrapped?nation=${encodeURIComponent(
      nation
    )}&sincetime=1735689600000&beforetime=1767225599000`
  )
  if (!res.ok) throw new Error('Failed to fetch trades')
  const trades = await res.json()

  return json(trades)
}
