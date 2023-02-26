export type EventEmitterListener = (...arg: any[]) => void;
export type EventEmitterListenerArgs = any[];

class EventEmitter {
  public static readonly NEW_LISTENER_EVENT: string = 'newListener';
  public static readonly REMOVE_LISTENER_EVENT: string = 'removeListener';

  private readonly _listeners: Map<string, EventEmitterListener[]> = new Map<string, EventEmitterListener[]>();
  private _maxListeners: number = 10;

  public constructor() {
    this._listeners.set(EventEmitter.NEW_LISTENER_EVENT, []);
    this._listeners.set(EventEmitter.REMOVE_LISTENER_EVENT, []);
  }

  public emit(eventName: string, ...args: EventEmitterListenerArgs): boolean {
    const listeners: EventEmitterListener[] | undefined = this._listeners.get(eventName);
    
    if (listeners == null || listeners.length === 0) return false;

    listeners.forEach((listener: EventEmitterListener) => listener(...args));

    return true;
  }

  public once(eventName: string, listener: EventEmitterListener): EventEmitter {
    return this._once(eventName, listener);
  }

  public prependOnce(eventName: string, listener: EventEmitterListener): EventEmitter {
    return this._once(eventName, listener, true);
  }

  public _once(eventName: string, listener: EventEmitterListener, prepend: boolean = false): EventEmitter {
    const onceListener = (...args: EventEmitterListenerArgs): void => {
      this.off(eventName, onceListener);
      listener(...args);
    };

    this._on(eventName, onceListener, prepend);

    return this;
  }

  public addListener(eventName: string, listener: EventEmitterListener): EventEmitter {
    return this._on(eventName, listener);
  }

  public prependListener(eventName: string, listener: EventEmitterListener): EventEmitter {
    return this._on(eventName, listener, true);
  }

  public on(eventName: string, listener: EventEmitterListener): EventEmitter {
    return this._on(eventName, listener);
  }
  
  private _on(eventName: string, listener: EventEmitterListener, prepend: boolean = false): EventEmitter {
    const listeners: EventEmitterListener[] | undefined = this._listeners.get(eventName);

    this.emit(EventEmitter.NEW_LISTENER_EVENT, eventName, listener);

    if (listeners == null) this._listeners.set(eventName, [listener]);
    else if (listener.length >= this._maxListeners) this._throwLimitException();
    else (prepend ? listeners.unshift(listener) : listeners.push(listener));

    return this;
  }

  public removeAllListeners(eventName?: string): EventEmitter {
    if (eventName == null) this._listeners.clear();
    else this._listeners.delete(eventName);

    return this;
  }

  public removeListener(eventName: string, listener: EventEmitterListener): EventEmitter {
    return this.off(eventName, listener);
  }

  public off(eventName: string, listener: EventEmitterListener): EventEmitter {
    const listeners: EventEmitterListener[] | undefined = this._listeners.get(eventName);

    if (listeners != null && listeners.length !== 0) listeners.splice(listeners.indexOf(listener), 1);

    this.emit(EventEmitter.REMOVE_LISTENER_EVENT, eventName, listener);
    
    return this;
  }

  public getMaxListeners(): number {
    return this._maxListeners;
  }

  public setMaxListeners(n: number): EventEmitter {
    this._maxListeners = n;
    
    return this;
  }

  public listenerCount(eventName: string): number {
    const listeners: EventEmitterListener[] | undefined = this._listeners.get(eventName);

    if (listeners == null) return 0;
    
    return listeners.length;
  }

  public eventNames(): string[] {
    return Array.from(this._listeners.keys());
  }

  public listeners(eventName: string): EventEmitterListener[] {

    return Array.from(this.rawListeners(eventName));
  }

  public rawListeners(eventName: string): EventEmitterListener[] {
    return this._listeners.get(eventName) ?? [];
  }

  private _throwLimitException() {
    throw new Error(`Listener limit reached. The current limit is ${this._maxListeners} listeners per event.`);
  }
}

export default EventEmitter;
