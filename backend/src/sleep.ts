const sleep = (duration = 0) =>
  new Promise(resolve => setTimeout(resolve, duration))

export default sleep
