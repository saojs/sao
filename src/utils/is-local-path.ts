const RE = /^[./]|(^[a-zA-Z]:)/

export const isLocalPath = (v: string): boolean => RE.test(v)

export const removeLocalPathPrefix = (v: string): string => v.replace(RE, '')
