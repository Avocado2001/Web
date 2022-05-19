function getIdDetails() {
    var urlParams;
    (window.onpopstate = function() {
        var match,
            pl = /\+/g, // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function(s) {
                return decodeURIComponent(s.replace(pl, " "));
            },
            query = window.location.search.substring(1);

        urlParams = {};
        while ((match = search.exec(query)))
            urlParams[decode(match[1])] = decode(match[2]);
    })();
    return urlParams;
}
if (getIdDetails().message == "thanhcong") {
    swal({
        title: "SUCCESS",
        text: "Kiểm tra email của bạn để lấy thông tin đăng nhập",
        icon: "success",
        buttons: false,
        dangerMode: true,
    })
}

if (getIdDetails().message == "addmoneysuccess") {
    swal({
        title: "SUCCESS",
        text: "Nạp tiền thành công",
        icon: "success",
        buttons: false,
        dangerMode: true,
    })
}

if (getIdDetails().message == "withdrawmoneysuccess") {
    swal({
        title: "SUCCESS",
        text: "Rút tiền thành công",
        icon: "success",
        buttons: false,
        dangerMode: true,
    })
}
if (getIdDetails().message == "changePassSuccess") {
    swal({
        title: "SUCCESS",
        text: "Mật khẩu đã được thay đổi",
        icon: "success",
        buttons: false,
        dangerMode: true,
    })
}
if (getIdDetails().message == "transferMoneySuccess") {
    swal({
        title: "SUCCESS",
        text: "Giao dịch hoàn tất",
        icon: "success",
        buttons: false,
        dangerMode: true,
    })
}
//auto close lert
function createAutoClosingAlert(selector, delay) {
    var alert = $(selector).alert();
    window.setTimeout(function() { alert.alert('close') }, delay);
}
//nvbar admin
var dropdown = document.getElementsByClassName("dropdown-btn");
var i;

for (i = 0; i < dropdown.length; i++) {
  dropdown[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var dropdownContent = this.nextElementSibling;
    if (dropdownContent.style.display === "block") {
      dropdownContent.style.display = "none";
    } else {
      dropdownContent.style.display = "block";
    }
  });
}