import styled from '@emotion/styled'
import React, { forwardRef, InputHTMLAttributes, ReactNode, Ref } from 'react'
import { FieldMetaState } from 'react-final-form'

import * as colors from '../theme/colors'
import FieldError from './FieldError'

const Label = styled.label`
  display: block;
  margin-bottom: 15px;
`

const StyledInput = styled.input`
  display: block;
  width: 100%;
  background: ${colors.background};
  color: ${colors.onBackground};
  border: 1px solid ${colors.grey200};
  border-radius: 3px;
  font-size: 16px;
  padding: 0.4em;
`

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode
  meta: FieldMetaState<string>
}

const Input = (
  { label, type = 'text', meta, ...others }: Props,
  ref: Ref<HTMLInputElement>,
) => (
  <Label>
    {label}: <StyledInput {...others} type={type} ref={ref} />
    {meta.touched && (meta.error || meta.submitError) && (
      <FieldError>{meta.error || meta.submitError}</FieldError>
    )}
  </Label>
)

export default forwardRef(Input)
