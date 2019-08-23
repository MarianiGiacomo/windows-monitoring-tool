# windows-monitoring-tool
This is program that can be used to monitor windows work stations and send the information to a server.

Because of the requirements given to me for this project, I had to use GET instead of POST to send the collected system information to the server

In order to run the program, there should be a client certificate named "ca" and be at the root folder and the parameters should be specified in conf.json
The parameters file is used to specify the server url where to send the data, the process names we want to monitor, the interval for sending the information, and other parameters I was required to give.

When running the program with npm start, it automatically passes the config file as parameter. If you do not use npm start, remember to pass the config file as parameter

Instructions on how to create an exe-executable file, to run the programme on a windows machine without the need to install node: https://medium.com/@jamomani/run-node-app-as-single-executable-file-on-windows-mac-or-linux-d4e9a98ef6fd
