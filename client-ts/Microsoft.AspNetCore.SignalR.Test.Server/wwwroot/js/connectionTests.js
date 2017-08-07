describe('connection', () => {
    it(`can connect to the server without specifying transport explicitly`, done => {
        const message = "Hello World!";
        let connection = new signalR.HttpConnection(ECHOENDPOINT_URL);

        let received = "";
        connection.onDataReceived = data => {
            received += data;
            if (data == message) {
                connection.stop();
            }
        }

        connection.onClosed = error => {
            expect(error).toBeUndefined();
            done();
        }

        connection.start()
            .then(() => {
                connection.send(message);
            })
            .catch(e => {
                fail();
                done();
            });
    });

    eachTransport(transportType => {
        it(`over ${signalR.TransportType[transportType]} can send and receive messages`, done => {
            const message = "Hello World!";
            let connection = new signalR.HttpConnection(ECHOENDPOINT_URL, { transport: transportType });

            let received = "";
            connection.onDataReceived = data => {
                received += data;
                if (data == message) {
                    connection.stop();
                }
            }

            connection.onClosed = error => {
                expect(error).toBeUndefined();
                done();
            }

            connection.start()
                .then(() => {
                    connection.send(message);
                })
                .catch(e => {
                    fail();
                    done();
                });
        });
    });

    it(`msgpack test`, () => {

        let hubMessage = {
            type: 1,
            invocationId: "abc",
            target: "method",
            arguments: [1, "123"],
            nonblocking: true
        };

        var msgPackProtocol = new signalRMsgPack.MessagePackHubProtocol();
        var msg = msgPackProtocol.writeMessage(hubMessage);
        var x = msgPackProtocol.parseMessages(msg);

        expect(x.item).toEqual(hubMessage.item);
    });
});