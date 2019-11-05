const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function trimSpace(array) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] == " " || array[i] == "" || array[i] == null || typeof (array[i]) == "undefined") {
      array.splice(i, 1);
      i = i - 1;

    }
  }
  return array;
}

module.exports = {
  formatTime: formatTime,
  trimSpace: trimSpace
}
