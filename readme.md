# cspify

Utilities for Polymer. cspify extract inline javascript code from the components installed bower path to external script.

## How to

- cspify anythin

```
cspify
```

- with exclusive

```
cspify -e ^demo|^index|^your-exclusive'
```

- cspify specific targets

```
# the components started with paper. paper-elements would be cspified.
cspify paper-*/*.html'
cspify paper-*

# started with paper and core. paper-elements and core-elements would be cspified.
cspify core-* paper-*
cspify core-*/
```

- cspify on specific bower path

```
cspify -b bower_component'
```

