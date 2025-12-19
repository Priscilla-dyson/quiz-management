import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    
    // Test with our known hash
    const hash = '$2b$10$DjAcf5gN1bR6mJF0Fepm9emuKlA//deQiJwveWu1/dtH1T76CgV2G'
    const isValid = await bcrypt.compare(password, hash)
    
    // Also generate a new hash to test
    const newHash = await bcrypt.hash('admin123', 10)
    const newIsValid = await bcrypt.compare('admin123', newHash)
    
    return NextResponse.json({
      originalHash: hash,
      originalMatch: isValid,
      newHash: newHash,
      newMatch: newIsValid,
      testPassword: password
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
