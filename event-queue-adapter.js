class EventQueueAdapter {
  constructor( metadata ) {
    this.metadata = {
      length: 10,
      count: 0,
      tag_count: 0,
      ...metadata
    }
    this.data = [],
    this.locked = false
  }

  lock() {
    this.locked = true
  }
  
  unlock() {
    this.locked = false
  }

  commit( new_metadata, data ) {
    const current_metadata = Object.assign( {}, this.metadata )
    if( data ) this.data = data

    this.metadata = { 
      ...current_metadata,
      ...new_metadata
    }
    return 
  }

  read() {
    return this.locked 
    ? null
    : {
      metadata: this.metadata,
      data: this.data
    }
  }
}

module.exports = EventQueueAdapter