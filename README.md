# PostCSS Breakpoints [![Build Status][ci-img]][ci]

[PostCSS] plugin Breakpoint viewport sizes and media queries..

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/minhtranite/postcss-breakpoints.svg
[ci]:      https://travis-ci.org/minhtranite/postcss-breakpoints

```css
@breakpoint 0 543px {
    body {
        background: red;
    }
}

@breakpoint-up sm {
    body {
        background: orange;
    }
}
```

```css
@media (min-width: 0) and (max-width: 543px) {
    body {
        background: red;
    }
}

@media (min-width: 544px) {
    body {
        background: orange;
    }
}
```

## Usage

```js
postcss([ require('postcss-breakpoints')({options}) ])
```

See [PostCSS] docs for examples for your environment.

## Options

### breakpoints

- Type: object
- Default:
```js
breakpoints: {
     xs: '0 543px',
     sm: '544px 767px',
     md: '768px 991px',
     lg: '992px 1199px',
     xl: '1200px'
}
```

### prefix

- Type: string
- Default: ""

## Rules

### Breakpoint

#### Syntax: `@[prefix]breakpoint min [max]`

#### Example
 
```
@breakpoint 0 1200px
@breakpoint 1200px
```
 
### Breakpoint up

#### Syntax: `@[prefix]breakpoint-up breakpoint`
#### Example

```
@breakpoint-up xs
@breakpoint-up sm
@breakpoint-up md
@breakpoint-up lg
@breakpoint-up xl
```

### Breakpoint down

#### Syntax: `@[prefix]breakpoint-down breakpoint`
#### Example

```
@breakpoint-down xs
@breakpoint-down sm
@breakpoint-down md
@breakpoint-down lg
```

### Breakpoint only

#### Syntax: `@[prefix]breakpoint-only breakpoint`
#### Example

```
@breakpoint-only xs
@breakpoint-only sm
@breakpoint-only md
@breakpoint-only lg
@breakpoint-only xl
```

### Breakpoint between

#### Syntax: `@[prefix]breakpoint-between breakpoint breakpoint`
#### Example

```
@breakpoint-between xs sm
@breakpoint-between sm md
@breakpoint-between md lg
```
