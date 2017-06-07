export type ParseParams = (results: any, id: any) => any;

export interface IPumpRequestsParams {
  time?: number;
  parseParams?: ParseParams;
}

export interface IDebounceObject {
  time: number;
  fn: Function;
  ids: any[];
  promises: any[];
  timer?: number;
}

function pumpRequests(
  fn: Function,
  { time = 50, parseParams = (results: any, id: any): any => results[id] }: IPumpRequestsParams = {}
): Function {
  // this is a dictionary for holding debouncing sequences
  const debounceObject: IDebounceObject = {
    time,
    fn,
    ids: [],
    promises: []
  };

  return debounce.bind(null, {debounceObject}, parseParams);
}

function debounce(debounceObject: IDebounceObject, parseParams: ParseParams, id: any): Promise<any> {
  // clear old timer
  if (debounceObject.timer) {
    clearTimeout(debounceObject.timer);
  }

  let resolveFunction: Function|undefined;
  // tslint:disable-next-line
  const promise: Promise<any> = new Promise(res => resolveFunction = res);

  debounceObject.ids.push(id);
  // tslint:disable-next-line
  debounceObject.promises.push([id, resolveFunction]);
  debounceObject.timer = setTimeout(async () => {
    const result: any = debounceObject.fn(debounceObject.ids);

    await Promise
      .resolve(result)
      .then((results: any) => {
        debounceObject.promises.forEach(([promiseID, resolve]: any[]) => {
          resolve(parseParams(results, promiseID));
        });
      });

    debounceObject.timer = undefined;
    debounceObject.ids = [];
    debounceObject.promises = [];
  }, debounceObject.time);

  return promise;
}

export default pumpRequests;
