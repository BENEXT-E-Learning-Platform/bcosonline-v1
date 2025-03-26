import AdmZip from 'adm-zip'

const extractZip = async (zipPath: string, extractDir: string): Promise<void> => {
  const zip = new AdmZip(zipPath)
  // Use extractAllToAsync with native Promise support (no promisify needed)
  await zip.extractAllToAsync(extractDir, true) // overwrite = true
}

export { extractZip }
