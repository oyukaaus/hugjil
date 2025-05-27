
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

export const getUserData = async () => {
    try {
      const result = await prisma.user.findMany({
      })
      return result
    } catch (error) {
      console.error('Error getting users:', error)
      throw new Error('An error occurred while fetching users.')
    }
  }

export const getQuestionData = async () => {
    try {
      const result = await prisma.message.findMany({
        where:{role:"user"},
        orderBy: { id: "desc" }, 
      })
      return result
    } catch (error) {
      console.error('Error getting users:', error)
      throw new Error('An error occurred while fetching users.')
    }
  }