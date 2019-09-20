const {
  EventQueue,
  EventQueueFileAdapter,
  EventQueueAdapter
} = require('./event-queue')

module.exports = {
  Adapters: {
    EventQueueFileAdapter,
    EventQueueAdapter
  },
  EventQueue
}
