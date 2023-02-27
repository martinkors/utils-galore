import EventEmitter from './EventEmitter';

const ONPROPERTYCHANGE_EVENT = 'onPropertyChange';
const ONPROPERTYCHANGING_EVENT = 'onPropertyChanging';

interface IObservable<P = {}> {
  readonly eventEmitter: EventEmitter;
  readonly properties: P;

  setProperties(properties: Partial<P>): void;
  onPropertyChanging(propertyKey: string, value: any): void;
  onPropertyChange(propertyKey: string, value: any): void;
}

class Observable<P extends {[key: string]: any}> implements IObservable<P> {
  public readonly eventEmitter: EventEmitter;
  public readonly properties: P;

  constructor(...args: any[]) {
    this.eventEmitter = new EventEmitter();
    this.properties = args[0] as P;
    this.eventEmitter.on(ONPROPERTYCHANGING_EVENT, this.onPropertyChanging);
    this.eventEmitter.on(ONPROPERTYCHANGE_EVENT, this.onPropertyChange);
  }
  
  public setProperties(properties: Partial<P>): void {
    Object.entries(properties).forEach(([key, value]) => {
      this.eventEmitter.emit(ONPROPERTYCHANGING_EVENT, key, this.properties[key]);
      (this.properties as {[key: string]: any})[key] = value;
      this.eventEmitter.emit(ONPROPERTYCHANGE_EVENT, key, value);
    });
  }

  public onPropertyChanging(propertyKey: string, value: any): void { }
  
  public onPropertyChange(propertyKey: string, value: any): void { }
}

export {
  ONPROPERTYCHANGE_EVENT,
  ONPROPERTYCHANGING_EVENT,
  IObservable
};
