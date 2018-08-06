;((window, undefined)=>{
  "use strict";
  document.querySelector('#title-h1').addEventListener('click', (e)=>{
    alert(1);
    console.log(window);
    console.log('没错，我就是帅气的前端');
  })

})(window, undefined);
