#
# TcpIpPython.py
#
# The following python script demonstrates how to send commands to get/set 
# parameters to the drive via TCP/IP protocol.

import requests

URL = "http://10.223.125.74/_cmd"

#HTTP GET request with PARAMS as parameter
def copleyGet(id):
    PARAMS = {'type': "get", 'ids[]': [id]}
    sendGet = requests.get(url=URL, params=PARAMS)
    return sendGet.json()

# HTTP SET request with PARAMS as parameter
def copleySet(id, value):
    PARAMS = {'type': "set", 'params[0][id]': id, 'params[0][value]': value}
    sendSet = requests.get(url=URL, params=PARAMS)
    return sendSet.json()


response =copleySet(0x78, 10)
print(response)
response = copleyGet(0x78)
print(response)
