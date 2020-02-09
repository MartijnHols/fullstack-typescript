import styled from '@emotion/styled'
import React from 'react'
import { Link } from 'react-router-dom'
import routes from './routes'
import * as colors from './theme/colors'

const Container = styled.footer`
  background: ${colors.background};
  color: #fff;
  text-align: center;
  flex-grow: 0;
  border-top: 1px solid ${colors.grey200};
`

const Footer = () => (
  <Container>
    My new app. <Link to={routes.about}>About</Link>
  </Container>
)

export default Footer
