export default function debug() {
  const log = console.log

  console.log = function debugLog(...args) {
    log.apply(
      console,
      args.map(item => {
        if (typeof item !== 'object') {
          return item
        }

        try {
          return JSON.stringify(item, null, 2)
        } catch (err) {
          return item
        }
      })
    )
  }
}
