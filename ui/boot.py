try:
    import usocket as socket
except:
    import socket

import os
import time

import webrepl
webrepl.start(password='shrimping')

s = socket.socket()
ai = socket.getaddrinfo("0.0.0.0", 80)
addr = ai[0][-1]

s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
s.bind(addr)
s.listen(5)

def accept_handler(sock):
	res = sock.accept()
	#print("Handling")
	client_s = res[0]
	string_request = client_s.recv(2048).decode('utf-8')
	#print("Request:" + string_request)
	try:
		request_line = string_request.split("\r\n")[0]    # only consider first line
		request_line = request_line.split()     # separate by whitespace
		(request_method, path, request_version) = request_line
		header = ''
		content = ''

		if path == '/':
			path = '/index.html'

		src_path = 'web' + path + '.br'
		src_size = -1

		try:
			src_size = os.stat(src_path)[6]
		except Exception as e:
			pass

		if src_size != -1 and request_method in ['GET', 'HEAD']:
			#print("GET "+ path)
			header += 'HTTP/1.1 200 OK\r\n'
			header += 'Content-Type: text/html; charset=UTF-8\r\n'
			header += 'Content-Encoding: br\r\n'
			header += 'Content-Length: ' + str(src_size) + '\r\n'
			header += '\r\n'

			client_s.send(header)
			#print("Sent "+ header)

			time.sleep(0.1)

			with open(src_path, 'r') as f:
				chunkCount = 0
				while True:
					chunk = f.read(1024)
					if chunk != '':
						client_s.write(chunk)
						#print("Sent chunk " + str(chunkCount) + ":" + str(len(chunk)))
						chunkCount = chunkCount + 1
						time.sleep(0.01)
					else:
						#print("Last chunk sent")
						break

		else:
			h += 'HTTP/1.1 404 Not Found\r\n'
			h += 'Content-Length: 9\r\n'
			h += '\r\n'

			client_s.send(bytes(h, 'ascii'))

			client_s.write(bytes('Not found', 'ascii'))

	except Exception as e:
		print("Exception", e)
	finally:
		client_s.close()

s.setsockopt(socket.SOL_SOCKET, 20, accept_handler)
