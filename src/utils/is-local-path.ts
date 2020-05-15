const RE = /^[./]|(^[a-zA-Z]:)/

export const isLocalPath = (v: string) => RE.test(v)

export const removeLocalPathPrefix = (v: string) => v.replace(RE, '')
