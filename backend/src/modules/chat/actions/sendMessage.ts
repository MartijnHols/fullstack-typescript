import pubSub from '~/pubSub'

export const MESSAGE = 'MESSAGE'
const sendMessage = async (author: string, to: string, text: string) => {
  const message = { author, to, text }
  // TODO: Figure out what makes sense for triggerNames
  await pubSub.publish(MESSAGE, { message })
}

export default sendMessage
