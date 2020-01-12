import styled from '@emotion/styled'

import * as colors from '../theme/colors'

const Input = styled.input`
  display: block;
  width: 100%;
  background: ${colors.background};
  color: ${colors.onBackground};
  border: 1px solid ${colors.grey200};
  border-radius: 3px;
  font-size: 16px;
  padding: 0.4em;
`

export default Input
