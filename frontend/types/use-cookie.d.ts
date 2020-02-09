declare module '@use-hook/use-cookie' {
  export default function useCookie<Value extends any = any>(
    key: string,
    initialValue: string,
  ): [Value, (value: Value) => void]
}
