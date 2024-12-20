// lib/eventEmitter.ts
import { EventEmitter } from 'events';

// Declare global type
declare global {
  var eventEmitter: EventEmitter | undefined;
}

// Create singleton event emitter
const eventEmitter = global.eventEmitter || new EventEmitter();

// In development, attach to global to prevent multiple instances
if (process.env.NODE_ENV === 'development') {
  global.eventEmitter = eventEmitter;
}

export default eventEmitter;