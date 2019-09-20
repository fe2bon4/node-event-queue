const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const EventQueueAdapter = require('./event-queue-adapter')
const path = require('path')

class EventQueueFileAdapter extends EventQueueAdapter {
    constructor( metadata, filename = '/tmp/filequeue.json'  ) {
      super( metadata ) 
      const adapter = new FileSync( path.resolve( process.cwd(), filename ) )
      this.file = low( adapter )

      this.file.defaults( {
        data: [],
        metadata: { ...this.metadata }, 
      }).write()

      const currentState = this.file.getState()
      this.file.set('metadata.count', currentState.data.length ).write()
    }
    commit( new_metadata, data ) {
      const current_metadata = this.file.get('metadata').value()
      if( data ) this.file.set('data', data ).write()
      this.file.set('metadata', { ...current_metadata, ...new_metadata }).write()
    }
  
    read() {
      return this.locked 
      ? null
      : this.file.getState()
    }
  }
  
  module.exports = EventQueueFileAdapter