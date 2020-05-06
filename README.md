# SUIT 


## Description
The SUIT (Science User Interface and Tools) repository contains applications built on the Firefly Toolkit.
It is meant to be used with [Firefly](https://github.com/Caltech-IPAC/firefly).

The principal current application is "suit", otherwise known as the Portal Aspect application, which
contains both the Portal search screens and visualization capabilities, and the "slate" endpoint that
is used for Python-based image and table visualizations.


## Build Instuctions
 
 - Install [JDK 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)   
   
 - Install [Gradle 4.x](https://gradle.org/install/)
 
 - Install [Node.js 8.x](https://nodejs.org/en/download/)
 
 - Install [yarn](https://yarnpkg.com/)
 
       npm install yarn -g

 - Install [HTMLDOC](https://www.msweet.org/htmldoc/)

 - Clone `firefly`, `suit`, and `suit-onlinehelp' repositories:

        git clone https://github.com/Caltech-IPAC/firefly
        git clone https://github.com/lsst/suit
        git clone https://github.com/lsst/suit-onlinehelp
      
 - Switch to the git branch you want to build on.  This should be done on all repositories.  
   Refer to https://github.com/Caltech-IPAC/firefly/blob/dev/docs/tags-and-branches.md for `firefly` branching scheme.
   
 - In a terminal/console/command prompt, enter:
 
        cd suit
        gradle :suit:warAll
   
### Release configuration management

The SUIT build process provides for the ability to include in a release of the SUIT source code an explicit statement of the Firefly release (Github tag) against which it is to be built.

The philosophy of use of this feature is that `suit:master` will **not** use that feature, so that a standard build of the package from the tip of `master` will by default be performed against the tip of the Firefly default branch (which is `dev` for Firefly, not `master`).
However, in a release branch of `suit`, the feature will be used to constrain the build to a released version of Firefly, by setting that tag in a `config/firefly_build.tag` file in the repo.
**Edits to that file should always be performed in separate commits** and not commingled with any code, documentation, or release note changes, so that these commits can rigorously be excluded from merging to `suit:master`.

Test builds of `suit` against specific non-release versions of Firefly can be made by creating a `suit` branch in which the `config/firefly_build.tag` file is set appropriately.

#### Details

There are 2 ways to specify the tag:

1. set it in `firefly.tag.name` property
2. set it in a file referenced by a `firefly.tag.file` property

**Examples:**

`gradle -Pfirefly.tag.name=abc123 suit:checkoutFirefly`

The build will rightfully complain that 'abc123' does not match any tag or branch.

The default value of `firefly.tag.file` is set to `config/firefly_build.tag`.
Let's try using that file.

`gradle suit:checkoutFirefly`

This produces a "tag not found" error, because there's nothing in the file.
Now try placing a tag into the file and run it again.

```
echo 'master' > config/firefly_build.tag
gradle suit:checkoutFirefly
git -C ../firefly branch
```

This sets the Firefly version to use to "master", easily verified by running `git branch` in the `firefly` directory after this.

As demonstrated, there are many ways to use this.
It can be passed in at the command line.
It can be specified in a file.
You can also have different tags or different files for each of the environments if needed.
