const mapForMap = (f: (a: any) => any) => (a: Map<any, any>) => new Map([...a].map(([key, value]) => [key, f(value)]));
const mapForSet = (f: (a: any) => any) => (a: Map<any, any>) => new Set([...a].map(f));
const entriesMapIntoObj = (f: (arg0: any) => any) => (xs: any[]) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment
  xs.reduce((acc: any, [key, value]: any) => ({ ...acc, [key]: f(value) }), {});
const mapForObj = (f: (a: any) => any) => (a: { [s: string]: unknown } | ArrayLike<unknown>) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  entriesMapIntoObj(f)(Object.entries(a));
const getType = (a: any) => Object.prototype.toString.call(a);

export const clone = (a: any) => {
  const type = getType(a);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, no-nested-ternary
  return type === '[object Array]'
    ? // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      a.map(clone)
    : // eslint-disable-next-line no-nested-ternary
    type === '[object Map]'
    ? // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      mapForMap(clone)(a)
    : // eslint-disable-next-line no-nested-ternary
    type === '[object Set]'
    ? // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      mapForSet(clone)(a)
    : // eslint-disable-next-line no-nested-ternary
    type === '[object Object]'
    ? // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      mapForObj(clone)(a)
    : type === '[object Date]'
    ? // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      new Date(a)
    : a;
};
