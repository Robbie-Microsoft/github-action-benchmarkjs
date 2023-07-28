const Benchmark = require('benchmark');
const suite = new Benchmark.Suite();
const { fib } = require('./index');

suite
    .add('fib(10)', () => {
        setTimeout(() => {
            fib(10);
        }, 2000);
    })
    .add('fib(20)', () => {
        setTimeout(() => {
            fib(10);
        }, 2000);
    })
    .on('cycle', (event) => {
        console.log(String(event.target));
    })
    .run();
