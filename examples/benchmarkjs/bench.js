const Benchmark = require('benchmark');
const suite = new Benchmark.Suite();
// const { fib } = require('./index');

// suite
//     .add('fib(10)', async () => {
//         await sleep(2000);
//         fib(10);
//     })
//     .add('fib(20)', async () => {
//         await sleep(2000);
//         fib(20);
//     })
//     .on('cycle', (event) => {
//         console.log(String(event.target));
//     })
//     .run();

suite
    .add('RegExp#test', async function() {
        // await sleep(10000);
        /o/.test('Hello World!');
    })
    // .add('String#indexOf', async function() {
    //     await sleep(5000);
    //     'Hello World!'.indexOf('o') > -1;
    // })
    // .add('String#match', async function() {
    //     await sleep(5000);
    //     !!'Hello World!'.match(/o/);
    // })
    // add listeners
    .on('cycle', function(event) {
        console.log(String(event.target));
    })
    .run();
    // .on('complete', function() {
    //     console.log('Fastest is ' + this.filter('fastest').map('name'));
    // })
    // run async
    // .run({ 'async': true });

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
