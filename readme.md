# cspify

Utilities for Polymer. cspify extract inline javascript code from the components installed bower path to external script.

## WARNING

We don't have many test for this. We have tested a simple Chrome Apps in this project. Futhermore this tool still not regiter on npm so you should install manually via github and `npm link`

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

![](https://raw.githubusercontent.com/webapplications-kr/cspify/snapshot/snapshot.png)
