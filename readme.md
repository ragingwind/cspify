# cspify

Utilities for Polymer. cspify extract inline javascript code from the components installed bower path to external script.

## How to

- cspify all of .html files in your default bower path in relative current path

```
cspify
```

- exclusive with a regexp pattern

```
cspify -e ^demo|^index|^your-exclusive'
```

- cspify specific bower path

```
cspify -b fixture/bower_components
```

## For test
Follow these steps

```
# bower install

cd fixture
bower install

## run npm test

cd ..
npm test

or in fixture directory

cspify

## Load this Chrome Apps to your chrome browser
```
