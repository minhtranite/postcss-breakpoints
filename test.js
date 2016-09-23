import postcss from 'postcss';
import test from 'ava';
import fs from 'fs';

import plugin from './';

function read(path) {
    return fs.readFileSync(path, 'utf-8');
}

function run(t, name, opts = {}) {
    var input = read('test/fixtures/' + name + '.css');
    var output = read('test/fixtures/' + name + '.out.css');
    return postcss([plugin(opts)])
        .process(input)
        .then(result => {
            t.deepEqual(result.css, output);
            t.deepEqual(result.warnings().length, 0);
        });
}

test('breakpoint', t => {
    return run(t, 'breakpoint', {});
});

test('breakpoint-up', t => {
    return run(t, 'breakpoint-up', {});
});

test('breakpoint-down', t => {
    return run(t, 'breakpoint-down', {});
});

test('breakpoint-only', t => {
    return run(t, 'breakpoint-only', {});
});

test('breakpoint-between', t => {
    return run(t, 'breakpoint-between', {});
});

test('custom', t => {
    return run(t, 'custom', {
        breakpoints: {
            bp1: '0 599px',
            bp2: '600px 919px',
            bp3: '920px'
        },
        prefix: 'pcss-'
    });
});


