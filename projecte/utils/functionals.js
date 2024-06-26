export const _ = {
    compose : (...fns) => x => fns.reduceRight((v, f) => f(v), x),
    asyncCompose : (...fns) => x => fns.reduceRight(async(v, f) => f(await v), x),
    curriedMap : (func) => (array) => array.map(func)
}