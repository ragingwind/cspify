# cspify

> Utility for Polymer, extract to external script file from embedded javascript code installed at bower path.

## What for ?

Since you make a Chrome App with Polymer, you have two options avoid [CSP](https://developer.chrome.com/extensions/contentSecurityPolicy) issue. On the one hand, using vulcanize. on the other hand that don't use a embedded javascript in elements.

`cspity` will be one of the solution. It has introduced by [Chrome Dev Editor](https://github.com/dart-lang/chromedeveditor/blob/738700ea38e9ee8df7f12e8ada1a2af699019317/ide/web/lib/refactor/csp_fixer.dart) to workaround the CSP issue. it works that installing polymer packages via bower, run by `cspify` then you can get two separated html and javascript files that we can use in develop a Chrome App without any CSP issue.

## Usage

- cspify all of html files in your bower path

```
cspify
```

- exclusive with a regexp pattern

```
cspify -e ^demo|^index|^your-exclusive'
```

- cspify specific path that polymer elements has been installed

```
cspify -b fixture/bower_components
```

## Test

For test, you should install polymer elements via bower.

```
cd fixture && bower install
```

Test to run below at root of project

```
npm test
```

Load the Chrome App under `fixture` to your chrome browser
