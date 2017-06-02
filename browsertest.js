var baseUrl = 'http://localhost:9666';

// Do a simple POST to /longpost
// /longpost takes 10s to respond
$.ajax({
    type: 'POST',
    url: baseUrl + '/longpost',
    data: JSON.stringify({id: 2}),
    processData: false,
    dataType: 'json',
    headers: {
        // add a custom header to make sure a
        // preflight OPTIONS request is made by the browser
        ForcePreflight: 'Yes'
    },
    success: function (data) {
        console.log('got result: ', data);
    },
    dataType: 'json',
    error: function (xhr, textStatus, errorThrown) {
        console.log('error', textStatus, errorThrown);
    }
})
