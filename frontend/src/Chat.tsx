import { useApolloClient, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import React, { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'

import PageWrapper from './PageWrapper'
import routes from './routes'
import { Message } from './schema.generated'
import { getSessionId } from './sessionId'

const Chat = () => {
  const { push } = useHistory()
  const sessionId = getSessionId()
  if (!sessionId) {
    push(routes.login)
    return null
  }
  /* eslint-disable react-hooks/rules-of-hooks */
  const [messages, setMessages] = useState<
    Array<{
      author: string
      text: string
    }>
  >([])
  const apolloClient = useApolloClient()
  const [sendMessage] = useMutation<
    { error: null },
    { to: string; text: string }
  >(gql`
    mutation($to: String!, $text: String!) {
      sendMessage(to: $to, text: $text) {
        error
      }
    }
  `)

  useEffect(() => {
    apolloClient
      .subscribe<{ message: Message }>({
        query: gql`
          subscription {
            message {
              author
              text
            }
          }
        `,
        variables: {},
      })
      .subscribe({
        next({ data }) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          setMessages(messages => [...messages, data!.message])
        },
      })
  }, [apolloClient, setMessages])

  const input = useRef<HTMLInputElement>(null)

  return (
    <PageWrapper>
      {messages.map((message, index) => (
        <div key={index}>
          {message.author}: {message.text}
        </div>
      ))}
      <input ref={input} />
      <button
        onClick={() => {
          sendMessage({
            variables: {
              to: 'everyone',
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              text: input.current!.value,
            },
          })
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          input.current!.value = ''
        }}
      >
        Send
      </button>
    </PageWrapper>
  )
}

export default Chat
