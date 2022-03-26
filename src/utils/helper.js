export function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

export function maxStrLength(number,str){ 
    if(str.length > number){
      const newStr = str.substring(0 , number) + '...'
      return newStr;
    }
    return str;
  }