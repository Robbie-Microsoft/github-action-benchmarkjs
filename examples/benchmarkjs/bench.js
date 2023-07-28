const Benchmark = require('benchmark');
const suite = new Benchmark.Suite();
const { fib } = require('./index');

suite
    .add('fib(10)', async () => {
        await sleep(2000);
        fib(10);
    })
    .add('fib(20)', async () => {
        await sleep(2000);
        fib(20);
    })
    .on('cycle', (event) => {
        console.log(String(event.target));
    })
    .run();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
