# SUIT 

SUIT (Science User Interface and Tools) repository contains applications build on the Firefly Toolkit.  It is meant to be used with [Firefly] (https://github.com/Caltech-IPAC/firefly)


## Setup (todo: These are simplified steps, need to add more here)

 - clone [Firefly] (https://github.com/Caltech-IPAC/firefly) and go the the [Firefly setup] (https://github.com/Caltech-IPAC/firefly#setup)
 - If you went though the firefly setup you have downloaded and installed: tomcat, gradle, java 1.8 or later and node
 - cd to suit and build suit using command: `gradle :suit:war`
 - Start tomcat
 - Deploy build/libs/suit.war to tomcat
 - From a web browser on localhost: localhost:8080/suit/   


