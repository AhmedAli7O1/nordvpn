# nordvpn

unofficial NordVPN linux client ( command line interface )

![terminal](/terminal.gif)

## Features
* easy to use interactive command line interface.
* enter your username and password only once.
* automatically find the best server for you.
* portable to linux, and doesn't require node/npm.


## System Requirements
* 64 bit linux operating system.
* openvpn installed

## Setup

download the latest release
```bash
sudo curl -L "https://github.com/AhmedAli7O1/nordvpn/releases/latest/download/nordvpn" -o /usr/local/bin/nordvpn

sudo chmod +x /usr/local/bin/nordvpn
```

instead you can install specific binary version from [here](https://github.com/AhmedAli7O1/nordvpn/releases)

## Usage
start the vpn using `sudo nordvpn`, the first time it's going to prompt you to enter your nordvpn username and password, however it will be saved in `/home/${USER}/.nordvpn/auth.txt` to be used later and avoid writing the user/pass everytime.

next it'll prompt you to search and select a country, after this you'll have to select one of the supported protocols (tcp, and udp)

now it'll sort all available servers by the selected country, protocol, and current load.

it'll select the best server, download it's configurations file, append your credentials and connect to this server using the native openvpn implementation on your system.


