import { Request, Response } from 'express'
import prisma from '../../prisma/client'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

// Send OTP to user's phone
export const sendOTP = async (req: Request, res: Response) => {
  const { phone } = req.body
  try {
    // Generate a random 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString()

    // Set expiration time (5 minutes from now)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

    // Store OTP in the database (or cache)

    const responseTeleco = await fetch(
      `https://sms-api.telcocom.mn/sms-api/v1/sms/telco/send?tenantId=637ca1f1e6223943ac10384e&toNumber=${phone}&sms=${otp}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'telco-auth-token': `${process.env.telco_auth_token}`
        }
      }
    )
    console.log("responseTeleco: ", responseTeleco)
    if (responseTeleco) {
      await prisma.oTP.upsert({
        where: { phone },
        update: { otp, expiresAt },
        create: { phone, otp, expiresAt }
      })
    }
    return res.status(200).json({ message: 'OTP sent successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error sending OTP' })
  }
}

// Verify OTP and log in the user or register if necessary
export const verifyOTP = async (req: Request, res: Response) => {
  const { phone, otp } = req.body

  try {
    // Fetch OTP from the database
    const otpRecord = await prisma.oTP.findUnique({
      where: { phone }
    })

    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' })
    }

    // Check if OTP has expired
    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP has expired' })
    }

    // Optionally, create or update user in the database
    let user = await prisma.user.findUnique({
      where: { phone }
    })

    if (!user) {
      // Create new user if not found
      user = await prisma.user.create({
        data: { phone } // You can add more fields like username if needed
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, phone: user.phone },
      process.env.JWT_SECRET!, // Make sure to set JWT_SECRET in your environment
      { expiresIn: '1h' }
    )

    return res.status(200).json({ message: 'Login successful', token })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error verifying OTP' })
  }
}
