
const EventEmitter = require('events')
const EventQueueAdapter = require('./event-queue-adapter')
const EventQueueFileAdapter = require('./event-queue-file-adapter')

class EventQueue extends EventEmitter {
  constructor ( name, adapter ) {
    super()
    this.adapter = adapter
    this.adapter.commit( { name } )  
  }

  commitOne ( item ){
    const queue_data = this.adapter.read()
    const { metadata, data } = queue_data 
    let { name, length, count, tag_count } = metadata

    if( count < length ) {
      tag_count = tag_count + 1
      data.push( { ...item, tag: tag_count })
      count = data.length 

      this.adapter.commit( {
        tag_count,
        count 
      }, data )
      this.emit('item_enqueued', item )
    } else {
      // Queue is Full
      throw new Error(`Queue ${name} is full.`)
    }
  } 

  enqueue( commitItems ) {
    const queue_data = this.adapter.read()
    if( !queue_data ) {
      throw new Error(`Queue Adapter returned null/undefined. `)
    } else {
      if( Array.isArray( commitItems ) ){
        commitItems.forEach(  item => { this.commitOne( item ) }  )
      } else{
        this.commitOne( commitItems )
      }
    }
  }

  dequeue() {
    const queue_data = this.adapter.read() 
    let next_tag
    let { data } = queue_data 
    if( data.length > 0 ) {
      const data_tags = data.map( item => item.tag )
      next_tag = Math.min( ...data_tags )
    } else {
      next_tag = -1
    }

    if( next_tag == -1 ) {
      return null
    } else {
      const dequeuedItemIndex = data.find( item => item.tag == next_tag )
      const dequeuedItem = data.splice( dequeuedItemIndex, 1 )[0]
      delete dequeuedItem.tag
      this.adapter.commit({ count: data.length }, data )
      this.emit('item_dequeued', dequeuedItem )
      return dequeuedItem
    }
  }
}


module.exports = {
    EventQueueAdapter,
    EventQueueFileAdapter,
    EventQueue
}