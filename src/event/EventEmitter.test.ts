import EventEmitter from './EventEmitter';
let emitter: EventEmitter;

beforeEach(() => {
  emitter = new EventEmitter();
});

test('Adding and removing listeners', () => {
  let addEmits = 0;
  let removeEmits = 0;
  const testFunc = () => {};
  
  emitter.addListener(EventEmitter.NEW_LISTENER_EVENT, () => addEmits++);
  emitter.addListener(EventEmitter.REMOVE_LISTENER_EVENT, () => removeEmits++);
  
  emitter.addListener('test', testFunc);
  emitter.addListener('test', testFunc);
  emitter.addListener('test', testFunc);
  emitter.addListener('test', testFunc);
  emitter.addListener('test', testFunc);

  expect(addEmits).toBe(6);
  expect(removeEmits).toBe(0);
  expect(emitter.listenerCount('test')).toBe(5);
  
  emitter.removeListener('test', testFunc);
  emitter.removeListener('test', testFunc);
  emitter.removeListener('test', testFunc);
  emitter.removeListener('test', testFunc);
  emitter.removeListener('test', testFunc);
  
  expect(addEmits).toBe(6);
  expect(removeEmits).toBe(5);
  expect(emitter.listenerCount('test')).toBe(0);
});
