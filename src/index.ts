export { Dispatcher } from './dispatcher'
export { pmapWorker } from './worker'
export { pmapPlain, pmapWithDispatcher } from './pmap'

// pmap default
import { pmapWithDispatcher } from './pmap'
export const pmap = pmapWithDispatcher
export default pmap
