const postcss = require('postcss');

/**
 * Create rule name
 * @param rule
 * @param prefix
 * @returns {*}
 */
function ruleName(rule, prefix) {
    prefix = prefix || '';
    return prefix + rule;
}

/**
 * Check breakpoint value valid
 * @param value
 * @returns {boolean}
 */
function validValue(value) {
    return !(typeof value === 'undefined' || value === null);
}

/**
 * Check breakpoint valid
 * @param breakpoint
 * @param breakpoints
 * @param requiredMax
 * @returns {boolean}
 */
function validBreakpoint(breakpoint, breakpoints, requiredMax) {
    const keys = Object.keys(breakpoints);
    const index = keys.indexOf(breakpoint);
    const match = breakpoints[breakpoint];
    if (index === -1 || !match) {
        return false;
    }
    requiredMax = requiredMax || false;
    return !(requiredMax && match.indexOf(' ') === -1);
}

function throwRuleParamsError(rule, reasons) {
    let message = 'Invalid argument of rule "@' + rule.name + '"';
    if (reasons) {
        message += ': ' + reasons;
    }
    throw rule.error(message, {
        plugin: 'postcss-breakpoints'
    });
}

/**
 * Create @media rule
 * @param min
 * @param max
 * @param rule
 * @returns {AtRule}
 */
function mediaRule(min, max, rule) {
    if (!validValue(min) && !validValue(max)) {
        throw new Error('Invalid argument');
    }
    const breakpoints = [];
    if (validValue(min)) {
        breakpoints.push('(min-width: ' + min + ')');
    }
    if (validValue(max)) {
        breakpoints.push('(max-width: ' + max + ')');
    }
    return postcss.atRule({
        name: 'media',
        params: breakpoints.join(' and '),
        nodes: rule.nodes,
        parent: rule.parent,
        raws: rule.raws
    });
}

/**
 * Breakpoint rule
 * @param rule
 */
function breakpointRule(rule) {
    if (!rule.params) {
        throwRuleParamsError(rule, 'empty argument');
    }
    const args = rule.params.split(' ');
    rule.replaceWith(mediaRule(args[0], args[1], rule));
}

/**
 * Breakpoint up rule
 * @param rule
 * @param breakpoints
 */
function breakpointUpRule(rule, breakpoints) {
    if (!rule.params) {
        throwRuleParamsError(rule, 'empty argument');
    }
    if (!validBreakpoint(rule.params, breakpoints)) {
        throwRuleParamsError(
            rule,
            'breakpoint "' + rule.params + '" is invalid'
        );
    }
    const args = breakpoints[rule.params].split(' ');
    rule.replaceWith(mediaRule(args[0], null, rule));
}

/**
 * Breakpoint down rule
 * @param rule
 * @param breakpoints
 */
function breakpointDownRule(rule, breakpoints) {
    if (!rule.params) {
        throwRuleParamsError(rule, 'empty argument');
    }
    if (!validBreakpoint(rule.params, breakpoints, true)) {
        throwRuleParamsError(
            rule,
            'breakpoint "' + rule.params + '" is invalid'
        );
    }
    const args = breakpoints[rule.params].split(' ');
    rule.replaceWith(mediaRule(null, args[1], rule));
}

/**
 * Breakpoint only rule
 * @param rule
 * @param breakpoints
 */
function breakpointOnlyRule(rule, breakpoints) {
    if (!rule.params) {
        throwRuleParamsError(rule, 'empty argument');
    }
    if (!validBreakpoint(rule.params, breakpoints)) {
        throwRuleParamsError(
            rule,
            'breakpoint "' + rule.params + '" is invalid'
        );
    }
    const args = breakpoints[rule.params].split(' ');
    rule.replaceWith(mediaRule(args[0], args[1], rule));
}

/**
 * Breakpoint between rule
 * @param rule
 * @param breakpoints
 */
function breakpointBetweenRule(rule, breakpoints) {
    if (!rule.params) {
        throwRuleParamsError(rule, 'empty argument');
    }
    const names = rule.params.split(' ');
    if (names.length !== 2) {
        throwRuleParamsError(rule, 'invalid argument');
    }
    if (!validBreakpoint(names[0], breakpoints)) {
        throwRuleParamsError(rule, 'breakpoint "' + names[0] + '" is invalid');
    }
    if (!validBreakpoint(names[1], breakpoints, true)) {
        throwRuleParamsError(rule, 'breakpoint "' + names[1] + '" is invalid');
    }
    const argFirst = breakpoints[names[0]].split(' ');
    const argSecond = breakpoints[names[1]].split(' ');
    rule.replaceWith(mediaRule(argFirst[0], argSecond[1], rule));
}

module.exports = postcss.plugin('postcss-breakpoints', function (opts) {
    const breakpoints = {
        xs: '0 543px',
        sm: '544px 767px',
        md: '768px 991px',
        lg: '992px 1199px',
        xl: '1200px'
    };

    opts = opts || {};
    opts.breakpoints = opts.breakpoints || breakpoints;
    opts.prefix = opts.prefix || '';

    return function (root) {
        root.walkAtRules(function (rule) {
            if (rule.name === ruleName('breakpoint', opts.prefix)) {
                breakpointRule(rule);
            }
            if (rule.name === ruleName('breakpoint-up', opts.prefix)) {
                breakpointUpRule(rule, opts.breakpoints);
            }
            if (rule.name === ruleName('breakpoint-down', opts.prefix)) {
                breakpointDownRule(rule, opts.breakpoints);
            }
            if (rule.name === ruleName('breakpoint-only', opts.prefix)) {
                breakpointOnlyRule(rule, opts.breakpoints);
            }
            if (rule.name === ruleName('breakpoint-between', opts.prefix)) {
                breakpointBetweenRule(rule, opts.breakpoints);
            }
        });
    };
});
