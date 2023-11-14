# node-js-server
A simple NodeJS server

## Table of Contents
- [Local Setup](#local-setup)
- [Get it](#get-it)

### Local Setup
To see what was developerd, you have to install on your local machine the listed softwares below:
1. Install [git](https://git-scm.com/) to manage Git repository.
2. Install [Yarn](https://yarnpkg.com/) to run the application

***That's it!***

### Get it
First of all, clone the repository `my-js-framework` into your local machine:

```shell
git clone https://github.com/FabioAnsaldi/node-js-server.git
```

### Environment
Now you could run development environment and see the final result or if you want you could edit the project by running it through the local environment

#### Development
Go to the new folder directory by runnig the following commands:
```shell
cd node-js-server
yarn install
yarn run dev
```

> It runs development environment. By dfault you will see wea application at `http://127.0.0.1:4321/`.

On prod environment you should use 
```shell
yarn run start -p [your_choosen_port] -s [your_choosen_root_dir]
```

If you want to see all usable options:
```shell
yarn run start --help
```

```code
A NodeJS server

Options:
  -V, --version          output the version number
  -a, --address <value>  address (default: "127.0.0.1")
  -i, --index <value>    index (default: "")
  -p, --port <value>     port (default: "4321")
  -s, --source <value>   source (default: "")
  -v, --verbose          verbose (default: false)
  -h, --help             display help for command

Example usages:

        $ node-js-server -a 127.0.0.1           # runs server at address 127.0.0.1
        $ node-js-server -i index.html          # set 'index.html' as default visited page
        $ node-js-server -p 4321                # runs server at port 4321
        $ node-js-server -s 'my_folder'         # serves assets at 'my_folder folder
        $ node-js-server -v                     # gives extra log information during process

```

### Contributing
Feel free to make changes to the project files.