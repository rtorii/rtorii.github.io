(function() {
        var pubnub = new PubNub({
            publishKey: 'pub-c-65b706fc-7bda-49da-8851-74c41e99ec0a',
            subscribeKey: 'sub-c-7c93ca12-5534-11ec-9688-76c2d69ab9b3'
        });
        function $(id) {
            return document.getElementById(id);
        }
        var box = $('box'),
            input = $('input'),
            name = $('name')
            channel = 'bench_press';
        pubnub.addListener({
            message: function(obj) {
                box.innerHTML = ('' + obj.message).replace(/[<>]/g, '') + '<br>' + box.innerHTML
            }
        });
        pubnub.subscribe({
            channels: [channel]
        });

        pubnub.fetchMessages(
            {
                channels: [channel],
                end: '15343325004275466',
                count: 100// TODO change later
            },
            (status, response) => {
              // console.log(response.channels["10chat-demo"]);
              for(let i = 0; i < response.channels["bench_press"].length;++i){
                console.log(response.channels["bench_press"][i].message);//message
                box.innerHTML = ('' + response.channels["bench_press"][i].message).replace(/[<>]/g, '') + '<br>' + box.innerHTML
              }
                // handle response
            }
        );


        $('input_fields').addEventListener('keyup', function(e) {
            if ((e.keyCode || e.charCode) === 13) {
              var currentdate = new Date();
              var minutes = currentdate.getMinutes();
              if (minutes < 10){
                minutes = "0"+minutes;
              }


              var datetime =  (currentdate.getMonth()+1) + "/"
                              + currentdate.getDate()  + "/"
                              + currentdate.getFullYear() + " @ "
                              + currentdate.getHours() + ":"
                              + minutes



                pubnub.publish({
                    channel: channel,
                    message: datetime + '  ' + name.value + ': ' + input.value,
                    // x: (name.value = ''),
                    y: (input.value = '')
                });
            }
        });
    })();
