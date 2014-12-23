frontend-lab
============

A gulp setup to test out ideas and learn front-end techniques. Initialize small example, have gulp watch it and code to your heart's content.  Rinse and repeat.

## The need

In front end coding, as in all coding, you learn by doing. That means crafting small examples that illustrate specific ideas.  While it's fun to experiment,  the basic html/css/js setup can feel tedious and limiting. After all, when coding up themes to our favorite cms or app, we have access to various conveniences like automation tools, templating, and packagers. Why not when fooling around?

So here is a setup I use to create and run "mini-labs" in front end, quick one off thought experiments.

## The toolchain

These are the tools this setup uses to make testing new ideas both easy to start and powerful to explore. You can see them in the package.json devDependencies .

- [gulp](https://github.com/gulpjs/gulp/) for creating, watching and generating each lab
- [gulp-swig](https://github.com/colynb/gulp-swig) for templating html more quickly and dynamically rather than repeatedly creating structures
- [gulp-ruby-sass](https://github.com/sindresorhus/gulp-ruby-sass/) for generating the css from sass
- [browserify](https://github.com/substack/node-browserify) for testing out various javascript widgets that come neatly packaged up with npm
- [browser-sync](https://github.com/shakyShane/browser-sync) for not having to refresh my browser and testing on multiple browsers

## Requirements

You'll need nodejs and gulp which coordinates all the tools mentioned to work together so you can focus on just coding.

```bash
$ npm install --global gulp
```

I also use ruby Sass:

```bash
$ gem install sass
```


## Install

Clone the repository which serves as the lab's starting point and have it install the tools required.

```bash
$ git clone https://github.com/yuvilio/frontend-lab
...
$ cd frontend-lab/
$ npm install
```


## Using

I cut my projects into "batches" and cut batches into "names". Batches can be more general umbrellas and names are the working unit.  I also like to number the names so I can keep track of what item I coded first, but that's a personal preference.

Let's kick off an an example about toying with css floats:

```bash
$ gulp init --batch learn-some-css --name 006-floats
```

This generates the basic files I will be editing.

```bash
$ find lab/learn-some-cs/006-floats/
lab/learn-some-cs/006-floats/
lab/learn-some-cs/006-floats/js
lab/learn-some-cs/006-floats/js/source.js
lab/learn-some-cs/006-floats/index.swig
lab/learn-some-cs/006-floats/sass
lab/learn-some-cs/006-floats/sass/styles.scss
$  
```

Then we can have the various tools watch over it and generate/refresh the result:

```bash
$ gulp browserSync --batch learn-some-css --name 006-floats
```

This will also launch the server and kick off your default browser to ```http://localhost:4266/```. We'll get to that in a moment.

Edit the files (index.swig, styles.scss...) in the ```lab/``` name you just created and whenever you save them the results will be generated to equivalent directory in dist/:

```bash
$ find dist/learn-some-css/006-floats/
dist/learn-some-css/006-floats/
dist/learn-some-css/006-floats/index.html
dist/learn-some-css/006-floats/img
dist/learn-some-css/006-floats/js
dist/learn-some-css/006-floats/js/source.js
dist/learn-some-css/006-floats/css
dist/learn-some-css/006-floats/css/styles.css.map
dist/learn-some-css/006-floats/css/styles.css
$
```

Back at the browser refresh and find the project (under the 'dist/' directory). and click on  ```index.html```. In our example case, this would be ```http://localhost:4266/dist/learn-some-css/006-floats/index.html```. You'll see the latest generated version and browerSync will refresh whenever you make any changes in the lab.

### Where is my html file to edit?

It's the ```index.swig``` file.  This way,  you can enter plain html _as well as_ [swig template tags](http://paularmstrong.github.io/swig/docs/) for less tedious html writing when what you want to enter is more complex.

### How do I use browserify?

Simply ```npm install``` the widgets you are using somewhere in the ```lab/``` directory structure. (for example in ```lab/learn-some-cs/006-floats/js``` or even in ```./lab``` or ```./``` if you want one big bucket to hold them all).

For example if we wanted to use the [domquery](https://github.com/npm-dom/domquery) library, first install it.

```bash
$ npm install domquery
```

Then make use of it in your lab's ```source.js``` (e.g.: ```lab/learn-some-cs/006-floats/js/source.js``` )

```javascript
var dom = require('domquery');
...

```

When you save the file, browserify will bundle that library into the resulting ```source.js``` file in ```dist/```.

### Will you support ___ template engine, css precompiler, js testing framework ... ?

For now, probably no unless it's really worth it. This is just a quick and dirty setup that I use and figured I would share as is. But feel free to fork, adjust or suggest if you think there is something missing.

When you save, it will get bundled into the result source.js in your 'dist/'

## Tips


- Use the tools! Use the Sass to ease up your css writing. Use [swig](http://paularmstrong.github.io/swig/docs) templating to make complicated html examples faster. Use browserify to explore the wonderous world of front end javascript npm modules. So many to choose from at [npmsearch](http://npmsearch.com).

- Keep your examples focused on doing one thing. Exploring and verifying on some css properties. Honing your layout knowledge, or responsive ideas.

- It's not just about new examples. Have a strange style, js issue that is flustering you? Maybe it's hard to solve because there is so much going on in that page. Try to isolate _just_ the relevant html/js/css back in a lab example and see if that helps you see what needs nudging or rethinking.

- Feel free to adjust the starter templates that gulp init uses to make your html/scss/js . They are in the ```templates/``` folder.

- Feel free to include common baseline styles in your styles.scss . In your gulpfile., add them to the ```loadPath``` (I have [bourbon](http://bourbon.io/) ones added right now, feel free to comment those out and/or add your own.) and then, in your example's styles.scss make use of them through importing with something like```scss  @import '../../sass/some-baseline-styles.scss'; ```

- Feel free to adjust the gulpfile and package.json.  Want to use browserify transforms like [reactify](https://github.com/andreypopp/reactify) for example? Just ```npm install``` it and  add the transform code to the gulpfile.js or package.json. This is all but a starting point.

- Create as many batches and names as you want. This is your personal local lab, not a public [codepen](http://codepen.io). It is here for you to experiment on whatever "What if I code this?" question that enters your mind.

- Having said that, if you cook something tasty, consider copying over publicly to codepen to build your street cred and show others.
