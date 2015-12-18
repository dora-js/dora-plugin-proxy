var $ = require('jquery');


$('#J_SendRequest').on('click', function(e){
  $.ajax({
    url: 'x.do',
    type: 'GET',
    dataType: 'json'
  }).done(function (data, status, jqXHR) {
    console.log('AJAX',data, status, jqXHR);
    $('#J_RequestContent').text(JSON.stringify(data, null, 4));
  })
});

$('#J_SendRequest_JSONP').on('click', function(e){
  $.ajax({
    url: 'y.do',
    jsonp: "cb",
    dataType: "jsonp"
  }).done(function (data, status, jqXHR) {
    console.log('JSONP',data, status, jqXHR);
    $('#J_RequestContent_JSONP').text(JSON.stringify(data, null, 4));
  })
})

$('#J_Pagenator').jqPaginator({
    totalPages: 100,
    visiblePages: 10,
    currentPage: 1,
    onPageChange: function (num, type) {
      var pageSize = $('#J_PageSize').val();
      var data = {};
      data.pageSize = pageSize;
      data.currentPage = num;
      $.ajax({
        url: 'z.do',
        dataType: "json",
        type: 'POST',
        data: data
      }).done(function (data, status, jqXHR) {
        console.log('post',data, status, jqXHR);
        var html = '';
        for(var i = 0; i < data.dataList.length; i++){
          html += '<tr><td>' + data.dataList[i].id + '</td><td>' + data.dataList[i].first + '</td><td>' + data.dataList[i].last + '</td></tr>';
        }
        $('#J_Table').find('tbody').html(html);
      });
    }
});