export const CONTACT_LIMITS = Object.freeze({ name: 100, email: 254, message: 5000, body: 16000 })

export function validateContact(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input))
    return { error: 'Enter your name, email, and message.' }
  const values = {}
  for (const field of ['name', 'email', 'message']) {
    if (typeof input[field] !== 'string') return { error: `Enter a valid ${field}.`, field }
    values[field] = input[field].trim()
    if (values[field].length > CONTACT_LIMITS[field])
      return { error: `${field} is too long.`, field }
  }
  if (values.name.length < 2 || /[\r\n\x00-\x1f\x7f]/.test(values.name))
    return { error: 'Enter a name between 2 and 100 characters.', field: 'name' }
  if (
    !/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/.test(
      values.email,
    ) ||
    values.email.startsWith('.') ||
    values.email.includes('..') ||
    values.email.split('@')[0].endsWith('.') ||
    values.email.split('@')[0].length > 64 ||
    values.email
      .split('@')
      .at(-1)
      .split('.')
      .some((label) => label.length > 63)
  )
    return { error: 'Enter one valid email address.', field: 'email' }
  if (values.message.length < 10 || /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(values.message))
    return { error: 'Enter a message between 10 and 5,000 characters.', field: 'message' }
  return { values }
}
