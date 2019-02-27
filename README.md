# SUIT 


#### Description
SUIT (Science User Interface and Tools) repository contains applications build on the Firefly Toolkit.  It is meant to be used with [Firefly] (https://github.com/Caltech-IPAC/firefly)


#### Build Instuctions
 
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
        gradle :suit:onlinehelp :suit:warAll
   
 


