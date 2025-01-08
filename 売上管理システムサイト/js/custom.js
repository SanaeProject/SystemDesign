window.onload = function () {
  //今日の日時を表示
  const date = new Date();

  const yyyy = date.getFullYear();
  const mm = ("0" + (date.getMonth() + 1)).slice(-2);
  const dd = ("0" + date.getDate()).slice(-2);

  if (document.getElementById("today") !== null) {
    document.getElementById("today").value = `${yyyy}-${mm}-${dd}`;
  }
};
