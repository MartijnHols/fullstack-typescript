import React, { ComponentProps } from 'react'

import Button from './Button'

type Props = Omit<ComponentProps<typeof Button>, 'type'>

const Submit = (props: Props) => <Button {...props} type="submit" />

export default Submit
